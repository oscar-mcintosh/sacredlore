<template>
  <NuxtLayout name="post" :title="post?.title">
    <div class="container play-container">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">Error loading post</div>

        <div v-else class="row">
            <div class="play-video">
                <video controls autoplay>
                    <source src="assets/images/video.mp4" type="video/mp4">
                </video>

                <div class="tags">
                    <a href="">#Coding</a>
                    <a href="">#HTML</a>
                    <a href="">#CSS</a>
                    <a href="">#Javascript</a>
                </div>
                <h1>{{ post.title }}</h1>
              <!-- POST AUTHOR INFO -->
              <div class="post-author-info-wrap">
                <!-- USER AVATAR -->
                <a href="search-results.html">
                  <figure class="user-avatar tiny liquid">
                    <img :src="post.profiles?.avatar_url" alt="user-01">
                  </figure>
                </a>
                <!-- /USER AVATAR -->
                <p class="post-author-info small light">By: <a href="search-results.html" class="post-author">{{ post.profiles?.names }} {{ post.profiles?.surnames }}</a><span class="separator">|</span>{{ formatDate(post.created_at) }}<span class="separator">|</span><a href="#op-comments" class="post-comment-count">{{ post.comments || 0 }} Comments</a></p>
              </div>
              <!-- /POST AUTHOR INFO -->

                <hr>
                <div class="post-body-container">
                  <div class="post-body" v-html="currentPageContent"></div>
                  
                  <div class="page-controls">
                    <button 
                      class="page-button prev" 
                      @click="previousPage"
                      :disabled="currentPage === 1"
                    >
                      <i class="ri-arrow-left-s-line"></i>
                      Previous Page
                    </button>
                    
                    <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
                    
                    <button 
                      class="page-button next" 
                      @click="nextPage"
                      :disabled="currentPage === totalPages"
                    >
                      Next Page
                      <i class="ri-arrow-right-s-line"></i>
                    </button>
                  </div>
                </div>
                <!-- Add like button section -->
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
                  
                  <!-- Add new thumb button -->
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
                <div v-if="loading" class="loading">Loading...</div>
                    <div v-else-if="error" class="error">Error loading post</div>
                    <div v-else >
                        <div v-if="prev || next" class="breadcrumb-nav">
                            <router-link v-if="prev" :to="`/posts/${prev.id}`" class="breadcrumb-link button left">
                                <span class="button-ornament left"><i class="ri-arrow-left-s-line"></i></span> {{ prev.title }}
                            </router-link>
                            <span class="breadcrumb-separator">|</span>
                            <router-link v-if="next" :to="`/posts/${next.id}`" class="breadcrumb-link button">
                            {{ next.title }} <span class="button-ornament"><i class="ri-arrow-right-s-line"></i></span>
                            </router-link>
                        </div>
                    </div>


                <div class="vid-desciption widget-post comments">
                  <ul class="cmt-pr">
                    <li><span>{{ commentsStore.comments.length }}</span> {{ commentsStore.comments.length === 1 ? 'Comment' : 'Comments' }}</li>
                    <li>
                      <span><i class="icon-sort_by"></i><a href="#" title="">Sort By</a></span>
                    </li>
                  </ul>
                  <!-- Add Comment Form -->
                  <div class="comment-form">
                      <div class="comment-box">
                        <textarea 
                          v-model="newCommentContent" 
                          placeholder="Write a comment..."
                          class="reply-input"
                        ></textarea>
                        <div class="reply-actions">
                          <button 
                            class="submit-button" 
                            @click="addNewComment"
                            :disabled="!newCommentContent?.trim()"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                  </div>
                  <div v-if="commentsStore.loading" class="loading">Loading comments...</div>
                  <div v-else-if="commentsStore.error" class="error">{{ commentsStore.error }}</div>
                  <div v-else class="comments-list">
                      <div v-for="comment in commentsStore.comments" :key="comment.id" class="post-comment">
                        <div class="comment-thread">
                          <div class="comment-header" @click="toggleCommentExpanded(comment.id)">
                            <div class="avatar">
                              <figure class="avatar-image">
                                <img 
                                  :src="comment.profiles?.avatar_url || '/default-avatar.png'" 
                                  :alt="comment.profiles?.names"
                                >
                              </figure>
                            </div>
                            <div class="comment-box">
                              <div class="comment-author">
                                <h4>{{ comment.profiles?.names }} {{ comment.profiles?.surnames }}</h4>
                                <span>{{ formatDate(comment.created_at) }}</span>
                              </div>
                                                          <div class="comment-preview">
                              <p>{{ comment.content.length > 100 ? comment.content.substring(0, 100) + '...' : comment.content }}</p>
                              <div class="comment-meta">
                                <span class="reply-count" v-if="commentReplies[comment.id]?.length">
                                  {{ commentReplies[comment.id].length }} {{ commentReplies[comment.id].length === 1 ? 'reply' : 'replies' }}
                                </span>
                              </div>
                            </div>
                            </div>
                            <div class="expand-arrow" :class="{ 'expanded': expandedComments.includes(comment.id) }">
                              <i class="ri-arrow-down-s-line"></i>
                            </div>
                          </div>
                          
                          <!-- Expanded Comment Content -->
                          <div v-if="expandedComments.includes(comment.id)" class="comment-expanded-content">
                            <div class="full-comment-content">
                              <p>{{ comment.content }}</p>
                              <div class="comment-actions">
                                <button class="reply-button" @click="toggleReplyBox(comment.id)">
                                  <i class="ri-reply-line"></i>
                                  <span>Reply</span>
                                </button>
                                <button class="report-button">Report</button>
                              </div>
                            </div>
                            
                            <!-- Reply Box -->
                            <div v-if="activeReplyBox === comment.id" class="reply-box">
                              <div class="avatar">
                                <figure class="avatar-image">
                                  <img 
                                    :src="authStore.userMeta?.avatar_url || '/default-avatar.png'" 
                                    :alt="authStore.userMeta?.names"
                                  >
                                </figure>
                              </div>
                              <div class="comment-box">
                                <textarea 
                                  v-model="replyContent[comment.id]" 
                                  placeholder="Write a reply..."
                                  class="reply-input"
                                ></textarea>
                                <div class="reply-actions">
                                  <button class="cancel-button" @click="toggleReplyBox(null)">Cancel</button>
                                  <button 
                                    class="submit-button" 
                                    @click="submitReply(comment.id)"
                                    :disabled="!replyContent[comment.id]?.trim()"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <!-- Replies List -->
                            <div v-if="expandedComments.includes(comment.id)">
                              <div v-if="commentReplies[comment.id]?.length" class="replies-list">
                                <div class="replies-header">
                                  <h5>Replies ({{ commentReplies[comment.id].length }})</h5>
                                </div>
                                <div v-for="reply in commentReplies[comment.id]" :key="reply.id" class="reply post-comment">
                                  <div class="avatar">
                                    <figure class="avatar-image">
                                      <img 
                                        :src="reply.profiles?.avatar_url || '/default-avatar.png'" 
                                        :alt="reply.profiles?.names"
                                      >
                                    </figure>
                                  </div>
                                  <div class="comment-box">
                                    <div class="comment-author">
                                      <h4>{{ reply.profiles?.names }} {{ reply.profiles?.surnames }}</h4>
                                      <span>{{ formatDate(reply.created_at) }}</span>
                                    </div>
                                    <div class="comment-content">
                                      <p>{{ reply.content }}</p>
                                      <div class="comment-actions" v-if="authStore.userMeta?.id === reply.author_profile_id">
                                        <button class="delete-button" @click="deleteReplyConfirm(comment.id, reply.id)">
                                          <i class="ri-delete-bin-line"></i>
                                          <span>Delete</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div v-else-if="commentReplies[comment.id] === undefined" class="replies-loading">
                                <div class="loading-spinner"></div>
                                <span>Loading replies...</span>
                              </div>
                              <div v-else class="no-replies">
                                <span>No replies yet. Be the first to reply!</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
            <div class="right-sidebar">
                <div v-if="related.length > 0" class="widget related-posts">
                    <div class="widget-header">
                        <h4>Related Posts</h4>
                    </div>
                    <div class="widget-content">
                        <div class="latest-post-list">
                            <Posts :posts="related" />
                        </div>
                    </div>
                </div>
                <div class="widget">
                    <!-- Latest Posts Widget -->
                    <div class="widget-header">
                        <h4>Latest Posts</h4>
                    </div>
                    <div class="widget-content">
                        <div class="latest-post-list">
                            <Posts 
                                :posts="postsStore.posts.filter(p => p.id !== postId).slice(0, 5)" 
                            />
                        </div>
                    </div>
                    <div class="main_content_posts">
                      <!-- <div class="alith_post_title_small" v-for="post in latestPosts" :key="post.id">
                        <h5><a href="single.html">{{ post.title }}</a></h5>
                        <div class="entry-meta meta-1 font-small color-grey">
                              <span class="post-on">{{ formatDate(post.created_at) }}</span>
                              <span class="hit-count has-dot">{{ post.comments }} Views</span>
                        </div>
                      </div> -->
                  </div>
                </div>   
            </div>
        </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { usePostsStore } from '~/stores/posts';
import { useCommentsStore } from '~/stores/comments';
import { useAuthStore } from '~/stores/auth';
import { useRepliesStore } from '~/stores/replies';
import Posts from '~/components/Posts.vue'

// Page Meta
definePageMeta({
  layout: 'post',
});

// Supabase Client
const config = useRuntimeConfig();
const supabase = createClient(config.public.SUPABASE_URL, config.public.SUPABASE_KEY);

// Store
const postsStore = usePostsStore();
const { fetchPosts, prevPost, nextPost, relatedPosts } = postsStore;

const commentsStore = useCommentsStore();
const authStore = useAuthStore();
const repliesStore = useRepliesStore();

// Variables
const route = useRoute();
const postId = Number(route.params.id);

const post = ref(null);
const loading = ref(true);
const error = ref(null);
const newCommentContent = ref('');
const activeReplyBox = ref(null);
const replyContent = ref({});
const commentReplies = ref({});
const isLiked = ref(false);
const likeCount = ref(0);
const hasUserLiked = ref(false);
const currentPage = ref(1);
const wordsPerPage = ref(500); // Adjust this number to control content per page
const isPageTurning = ref(false);
const expandedComments = ref([]); // Track which comments are expanded

// Add these computed properties
const paginatedContent = computed(() => {
  if (!post.value?.body) return [];
  
  // Convert HTML content to plain text and split into words
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = post.value.body;
  const text = tempDiv.textContent || tempDiv.innerText;
  const words = text.split(/\s+/);
  
  // Group words into pages
  const pages = [];
  for (let i = 0; i < words.length; i += wordsPerPage.value) {
    pages.push(words.slice(i, i + wordsPerPage.value).join(' '));
  }
  
  return pages;
});

const totalPages = computed(() => paginatedContent.value.length);

const currentPageContent = computed(() => {
  if (!post.value?.body) return '';
  
  // Get the HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = post.value.body;
  
  // Split content into paragraphs
  const paragraphs = tempDiv.getElementsByTagName('p');
  let wordCount = 0;
  let startIndex = 0;
  
  // Find the starting paragraph for current page
  for (let i = 0; i < paragraphs.length; i++) {
    const words = paragraphs[i].textContent.split(/\s+/).length;
    if (wordCount + words > (currentPage.value - 1) * wordsPerPage.value) {
      startIndex = i;
      break;
    }
    wordCount += words;
  }
  
  // Create a new div with paragraphs for current page
  const pageContent = document.createElement('div');
  wordCount = 0;
  
  for (let i = startIndex; i < paragraphs.length; i++) {
    const words = paragraphs[i].textContent.split(/\s+/).length;
    if (wordCount + words > wordsPerPage.value) break;
    pageContent.appendChild(paragraphs[i].cloneNode(true));
    wordCount += words;
  }
  
  return pageContent.innerHTML;
});

// Fetch the current post
const fetchPost = async () => {
  const { data, error: fetchError } = await supabase
    .from('posts')
    .select("*, profiles:author_profile_id(names, surnames, avatar_url)") // Include avatar_url
  //   .select('*')
    .eq('id', postId)
    .single();

  if (fetchError) {
    error.value = 'Unable to fetch post';
    console.error(fetchError);
  } else {
    post.value = data;
  }

  loading.value = false;
};

// Breadcrumb links
const prev = computed(() => prevPost(postId));
const next = computed(() => nextPost(postId));

// Related posts
const related = computed(() => {
  return post.value ? relatedPosts(post.value.book_name, postId) : [];
});

// Load data on mount
onMounted(async () => {
  loading.value = true;

  try {
    await fetchPosts(supabase);
    await fetchPost();
    await commentsStore.fetchComments(postId);
    
    // Initialize like status
    isLiked.value = checkIfLiked();
    likeCount.value = post.value?.likes_count || 0;
    
    // Add this new check for post likes
    if (authStore.userMeta) {
      const { data: likeData } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', authStore.userMeta.id)
        .single();
      
      hasUserLiked.value = !!likeData;
    }
  } catch (err) {
    console.error(err);
    error.value = 'Failed to load data.';
  } finally {
    loading.value = false;
  }

  // Add keyboard event listener
  window.addEventListener('keydown', handleKeyPress);
});

// Add cleanup
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

// Add keyboard navigation handler
const handleKeyPress = (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextPage();
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    previousPage();
  }
};

// Add a new comment
const addNewComment = async () => {
  if (!newCommentContent.value.trim()) {
    return
  }
  
  if (!authStore.userMeta?.id) {
    alert('Please log in to comment')
    return
  }

  try {
    await commentsStore.addComment(
      postId,
      newCommentContent.value,
      authStore.userMeta.id
    )
    // Clear the input after successful comment
    newCommentContent.value = ''
  } catch (err) {
    alert('Failed to add comment. Please try again.')
  }
};

const formatDate = (dateString) => {
if (!dateString) return 'Unknown Date';
const date = new Date(dateString);
return date.toLocaleDateString(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
};

const toggleCommentExpanded = async (commentId) => {
  const index = expandedComments.value.indexOf(commentId);
  if (index > -1) {
    // Collapse comment
    expandedComments.value.splice(index, 1);
  } else {
    // Expand comment - fetch replies if not already loaded
    expandedComments.value.push(commentId);
    if (!commentReplies.value[commentId]) {
      try {
        const replies = await repliesStore.fetchReplies(commentId);
        commentReplies.value[commentId] = replies;
      } catch (err) {
        console.error('Error fetching replies:', err);
        commentReplies.value[commentId] = [];
      }
    }
  }
};

const toggleReplyBox = async (commentId) => {
  if (activeReplyBox.value === commentId) {
    activeReplyBox.value = null;
  } else {
    activeReplyBox.value = commentId;
    if (commentId && !commentReplies.value[commentId]) {
      try {
        const replies = await repliesStore.fetchReplies(commentId);
        commentReplies.value[commentId] = replies;
      } catch (err) {
        console.error('Error fetching replies:', err);
      }
    }
  }
};

const submitReply = async (commentId) => {
  if (!authStore.userMeta?.id) {
    alert('Please log in to reply');
    return;
  }

  try {
    // Clear any existing replies for this comment first
    commentReplies.value[commentId] = [];
    
    await repliesStore.addReply(
      commentId,
      replyContent.value[commentId],
      authStore.userMeta.id
    );
    
    // Fetch fresh replies
    const replies = await repliesStore.fetchReplies(commentId);
    commentReplies.value[commentId] = replies;
    
    // Clear input and close reply box
    replyContent.value[commentId] = '';
    activeReplyBox.value = null;
  } catch (err) {
    alert('Failed to add reply. Please try again.');
  }
};

const deleteReplyConfirm = async (commentId, replyId) => {
  if (confirm('Are you sure you want to delete this reply?')) {
    try {
      await repliesStore.deleteReply(replyId);
      // Refresh replies list after deletion
      const replies = await repliesStore.fetchReplies(commentId);
      commentReplies.value[commentId] = replies;
    } catch (err) {
      console.error('Error deleting reply:', err);
      alert('Failed to delete reply. Please try again.');
    }
  }
};

const checkIfLiked = () => {
  if (!authStore.userMeta?.liked_posts) return false;
  return authStore.userMeta.liked_posts.some(id => Number(id) === postId);
};

const toggleLike = async () => {
  if (!authStore.userMeta) {
    alert('Please log in to like posts');
    return;
  }

  try {
    // First check if the profile exists and get current liked_posts
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('liked_posts')
      .eq('user_id', authStore.userMeta.user_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    console.log('Current profile:', profile);
    console.log('Current postId:', postId, typeof postId);

    // Initialize liked_posts array if it doesn't exist
    const currentLikedPosts = Array.isArray(profile?.liked_posts) ? profile.liked_posts : [];
    console.log('Current liked posts:', currentLikedPosts);

    let newLikedPosts;
    
    if (isLiked.value) {
      // Unlike the post
      newLikedPosts = currentLikedPosts.filter(id => Number(id) !== postId);
    } else {
      // Like the post - ensure postId is included as a number
      newLikedPosts = [...currentLikedPosts, Number(postId)];
    }

    console.log('New liked posts array:', newLikedPosts);

    // Update the profile with the new array
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        liked_posts: newLikedPosts
      })
      .eq('user_id', authStore.userMeta.user_id)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('Updated profile:', updatedProfile);

    // Update like count
    if (isLiked.value) {
      likeCount.value--;
    } else {
      likeCount.value++;
    }

    // Fetch updated user metadata
    await authStore.fetchUserMetadata();
    
    // Update local state
    isLiked.value = !isLiked.value;

  } catch (err) {
    console.error('Error toggling like:', err);
    console.error('Error details:', err.message);
    alert('Failed to update like status');
  }
};

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

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    isPageTurning.value = true;
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for fade out
    currentPage.value++;
    await new Promise(resolve => setTimeout(resolve, 50));
    isPageTurning.value = false;
    
    // Scroll the content to top
    const postBody = document.querySelector('.post-body');
    if (postBody) {
      postBody.scrollTop = 0;
    }
  }
};

const previousPage = async () => {
  if (currentPage.value > 1) {
    isPageTurning.value = true;
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for fade out
    currentPage.value--;
    await new Promise(resolve => setTimeout(resolve, 50));
    isPageTurning.value = false;
    
    // Scroll the content to top
    const postBody = document.querySelector('.post-body');
    if (postBody) {
      postBody.scrollTop = 0;
    }
  }
};

</script>
  
<style scoped>
.post-open .post-open-title+.post-author-info-wrap {
  margin-top: 24px;
}

.post-author-info-wrap .user-avatar {
  float: left;
  margin-right: 8px;
}

.user-avatar.tiny {
  width: 26px;
  height: 26px;
}

figure>img {
  width: 100%;
}

.post-author-info {
  line-height: 26px;
}

.post-author-info .post-author, .post-author-info .post-comment-count {
  font-weight: 700;
}

.post-author-info .separator {
  margin: 0 5px;
}

.down-content {
  display: grid;
  row-gap: 2rem;
  position: relative;
  margin: 0px;
  background-color: #f7f7f7;
  box-shadow: none;
  padding: 40px 30px;
}

.play-video h1 {
  margin-top: 0px;
  margin-bottom: 20px;
  font-size: 32px;
  letter-spacing: 0.25px;
  font-weight: 700;
  font-family: "Cormorant";
  line-height: 36px;
  text-align: left;
  padding: 0px;
}

.post-info li {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 2rem;
}

.post-info li a {
  text-transform: uppercase;
  font-size: 13px;
  color: #8b8b8b;
  font-weight: 600;
  -webkit-transition: all .3s;
  transition: all .3s;
}

.down-content ul.post-info li:after {
  content: '|';
  margin-left: 10px;
}
.loading,
.error {
  font-size: 1.2rem;
  color: #555;
}

/* Breadcrumb Navigation */
.breadcrumb-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  font-size: 1rem;
  border-bottom: 1px solid var(--border-color);
  border-top: 1px solid var(--border-color);
  overflow: hidden;
  padding: 38px 0;
}

.breadcrumb-link {
  text-decoration: none;
  color: var(--first-color-lighten);
}

.button.left{
  padding: 0 34px 0 68px
}

.breadcrumb-link .button-ornament.left {
  left: 6px
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #999;
}

/* Related Posts */
.related-posts {
  margin-top: 2rem;
  text-align: left;
}

.related-posts h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.related-posts ul {
  list-style-type: none;
  padding: 0;
}

.related-posts li {
  margin-bottom: 0.5rem;
}

.related-posts a {
  color: #0077cc;
  text-decoration: none;
}

.related-posts a:hover {
  text-decoration: underline;
}

.comments ul li:first-child .comment-content {
  margin-top: 3rem;
  border-top: none;
  padding-top: 0px;
}

.comments ul li .comment-content {
  border-top: 1px solid #eeeeee;
  padding: 25px 0 25px 55px;
  position: relative;
}

.comments {
  margin-top: 40px;
}

.widget-post {
  margin-top: 7px;
  margin-bottom: 50px;
  /* border: 1px solid var(--border-color); */
  /* padding: 54px 30px 30px 30px; */
  position: relative;
  border-bottom: 1px solid var(--first-color);
}

.widget-header {
  width: 100%;
  margin-bottom: 25px;
  /* position: absolute;
  top: -26px;
  left: 30px; */
}

.widget-header h4 {
  margin-top: 0px;
  background-color: var(--title-color);
  color: var(--first-color-lighten);
  font-family: "Cormorant", Arial, Helvetica, serif;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  display: inline-block;
  padding: 16px;
  text-align: center;
  min-width: 140px;
}

.latest-post-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.latest-post-list li {
  display: flex;
  /* display: inline-block; */
  margin-bottom: 24px;
  /* padding: 0 1rem; */
}

.left-image {
  width: 80px;
  float: left;
  position: relative;
}

.right-content {
  margin-left: 15px;
}

.right-content a {
  font-size: var(--small-font-size);

  /* font-size: 20px; */
  font-weight: 700;
  margin-top: 0px;
  margin-bottom: 2px;
  text-transform: capitalize;
  /* line-height: 24px; */
  font-family: "Cormorant", Arial, Helvetica, serif;
  -webkit-transition: all .3s;
  transition: all .3s;
}
@media screen and (min-width: 1152px){
  .single-posts{
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 3rem;
    margin-top: 1rem;
  }

  .reply-button {
    right: 0;
    top: 0;
    background-color: transparent;
    padding: 0;
    color: #1e1e1e;
  }

  .replied {
    padding-left: 110px;
  }
}


/****************Play Video Page **********************/
.play-container
{
  padding-left: 2%;
}

.play-container .row
{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.play-container .row .play-video
{
  flex-basis: 69%;
}

.play-container .row .play-video video
{
  width: 100%;
}

.play-container .row .play-video h3
{
  font-weight: 700;
  font-size: 22px;
}

.play-container .row .play-video a
{
  color: var(--first-color-lighten);
  font-size: 13px;
}



.play-container .row .right-sidebar
{
  position: relative;
  flex-basis: 25%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.play-container .row .right-sidebar .side-video-list
{
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.play-container .row .right-sidebar .side-video-list img
{
  width: 100%;
}

.play-container .row .right-sidebar .side-video-list .small-thumbnail
{
  flex-basis: 49%;
}

.play-container .row .right-sidebar .side-video-list .vid-info
{
  flex-basis: 49%;
}

.play-video .play-video-info
{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
  font-size: 14px;
  color: #5a5a5a;
}

.play-video .play-video-info a img
{
  width: 20px;
  margin-right: 8px;
}

.play-video .play-video-info a
{
  display: inline-flexbox;
  margin-left: 15px;
  align-items: center;
}

.play-video hr
{
  border: 0;
  margin: 10px 0;
  height: 1px;
  background: #ccc;
  margin: 2rem 0;
}

.play-video .publisher
{
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.play-video .publisher div
{
  flex: 1;
  line-height: 18px;
}

.play-video .publisher img
{
  width: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.play-video .publisher div p
{
  color: #000;
  font-size: 18px;
  font-weight: 600;
}

.play-video .publisher div span
{
  font-size: 13px;
  color: #5a5a5a;
}

.play-video .publisher button
{
  background: red;
  color: #fff;
  padding: 8px 30px;
  letter-spacing: .5px;
  border: 0;
  outline: 0;
  border-radius: 4px;
  cursor: pointer;
}

.play-video .vid-desciption
{
  /* padding-left: 55px; */
  margin: 3rem 0;
  border-bottom: 1px solid var(--first-color);
}

.play-video .vid-desciption p
{
  font-size: 14px;
  margin-bottom: 5px;
  color: #5a5a5a;
}

.play-video .vid-desciption h4
{
  font-size: 14px;
  color: var(--first-color-lighten);
}

.play-video .vid-desciption .add-comment .old-comment .acomment-action
{
  display: flex;
  align-items: center;
  margin: 30px 0;
}

.play-video .vid-desciption .add-comment img,
.play-video .vid-desciption .old-comment img

{
  width: 35px;
  border-radius: 50%;
  margin-right: 15px;
}

.play-video .vid-desciption .add-comment input
{
  border: 0;
  outline: 0;border-bottom: 1px solid #ccc;
  width: 100%;
  padding-top: 10px;
  background: transparent;
}

.play-video .vid-desciption .old-comment
{
  margin: 20px 0;
  padding: 20px 0;
}

.play-video .vid-desciption .old-comment h3
{
  font-size: 14px;
  margin-bottom: 2px;
}

.play-video .vid-desciption .old-comment h3 span
{
  font-size: 12px;
  color: #5a5a5a;
  font-weight: 500;
  margin-left: 8px;
}

.play-video .vid-desciption .old-comment .acomment-action
{
  margin: 8px 0;
  font-size: 14px;
}

.play-video .vid-desciption .old-comment .acomment-action img
{
  border-radius: 0;
  width: 20px;
  margin-right: 5px;
}

.play-video .vid-desciption .old-comment .acomment-action span
{
  margin-right: 29px;
  color: #5a5a5a;
}

.play-video .vid-desciption .old-comment .acomment-action a
{
  color: #0000ff;
}

@media (max-width:900px){
  .play-video, .right-sidebar{
    flex-basis: 100%;
  }
  .play-container{
    padding-left: 5%;
  }

  .vid-desciption{
    padding-left: 0;
  }
  .play-video .play-video-info a{
    margin: 15px 15px 0 0;
  }

  .comment-header {
    padding: 20px 20px 20px 60px;
  }
  
  .comment-expanded-content {
    padding: 0 20px 20px 60px;
  }
  
  .expand-arrow {
    right: 20px;
  }
}

@media (min-width:1000px){
  .section-title-wrap+.post-comment-form, .section-title-wrap+.account-settings-form {
    margin-top: 30px;
  }

  .form-row .form-item.half:first-child {
    float: left;
  }

  .form-row .form-item.half {
    width: 48%;
    margin-top: 0;
  }

  input[type="text"], input[type="password"], input[type="email"], textarea, select {
    width: 100%;
    /* border: 1px solid #dbdbdb; */
    background-color: #fff;
    color: #363636;
    font-family: "Roboto", sans-serif;
    font-size: .8125em;
    transition: border-color .2s ease-in-out;
  }

  label {
    display: block;
    color: #363636;
    font-family: "Exo", sans-serif;
    font-size: .6875em;
    text-transform: uppercase;
  }

  .form-row .form-item.half:last-child {
    float: right;
  }

  .form-row .form-item.half {
    width: 48%;
    margin-top: 0;
  }

  textarea {
    min-height: 160px;
    padding: 12px 20px;
    border-radius: 24px;
  }

  .form-item{
    margin-bottom: 1rem;
  }

}

input[type="text"], input[type="password"], input[type="email"], select {
  height: 46px;
  padding: 0 20px;
  border-radius: 200px;
}

.post-comment .post-comment-actions {
  margin-top: 20px;
}

.bubble-ornament.blue {
  background-color: #1c95f3;
}

.bubble-ornament {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #dbdbdb;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.bubble-ornament .reply-icon, .bubble-ornament .share-icon {
  font-size: 14px;
  line-height: 30px;
}

.like-button {
  margin-left: 8px;
}

.bubble-ornament.hoverable {
  background-color: #dbdbdb;
  transition: all .3s ease-in-out;
}

.bubble-ornament .like-icon {
  line-height: 30px;
}

.likes-count {
  margin-left: 8px;
  display: inline-block;
  color: #8b8b8b;
  font-size: .6875em;
  line-height: 1em;
}

.cmt-pr {
  float: left;
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 24px;
  margin-bottom: 2rem;
}

.cmt-pr li {
  float: left;
  color: var(--first-color-lighten);
  font-size: 16px;
  font-weight: 400;
}

.cmt-pr li:last-child {
  margin-right: 0;
  float: right;
}

.main_nav_box{
  padding-bottom: 24px;
  margin-top: 1rem;
}

.nav_gadgets a{
  font-size: 16px;
  font-weight: 400;
}

.avatar{
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.1);
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.avatar-image{
  height: 40px;
  width: 40px;
  overflow: hidden;
  position: relative;
  border-radius: 50%;
}

.avatar-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.post-comment {
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0;
  position: relative;
  display: block;
}

.comment-header {
  display: flex;
  align-items: flex-start;
  padding: 30px 50px 30px 100px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.comment-header:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.comment-preview {
  flex: 1;
  margin-left: 20px;
}

.comment-preview p {
  margin: 0;
  color: var(--text-muted-color);
  font-size: 0.9em;
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.reply-count {
  font-size: 0.8em;
  color: var(--header-color);
  font-weight: 500;
  padding: 2px 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.expand-arrow {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
  color: var(--text-muted-color);
  font-size: 1.2em;
}

.expand-arrow.expanded {
  transform: translateY(-50%) rotate(180deg);
}

.comment-expanded-content {
  padding: 0 50px 30px 100px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.01);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

.full-comment-content {
  margin-top: 20px;
}

.full-comment-content p {
  margin-bottom: 1rem;
  line-height: 1.8;
  color: var(--title-color);
}

.comment-box {
  flex: 1;
  margin-left: 20px;
}

.comment-header .comment-box {
  flex: 1;
  margin-left: 20px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-author h4 {
  color: var(--title-color);
  font-weight: 600;
  margin: 0;
}

.comment-author span {
  color: var(--text-muted-color);
  font-size: 0.9em;
}

.comment-input-wrapper {
  width: 100%;
}

.comment-content {
  width: 100%;
}

.comment-content p {
  margin-bottom: 1rem;
  line-height: 1.8;
  color: var(--title-color);
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reply-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
}

.reply-button i {
  color: var(--header-color);
}

.report-button {
  background: none;
  border: none;
  color: var(--text-muted-color);
  cursor: pointer;
}

.comment-input:focus {
  outline: none;
  border-color: var(--header-color);
}

.comment-thread {
  width: 100%;
}

.replies-list {
  margin-left: 40px;
  margin-top: 20px;
  border-left: 2px solid var(--border-color);
  padding-left: 20px;
}

.replies-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.replies-header h5 {
  margin: 0;
  font-size: 0.9em;
  color: var(--text-muted-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.replies-loading,
.no-replies {
  text-align: center;
  padding: 20px;
  color: var(--text-muted-color);
  font-size: 0.9em;
}

.replies-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--header-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.replies-list .post-comment {
  padding: 20px 0 20px 40px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.replies-list .post-comment:last-child {
  margin-bottom: 0;
}

.reply-box {
  display: flex;
  margin-top: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.reply-input {
  width: 100%;
  min-height: 80px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 10px;
  resize: none;
  font-family: inherit;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.reply-actions button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background: none;
  border: 1px solid var(--border-color);
}

.submit-button {
  background: var(--header-color);
  color: white;
  border: none;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--text-muted-color);
  cursor: pointer;
  transition: color 0.2s ease;
}

.delete-button:hover {
  color: #dc3545;
}

.delete-button i {
  font-size: 1.1em;
}

.comment-form {
  margin-bottom: 40px;
  padding: 20px 0;
  /* border-bottom: 1px solid var(--border-color); */
}

.comment-form .post-comment {
  padding: 0;
  border: none;
}

.comment-form .reply-input {
  width: 100%;
  min-height: 80px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 10px;
  resize: none;
  font-family: inherit;
}

.comment-form .reply-actions {
  display: flex;
  justify-content: flex-end;
}

.comment-form .submit-button {
  padding: 8px 16px;
  border-radius: 4px;
  background: var(--header-color);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 200px;
}

.comment-form .submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.widget {
  border-bottom: 1px solid var(--first-color);
}

.like-section {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.heart-icon {
  font-size: 1.5rem;
  color: #ccc;
  transition: all 0.2s ease;
}

.like-button.liked .heart-icon {
  color: #ff4757;
  transform: scale(1.1);
}

.like-count {
  font-size: 1rem;
  color: var(--text-color);
}

.like-button:hover .heart-icon {
  transform: scale(1.1);
}

.like-button.liked:hover .heart-icon {
  transform: scale(1);
}

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

.post-body-container {
  max-width: 800px;
  margin: 0 auto;
  min-height: 400px; /* Maintain consistent height between pages */
  display: flex;
  flex-direction: column;
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.8;
  /* margin-bottom: 2rem; */
  padding: 2rem;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 4px;
  height: 500px; /* Fixed height */
  overflow-y: auto; /* Add scrollbar */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: var(--header-color) #f0f0f0; /* Firefox */
}

.post-body p {
  color: var(--title-color) !important;
  margin-bottom: 1rem;
  line-height: 1.8;
}

/* Webkit scrollbar styling */
.post-body::-webkit-scrollbar {
  width: 8px;
}

.post-body::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 4px;
}

.post-body::-webkit-scrollbar-thumb {
  background: var(--header-color);
  border-radius: 4px;
}

.post-body::-webkit-scrollbar-thumb:hover {
  background: var(--first-color);
}

.page-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
}

.page-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: var(--header-color);
  color: white;
  border-radius: 200px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.page-info {
  font-size: 0.9rem;
  color: var(--text-muted-color);
}

.post-body.turning {
  opacity: 0;
}
</style>
  