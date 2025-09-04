import { defineStore } from 'pinia';
import { ref } from 'vue';

import { formatDistanceToNow } from 'date-fns';


export const useCommentsStore = defineStore('comments', () => {
  
  const supabase = useSupabaseClient();

  const comments = ref([]); // Store all comments for the current post
  const loading = ref(false);
  const error = ref(null);

  // Fetch comments for a post
  const fetchComments = async (postId) => {
    loading.value = true;
    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*, profiles:author_profile_id(names, surnames, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      comments.value = data || [];
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching comments:', err);
    } finally {
      loading.value = false;
    }
  };

  // Add new comment
  const addComment = async (postId, content, authorId) => {
    try {
      const { data, error: addError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content,
          author_profile_id: authorId,
          created_at: new Date().toISOString()
        })
        .select('*, profiles:author_profile_id(names, surnames, avatar_url)')
        .single();

      if (addError) throw addError;

      // Add new comment to the list
      comments.value.unshift(data);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    try {
      const { error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (deleteError) throw deleteError;

      // Remove comment from list
      comments.value = comments.value.filter(comment => comment.id !== commentId);
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting comment:', err);
      throw err;
    }
  };

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    deleteComment
  };
});
