DROP TABLE IF EXISTS user_stats CASCADE; -- To remove old table
DROP TABLE IF EXISTS typing_runs CASCADE;
DROP TABLE IF EXISTS user_statistics CASCADE;
DROP TABLE IF EXISTS usernames CASCADE;

CREATE TABLE usernames (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE typing_runs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES usernames(user_id) ON DELETE CASCADE NOT NULL,
    wpm INTEGER NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    raw_wpm INTEGER,
    duration INTEGER,
    characters_typed INTEGER,
    errors INTEGER,
    test_type VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_statistics (
    user_id UUID REFERENCES usernames(user_id) ON DELETE CASCADE PRIMARY KEY,
    top_speed INTEGER DEFAULT 0,
    average_wpm DECIMAL(6,2) DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0,
    total_runs INTEGER DEFAULT 0,
    total_time_typed INTEGER DEFAULT 0,
    last_run_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE VIEW leaderboard AS
SELECT
    us.user_id,
    un.username,
    us.top_speed,
    us.average_wpm,
    us.average_accuracy,
    us.total_runs,
    ROW_NUMBER() OVER (ORDER BY us.top_speed DESC) as rank
FROM user_statistics us
JOIN usernames un ON us.user_id = un.user_id
WHERE us.top_speed > 0
ORDER BY us.top_speed DESC;

ALTER TABLE usernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

-- Usernames policies
CREATE POLICY "Everyone can view usernames" ON usernames
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own username" ON usernames
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own username" ON usernames
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Typing runs policies
CREATE POLICY "Users can view own typing runs" ON typing_runs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own typing runs" ON typing_runs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own typing runs" ON typing_runs
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own typing runs" ON typing_runs
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view user statistics" ON user_statistics
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own statistics" ON user_statistics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON user_statistics
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_statistics (
        user_id,
        top_speed,
        average_wpm,
        average_accuracy,
        total_runs,
        total_time_typed,
        last_run_date
    )
    SELECT
        NEW.user_id,
        MAX(wpm),
        AVG(wpm)::DECIMAL(6,2),
        AVG(accuracy)::DECIMAL(5,2),
        COUNT(*),
        SUM(COALESCE(duration, 0)),
        MAX(created_at)
    FROM typing_runs
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

CREATE TRIGGER update_stats_after_run
AFTER INSERT OR UPDATE ON typing_runs
FOR EACH ROW
EXECUTE FUNCTION update_user_statistics();

CREATE INDEX idx_usernames_username ON usernames(username);
CREATE INDEX idx_typing_runs_user_id ON typing_runs(user_id);
CREATE INDEX idx_typing_runs_created_at ON typing_runs(created_at DESC);
CREATE INDEX idx_user_statistics_top_speed ON user_statistics(top_speed DESC);

-- Function to check if username is available
CREATE OR REPLACE FUNCTION is_username_available(username_to_check VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM usernames WHERE username = username_to_check
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create/update username for current user
CREATE OR REPLACE FUNCTION set_username(new_username VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();

    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    -- Check if username is already taken by another user
    IF EXISTS (
        SELECT 1 FROM usernames
        WHERE username = new_username AND user_id != current_user_id
    ) THEN
        RAISE EXCEPTION 'Username already taken';
    END IF;

    -- Insert or update username
    INSERT INTO usernames (user_id, username)
    VALUES (current_user_id, new_username)
    ON CONFLICT (user_id)
    DO UPDATE SET username = new_username;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_leaderboard(
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
        un.username,
        us.top_speed,
        us.average_wpm,
        us.average_accuracy,
        us.total_runs
    FROM user_statistics us
    JOIN usernames un ON us.user_id = un.user_id
    WHERE us.top_speed > 0
    ORDER BY us.top_speed DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;