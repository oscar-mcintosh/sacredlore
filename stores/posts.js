import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useMailerStore } from "./mailer";
import { useSupabase } from "../composables/useSupabase";

export const usePostsStore = defineStore("posts", () => {
  // State
  const posts = ref([]);
  const books = ref([]);
  const testaments = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const lastFetchTime = ref(null);
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes

  // Getters
  const postsByBook = (bookName) => posts.value.filter((post) => post?.book_name === bookName);
  const postsByTestament = (testament) => posts.value.filter((post) => post?.testament === testament);
  const postsByAuthor = (profileId) =>
    posts.value.filter((post) => post?.author_profile_id === profileId);
  const postCount = computed(() => posts.value.length);
  
  // Check if cache is still valid
  const isCacheValid = computed(() => {
    if (!lastFetchTime.value) return false;
    return Date.now() - lastFetchTime.value < cacheExpiry;
  });

  // Get posts with pagination support
  const getPosts = computed(() => {
    return {
      posts: posts.value,
      total: posts.value.length,
      hasMore: false // For now, we load all posts. Can be enhanced later
    };
  });

  // Fetch books and testaments
  const fetchBooksAndTestaments = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { supabase } = useSupabase();
      
      const { data: booksData, error: booksError } = await supabase
        .from("books")
        .select("name, testament");

      if (booksError) throw new Error(`Error fetching books: ${booksError.message}`);

      books.value = booksData || [];
      testaments.value = [...new Set(booksData.map((book) => book.testament))];
      
      lastFetchTime.value = Date.now();
    } catch (err) {
      error.value = err.message;
      console.error('Error in fetchBooksAndTestaments:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchPosts = async (forceRefresh = false) => {
    try {
      // Use cache if valid and not forcing refresh
      if (!forceRefresh && isCacheValid.value && posts.value.length > 0) {
        return { posts: posts.value, fromCache: true };
      }

      loading.value = true;
      error.value = null;

      const { supabase } = useSupabase();
      
      const [postsRes, booksRes, testamentsRes] = await Promise.all([
        supabase
          .from("posts")
          .select("*, profiles:author_profile_id(names, surnames, avatar_url)"),
        supabase.from("books").select("*"),
        supabase.from("books").select("testament"),
      ]);
  
      if (postsRes.error) throw new Error(`Error fetching posts: ${postsRes.error.message}`);
      if (booksRes.error) throw new Error(`Error fetching books: ${booksRes.error.message}`);
      if (testamentsRes.error) throw new Error(`Error fetching testaments: ${testamentsRes.error.message}`);
  
      posts.value = postsRes.data || [];
      books.value = booksRes.data || [];
      testaments.value = [...new Set(testamentsRes.data.map((item) => item.testament))];
      
      lastFetchTime.value = Date.now();
      
      return { posts: posts.value, fromCache: false };
    } catch (err) {
      error.value = err.message;
      console.error('Error in fetchPosts:', err);
      throw new Error('Failed to fetch posts. Please try again.');
    } finally {
      loading.value = false;
    }
  };

  const fetchLikedPosts = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { supabase } = useSupabase();
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw new Error(`Error fetching session: ${sessionError.message}`);
      if (!session?.user?.id) throw new Error("User not authenticated.");

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .contains("liked_by", [userId]);

      if (error) throw new Error(`Error fetching liked posts: ${error.message}`);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Error in fetchLikedPosts:', err);
      throw new Error('Failed to fetch liked posts. Please try again.');
    } finally {
      loading.value = false;
    }
  };

  const toggleLikePost = async (postId) => {
    try {
      loading.value = true;
      error.value = null;

      const { supabase } = useSupabase();
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw new Error(`Error fetching session: ${sessionError.message}`);
      if (!session?.user?.id) throw new Error("User not authenticated.");

      const userId = session.user.id;

      const { data: likedPosts, error: likedPostsError } = await supabase
        .from("profiles")
        .select("liked_posts")
        .eq("user_id", userId)
        .single();

      if (likedPostsError) throw new Error(`Error fetching liked posts: ${likedPostsError.message}`);

      const updatedLikes = likedPosts?.liked_posts?.includes(postId)
        ? (likedPosts.liked_posts || []).filter((id) => id !== postId)
        : [...(likedPosts?.liked_posts || []), postId];

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ liked_posts: updatedLikes })
        .eq("user_id", userId);

      if (updateError) throw new Error(`Error toggling like: ${updateError.message}`);

      // Update local state
      const postIndex = posts.value.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        // Initialize liked property if it doesn't exist
        if (posts.value[postIndex].liked === undefined) {
          posts.value[postIndex].liked = false;
        }
        posts.value[postIndex].liked = !posts.value[postIndex].liked;
      }

      return { success: true, liked: !likedPosts?.liked_posts?.includes(postId) };
    } catch (err) {
      error.value = err.message;
      console.error('Error in toggleLikePost:', err);
      throw new Error('Failed to update like status. Please try again.');
    } finally {
      loading.value = false;
    }
  };

  const addPost = async (newPost, supabaseClient = null) => {
    try {
      loading.value = true;
      error.value = null;

      // Use provided client or fall back to useSupabase
      const supabase = supabaseClient || useSupabase().supabase;
      
      // Add status field if not provided, default to 'published'
      const postData = {
        ...newPost,
        status: newPost.status || 'published'
      };
      
      console.log('Attempting to insert post data:', postData);
      console.log('Using Supabase client:', !!supabaseClient ? 'Provided client' : 'useSupabase client');
      
      // Insert the post and return the inserted data
      const { data, error: insertError } = await supabase
        .from("posts")
        .insert([postData])
        .select('*'); // Add select to return the inserted data
      
      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw new Error(`Error adding post: ${insertError.message}`);
      }
      
      if (data && data.length > 0) {
        const newPostData = data[0];
        console.log('Successfully inserted post:', newPostData);
        
        // Add to local state
        posts.value.unshift(newPostData);
        
        // If the post is published (not a draft), send notifications
        if (postData.status === 'published') {
          try {
            const mailerStore = useMailerStore();
            
            // Send notification to author's followers
            await mailerStore.sendNewPostNotification(postData.author_profile_id, {
              ...newPostData,
              author: {
                name: `${newPostData.profiles?.names || ''} ${newPostData.profiles?.surnames || ''}`.trim() || 'Unknown Author'
              },
              url: `${typeof window !== 'undefined' ? window.location.origin : ''}/posts/${newPostData.id}`
            });
            
            // Send alert to all subscribers
            await mailerStore.sendNewPostAlert({
              ...newPostData,
              author: {
                name: `${newPostData.profiles?.names || ''} ${newPostData.profiles?.surnames || ''}`.trim() || 'Unknown Author'
              },
              url: `${typeof window !== 'undefined' ? window.location.origin : ''}/posts/${newPostData.id}`
            });
          } catch (notificationError) {
            console.warn('Failed to send notifications:', notificationError);
            // Don't fail the post creation if notifications fail
          }
        }
        
        // Invalidate cache
        lastFetchTime.value = null;
        
        return { success: true, post: newPostData };
      }
      
      throw new Error('Failed to create post - no data returned');
    } catch (err) {
      error.value = err.message;
      console.error('Error in addPost:', err);
      throw new Error(`Failed to create post: ${err.message}`);
    } finally {
      loading.value = false;
    }
  };

  const updatePost = async (postId, updatedData, supabaseClient = null) => {
    try {
      loading.value = true;
      error.value = null;

      // Use provided client or fall back to useSupabase
      const supabase = supabaseClient || useSupabase().supabase;
      
      // Ensure status field is preserved if not explicitly changed
      const postData = {
        ...updatedData,
        status: updatedData.status || 'published'
      };

      console.log('Attempting to update post:', postId, 'with data:', postData);
      console.log('Using Supabase client:', !!supabaseClient ? 'Provided client' : 'useSupabase client');

      const { data, error: updateError } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", postId)
        .select('*'); // Add select to return the updated data

      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw new Error(`Error updating post: ${updateError.message}`);
      }
      
      if (data && data.length > 0) {
        const updatedPost = data[0];
        console.log('Successfully updated post:', updatedPost);
        
        // Update local state
        const index = posts.value.findIndex((post) => post?.id === postId);
        if (index !== -1) {
          posts.value[index] = { ...posts.value[index], ...updatedPost };
        }
        
        // Invalidate cache
        lastFetchTime.value = null;
        
        return { success: true, post: updatedPost };
      }
      
      throw new Error('Failed to update post - no data returned');
    } catch (err) {
      error.value = err.message;
      console.error('Error in updatePost:', err);
      throw new Error(`Failed to update post: ${err.message}`);
    } finally {
      loading.value = false;
    }
  };

  const deletePost = async (postId) => {
    try {
      loading.value = true;
      error.value = null;

      const { supabase } = useSupabase();
      
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (deleteError) throw new Error(`Error deleting post: ${deleteError.message}`);
      
      // Remove from local state
      posts.value = posts.value.filter((post) => post?.id !== postId);
      
      // Invalidate cache
      lastFetchTime.value = null;
      
      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error('Error in deletePost:', err);
      throw new Error('Failed to delete post. Please try again.');
    } finally {
      loading.value = false;
    }
  };

  const prevPost = (currentPostId) => {
    const index = posts.value.findIndex((post) => post?.id === currentPostId);
    return index > 0 ? posts.value[index - 1] : null;
  };

  const nextPost = (currentPostId) => {
    const index = posts.value.findIndex((post) => post?.id === currentPostId);
    return index < posts.value.length - 1 ? posts.value[index + 1] : null;
  };

  const relatedPosts = (bookName, currentPostId) =>
    posts.value.filter((post) => post?.book_name === bookName && post?.id !== currentPostId);

  const getPostsByTestament = async (testament) => {
    try {
      loading.value = true;
      error.value = null;

      const { supabase } = useSupabase();
      
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_profile_id (
            names,
            surnames,
            avatar_url
          )
        `)
        .eq('testament', testament)
        .order('book_name', { ascending: true });

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Error in getPostsByTestament:', err);
      throw new Error('Failed to fetch posts by testament. Please try again.');
    } finally {
      loading.value = false;
    }
  };

  const fetchPostsByBook = async (bookName) => {
    try {
      loading.value = true;
      error.value = null;

      const { supabase } = useSupabase();
      
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:author_profile_id (
            names,
            surnames,
            avatar_url
          )
        `)
        .eq('book_name', bookName)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Error in fetchPostsByBook:', err);
      throw new Error('Failed to fetch posts by book. Please try again.');
    } finally {
      loading.value = false;
    }
  };

  const saveDraft = async (postData, supabaseClient = null) => {
    try {
      const draft = {
        ...postData,
        status: 'draft'
      };
      
      if (draft.id) {
        // Update existing draft
        return await updatePost(draft.id, draft, supabaseClient);
      } else {
        // Create new draft
        return await addPost(draft, supabaseClient);
      }
    } catch (err) {
      console.error('Error in saveDraft:', err);
      throw err;
    }
  };

  // Clear error state
  const clearError = () => {
    error.value = null;
  };

  // Clear cache
  const clearCache = () => {
    lastFetchTime.value = null;
  };

  // Get post by ID with fallback to cache
  const getPostById = (postId) => {
    return posts.value.find(post => post?.id === postId) || null;
  };

  // Search posts (basic implementation)
  const searchPosts = (query) => {
    if (!query || query.trim().length < 2) return [];
    
    const searchTerm = query.toLowerCase().trim();
    return posts.value.filter(post => 
      (post.title && post.title.toLowerCase().includes(searchTerm)) ||
      (post.description && post.description.toLowerCase().includes(searchTerm)) ||
      (post.book_name && post.book_name.toLowerCase().includes(searchTerm)) ||
      (post.tags && Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  };

  return {
    // State
    posts,
    books,
    testaments,
    loading,
    error,
    
    // Getters
    postsByBook,
    postsByTestament,
    postsByAuthor,
    postCount,
    isCacheValid,
    getPosts,
    
    // Actions
    fetchPosts,
    fetchBooksAndTestaments,
    fetchLikedPosts,
    toggleLikePost,
    addPost,
    updatePost,
    deletePost,
    prevPost,
    nextPost,
    relatedPosts,
    getPostsByTestament,
    fetchPostsByBook,
    saveDraft,
    
    // Utility methods
    clearError,
    clearCache,
    getPostById,
    searchPosts,
  };
});
