import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient();
  const user = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const userMeta = ref(null);
  const isAuthenticated = ref(false);

  const initializeAuth = async () => {
    try {
      loading.value = true;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        user.value = session.user;
        isAuthenticated.value = true;
        await fetchUserMetadata();
      } else {
        isAuthenticated.value = false;
      }
    } catch (err) {
      isAuthenticated.value = false;
    } finally {
      loading.value = false;
    }
  };

  const logIn = async ({ email, password }) => {
    try {
      loading.value = true;
      error.value = null;
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        error.value = authError.message;
        return null;
      }
      
      user.value = data.user;
      isAuthenticated.value = true;
      await fetchUserMetadata();
      return data.user;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const signUp = async ({ email, password, names, surnames }) => {
    try {
      loading.value = true;
      error.value = null;
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            names,
            surnames
          }
        }
      });
      
      if (authError) {
        error.value = authError.message;
        return null;
      }
      
      return data.user;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const logOut = async () => {
    try {
      await supabase.auth.signOut();
      user.value = null;
      userMeta.value = null;
      isAuthenticated.value = false;
    } catch (err) {
      error.value = err.message;
    }
  };

  const fetchUserMetadata = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
        
        userMeta.value = profile;
        user.value = currentUser;
        isAuthenticated.value = true;
      }
    } catch (err) {
      console.error('Error fetching user metadata:', err);
    }
  };

  const getAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching authors:', err);
      return [];
    }
  };

  const uploadAvatarToStorage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = user.value.id + '.' + fileExt;
      const filePath = 'avatars/' + fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.value.id);

      if (error) throw error;
      await fetchUserMetadata();
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const confirmPasswordChange = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    userMeta,
    isAuthenticated,
    initializeAuth,
    logIn,
    signUp,
    logOut,
    fetchUserMetadata,
    getAuthors,
    uploadAvatarToStorage,
    updateProfile,
    confirmPasswordChange
  };
});
