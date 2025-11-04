
class SupabaseDataHandler {
    constructor() {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
        }
    }

    async getCurrentUser() {
        if (!window.supabaseClient) return null;

        const { data: { session } } = await window.supabaseClient.auth.getSession();
        return session?.user || null;
    }

    async saveTypingRun(runData) {
        if (!window.supabaseClient) {
            console.error('Cannot save run: Supabase client not initialized');
            return { error: 'Supabase not initialized' };
        }

        const user = await this.getCurrentUser();
        if (!user) {
            console.error('Cannot save run: User not authenticated');
            return { error: 'User not authenticated' };
        }

        try {
            console.log('Attempting to save typing run for user:', user.id);

            // Save the individual typing run
            const { data, error } = await window.supabaseClient
                .from('typing_runs')
                .insert({
                    user_id: user.id,
                    wpm: runData.wpm || 0,
                    accuracy: runData.accuracy || 0,
                    raw_wpm: runData.rawWpm || runData.wpm || 0,
                    duration: runData.duration || null,
                    characters_typed: runData.charactersTyped || null,
                    errors: runData.errors || 0,
                    test_type: runData.testType || '60s',
                    language: runData.language || 'en'
                })
                .select();

            if (error) {
                console.error('Supabase insert error:', error);
                // Check for foreign key constraint violation
                if (error.code === '23503') {
                    return { error: 'User account not found. Please sign out and sign in again.' };
                }
                throw error;
            }

            // Handle the case where no data is returned or multiple rows are returned
            const runData_result = Array.isArray(data) ? data[0] : data;

            console.log('Typing run saved successfully:', runData_result);

            // The trigger will automatically update user_statistics table
            return { data: runData_result, error: null };
        } catch (error) {
            console.error('Error saving typing run:', error);
            return { error: error.message || 'Failed to save typing run' };
        }
    }

    async getUserStats() {
        if (!window.supabaseClient) {
            console.error('Cannot get stats: Supabase client not initialized');
            return { error: 'Supabase not initialized' };
        }

        const user = await this.getCurrentUser();
        if (!user) {
            console.error('Cannot get stats: User not authenticated');
            return { error: 'User not authenticated' };
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('user_statistics')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            return { data: data || null, error: null };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return { error: error.message };
        }
    }

    async getTypingHistory(limit = 10) {
        if (!window.supabaseClient) {
            console.error('Cannot get history: Supabase client not initialized');
            return { error: 'Supabase not initialized' };
        }

        const user = await this.getCurrentUser();
        if (!user) {
            console.error('Cannot get history: User not authenticated');
            return { error: 'User not authenticated' };
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('typing_runs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { data: data || [], error: null };
        } catch (error) {
            console.error('Error fetching typing history:', error);
            return { error: error.message };
        }
    }

    async getLeaderboard(limit = 10, offset = 0) {
        if (!window.supabaseClient) {
            console.error('Cannot get leaderboard: Supabase client not initialized');
            return { error: 'Supabase not initialized' };
        }

        try {
            // Use the RPC function for paginated leaderboard
            const { data, error } = await window.supabaseClient
                .rpc('get_leaderboard', {
                    limit_count: limit,
                    offset_count: offset
                });

            if (error) throw error;

            return { data: data || [], error: null };
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return { error: error.message };
        }
    }

    async saveTypingSession(sessionData) {
        if (!window.supabaseClient) {
            console.error('Cannot save session: Supabase client not initialized');
            return { error: 'Supabase not initialized' };
        }

        const user = await this.getCurrentUser();
        if (!user) {
            console.log('Guest mode - session not saved to database');
            return { data: null, error: null };
        }

        try {
            // Save the typing run
            const runData = {
                wpm: sessionData.wpm,
                accuracy: sessionData.accuracy,
                rawWpm: sessionData.rawWpm,
                duration: sessionData.duration,
                charactersTyped: sessionData.charactersTyped,
                errors: sessionData.errors,
                testType: sessionData.testType,
                language: sessionData.language
            };

            const saveResult = await this.saveTypingRun(runData);

            if (saveResult.error) {
                throw new Error(saveResult.error);
            }

            // Get updated user statistics
            const statsResult = await this.getUserStats();

            return {
                data: {
                    run: saveResult.data,
                    stats: statsResult.data,
                    session: sessionData
                },
                error: null
            };
        } catch (error) {
            console.error('Error saving typing session:', error);
            return { error: error.message };
        }
    }
}

const supabaseData = new SupabaseDataHandler();

window.supabaseData = supabaseData;