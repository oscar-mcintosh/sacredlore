export const useSupabase = () => {
  const supabase = useSupabaseClient();
  
  const handleError = (error, context = '') => {
    console.error('Supabase error in ' + context + ':', error);
    return error.message || 'An unexpected error occurred.';
  };
  
  const isAuthenticated = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };
  
  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };
  
  const getCurrentSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  };
  
  return {
    supabase,
    handleError,
    isAuthenticated,
    getCurrentUser,
    getCurrentSession
  };
};
