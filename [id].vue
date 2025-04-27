<div class="like-section">
  <button 
    class="like-button" 
    @click="toggleLike"
    :class="{ 'liked': isLiked }"
    :disabled="!authStore.userMeta"
  >
    <i class="ri-heart-3-fill heart-icon"></i>
    <span class="like-count">{{ likeCount }}</span>
  </button>
  
  <!-- New Like Button using post_likes table -->
  <button 
    class="like-button-v2" 
    @click="togglePostLike"
    :class="{ 'liked': hasUserLiked }"
    :disabled="!authStore.userMeta"
  >
    <i class="ri-thumb-up-fill thumb-icon"></i>
    <span class="like-count">{{ post?.likes_count || 0 }}</span>
  </button>
</div> 

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { usePostStore } from '../stores/post';
import { useSupabase } from '../composables/useSupabase';

const authStore = useAuthStore();
const postStore = usePostStore();
const supabase = useSupabase();

const hasUserLiked = ref(false);

const togglePostLike = async () => {
  if (!authStore.userMeta) {
    alert('Please log in to like posts');
    return;
  }

  try {
    if (hasUserLiked.value) {
      // Unlike - delete the record and decrement likes_count
      const { error: likeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', authStore.userMeta.id);

      if (likeError) throw likeError;

      const { error: postError } = await supabase
        .from('posts')
        .update({ 
          likes_count: (post.value.likes_count || 0) - 1 
        })
        .eq('id', postId);

      if (postError) throw postError;
      
      post.value.likes_count = (post.value.likes_count || 0) - 1;
    } else {
      // Like - insert new record and increment likes_count
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: authStore.userMeta.id
        });

      if (likeError) throw likeError;

      const { error: postError } = await supabase
        .from('posts')
        .update({ 
          likes_count: (post.value.likes_count || 0) + 1 
        })
        .eq('id', postId);

      if (postError) throw postError;
      
      post.value.likes_count = (post.value.likes_count || 0) + 1;
    }

    hasUserLiked.value = !hasUserLiked.value;
  } catch (err) {
    console.error('Error toggling post like:', err);
    alert('Failed to update like status');
  }
};

onMounted(async () => {
  // Check if user has liked this post
  if (authStore.userMeta) {
    const { data: likeData } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', authStore.userMeta.id)
      .single();
    
    hasUserLiked.value = !!likeData;
  }
});
</script> 

<style scoped>
/* ... existing styles ... */

.like-button-v2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 1rem;
}

.like-button-v2:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.thumb-icon {
  font-size: 1.5rem;
  color: #ccc;
  transition: all 0.2s ease;
}

.like-button-v2.liked .thumb-icon {
  color: #2ecc71;
  transform: scale(1.1);
}

.like-button-v2:hover .thumb-icon {
  transform: scale(1.1);
}

.like-button-v2.liked:hover .thumb-icon {
  transform: scale(1);
}
</style> 