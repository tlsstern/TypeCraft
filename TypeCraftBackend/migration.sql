-- Migration Script for TypeCraft Database
-- This script adds missing features to existing tables without dropping them

-- ============================================
-- 1. Add missing constraints if needed
-- ============================================

-- Add ON DELETE CASCADE to typing_runs if not already present
-- (Safe to run - will skip if already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'typing_runs_user_id_fkey'
        AND confdeltype = 'c'
    ) THEN
        ALTER TABLE public.typing_runs
        DROP CONSTRAINT IF EXISTS typing_runs_user_id_fkey;

        ALTER TABLE public.typing_runs
        ADD CONSTRAINT typing_runs_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Add ON DELETE CASCADE to user_statistics if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_statistics_user_id_fkey'
        AND confdeltype = 'c'
    ) THEN
        ALTER TABLE public.user_statistics
        DROP CONSTRAINT IF EXISTS user_statistics_user_id_fkey;

        ALTER TABLE public.user_statistics
        ADD CONSTRAINT user_statistics_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================
-- 2. Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE public.typing_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Create or Replace RLS Policies
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own typing runs" ON public.typing_runs;
DROP POLICY IF EXISTS "Users can insert own typing runs" ON public.typing_runs;
DROP POLICY IF EXISTS "Users can update own typing runs" ON public.typing_runs;
DROP POLICY IF EXISTS "Users can delete own typing runs" ON public.typing_runs;
DROP POLICY IF EXISTS "Everyone can view user statistics" ON public.user_statistics;
DROP POLICY IF EXISTS "Users can insert own statistics" ON public.user_statistics;
DROP POLICY IF EXISTS "Users can update own statistics" ON public.user_statistics;

-- Recreate policies
CREATE POLICY "Users can view own typing runs" ON public.typing_runs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own typing runs" ON public.typing_runs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own typing runs" ON public.typing_runs
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own typing runs" ON public.typing_runs
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view user statistics" ON public.user_statistics
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own statistics" ON public.user_statistics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON public.user_statistics
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. Create Leaderboard View
-- ============================================

DROP VIEW IF EXISTS public.leaderboard;

CREATE VIEW public.leaderboard AS
SELECT
    user_id,
    username,
    top_speed,
    average_wpm,
    average_accuracy,
    total_runs,
    ROW_NUMBER() OVER (ORDER BY top_speed DESC) as rank
FROM public.user_statistics
WHERE top_speed > 0
ORDER BY top_speed DESC;

-- ============================================
-- 5. Create Trigger Function for Auto-Update
-- ============================================

CREATE OR REPLACE FUNCTION public.update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_statistics (
        user_id,
        username,
        top_speed,
        average_wpm,
        average_accuracy,
        total_runs,
        total_time_typed,
        last_run_date
    )
    SELECT
        NEW.user_id,
        NULL, -- Username will be updated separately via application
        MAX(wpm),
        AVG(wpm)::DECIMAL(6,2),
        AVG(accuracy)::DECIMAL(5,2),
        COUNT(*),
        SUM(COALESCE(duration, 0)),
        MAX(created_at)
    FROM public.typing_runs
    WHERE user_id = NEW.user_id
    ON CONFLICT (user_id)
    DO UPDATE SET
        top_speed = EXCLUDED.top_speed,
        average_wpm = EXCLUDED.average_wpm,
        average_accuracy = EXCLUDED.average_accuracy,
        total_runs = EXCLUDED.total_runs,
        total_time_typed = EXCLUDED.total_time_typed,
        last_run_date = EXCLUDED.last_run_date,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. Create Trigger
-- ============================================

DROP TRIGGER IF EXISTS update_stats_after_run ON public.typing_runs;

CREATE TRIGGER update_stats_after_run
AFTER INSERT OR UPDATE ON public.typing_runs
FOR EACH ROW
EXECUTE FUNCTION public.update_user_statistics();

-- ============================================
-- 7. Create Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_typing_runs_user_id
    ON public.typing_runs(user_id);

CREATE INDEX IF NOT EXISTS idx_typing_runs_created_at
    ON public.typing_runs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_statistics_top_speed
    ON public.user_statistics(top_speed DESC);

CREATE INDEX IF NOT EXISTS idx_user_statistics_username
    ON public.user_statistics(username);

-- ============================================
-- 8. Create RPC Function for Leaderboard
-- ============================================

CREATE OR REPLACE FUNCTION public.get_leaderboard(
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    rank BIGINT,
    user_id UUID,
    username VARCHAR,
    top_speed INTEGER,
    average_wpm DECIMAL,
    average_accuracy DECIMAL,
    total_runs INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROW_NUMBER() OVER (ORDER BY us.top_speed DESC) as rank,
        us.user_id,
        us.username,
        us.top_speed,
        us.average_wpm,
        us.average_accuracy,
        us.total_runs
    FROM public.user_statistics us
    WHERE us.top_speed > 0
    ORDER BY us.top_speed DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Migration Complete
-- ============================================
-- This script is safe to run multiple times (idempotent)
