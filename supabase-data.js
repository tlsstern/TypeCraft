
class SupabaseDataHandler {
    constructor() {
        if (!supabaseClient) {
            console.error('Supabase client not initialized');
        }
    }

    async getCurrentUser() {
        if (!supabaseClient) return null;

        const { data: { session } } = await supabaseClient.auth.getSession();
        return session?.user || null;
    }

    async saveUserStats(stats) {
        if (!supabaseClient) {
            console.error('Cannot save stats: Supabase client not initialized');
            return { error: 'Supabase not initialized' };
        }

        const user = await this.getCurrentUser();
        if (!user) {
            console.error('Cannot save stats: User not authenticated');
            return { error: 'User not authenticated' };
        }

        try {
            const { data: existingStats, error: fetchError } = await supabaseClient
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            let result;
            if (existingStats) {
                // For now, just update with the latest values
                // To properly calculate averages, we'd need to track session count in the database
                result = await supabaseClient
                    .from('user_stats')
                    .update({
                        average_speed_wpm: stats.wpm || existingStats.average_speed_wpm,
                        top_speed_wpm: Math.max(stats.wpm || 0, existingStats.top_speed_wpm || 0),
                        accuracy_percentage: stats.accuracy || existingStats.accuracy_percentage
                    })
                    .eq('user_id', user.id)
                    .select();
            } else {
                result = await supabaseClient
                    .from('user_stats')
                    .insert({
                        user_id: user.id,
                        average_speed_wpm: stats.wpm || 0,
                        top_speed_wpm: stats.wpm || 0,
                        accuracy_percentage: stats.accuracy || 0
                    })
                    .select();
            }

            if (result.error) throw result.error;

            return { data: result.data[0], error: null };
        } catch (error) {
            console.error('Error saving user stats:', error);
            return { error: error.message };
        }
    }

    async getUserStats() {
        if (!supabaseClient) {
            console.error('Cannot get stats: Supabase client not initialized');
            return { error: 'Supabase not initialized' };
        }

        const user = await this.getCurrentUser();
        if (!user) {
            console.error('Cannot get stats: User not authenticated');
            return { error: 'User not authenticated' };
        }

        try {
            const { data, error } = await supabaseClient
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            return { data: data || null, error: null };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return { error: error.message };
        }
    }

    async saveTypingSession(sessionData) {
        if (!supabaseClient) {
            console.error('Cannot save session: Supabase client not initialized');
            return { error: 'Supabase not initialized' };
        }

        const user = await this.getCurrentUser();
        if (!user) {
            console.log('Guest mode - session not saved to database');
            return { data: null, error: null };
        }

        try {
            const stats = {
                wpm: sessionData.wpm,
                accuracy: sessionData.accuracy
            };

            const updateResult = await this.saveUserStats(stats);

            if (updateResult.error) {
                throw new Error(updateResult.error);
            }

            return {
                data: {
                    stats: updateResult.data,
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