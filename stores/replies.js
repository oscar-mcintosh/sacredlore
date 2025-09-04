import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useRepliesStore = defineStore('replies', () => {
  
  const supabase = useSupabaseClient();

  const replies = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch replies for a comment
  const fetchReplies = async (commentId) => {
    loading.value = true;
    try {
      const { data, error: fetchError } = await supabase
        .from('replies')
        .select('*, profiles:author_profile_id(names, surnames, avatar_url)')
        .eq('comment_id', commentId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      replies.value = data || [];
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching replies:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Add new reply
  const addReply = async (commentId, content, authorProfileId) => {
    
    const supabase = useSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('replies')
        .insert({
          comment_id: commentId,
          content: content,
          author_profile_id: authorProfileId
        })
        .select('*, profiles(*)') // Include profile information
        .single();

      if (error) throw error;

      // Initialize the replies array for this comment if it doesn't exist
      if (!replies.value[commentId]) {
        replies.value[commentId] = [];
      }
      
      // Add the new reply to the store
      replies.value[commentId].push(data);
      
      return data;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  // Delete reply
  const deleteReply = async (replyId) => {
    try {
      const { error: deleteError } = await supabase
        .from('replies')
        .delete()
        .eq('id', replyId);

      if (deleteError) throw deleteError;

      // Update local state by removing the deleted reply
      replies.value = replies.value.filter(reply => reply.id !== replyId);
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting reply:', err);
      throw err;
    }
  };

  return {
    replies,
    loading,
    error,
    fetchReplies,
    addReply,
    deleteReply
  };
}); 
