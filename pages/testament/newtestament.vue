<template>
  <div class="testament-container">
    <div v-if="loading" class="loading">
      Loading books...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="Object.keys(groupedPosts).length === 0" class="no-posts">
      No books found in New Testament
    </div>
    <div v-else>
      <div class="testament-header">
        <div class="breadcrumb-nav">
          <NuxtLink to="/" class="breadcrumb-item">Home</NuxtLink>
          <span class="separator">/</span>
          <span class="current-testament">New Testament</span>
          <span class="book-count">{{ Object.keys(groupedPosts).length }} books</span>
        </div>
      </div>
      
      <div class="books-grid">
        <div v-for="(posts, bookName) in groupedPosts" :key="bookName" class="book-card">
          <NuxtLink :to="`/books/${encodeURIComponent(bookName)}`">
            <div class="corner-curve"></div>
            <div class="arrow-icon">
              <i class="ri-arrow-right-up-line"></i>
            </div>
            <div class="card-content">
              <div class="icon-wrapper">
                <!-- <img src="/images/avatar-professional.png" alt="Professional icon" class="avatar-icon" /> -->
              </div>
              <div class="text-content">
                <h2 class="book-title">{{ bookName }}</h2>
                <!-- <p class="description">It is a long established fact that a reader will be point of distracted by the readable content of a page when looking at its layout.</p> -->
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePostsStore } from '~/stores/posts';

const postsStore = usePostsStore();
const posts = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch posts for New Testament
onMounted(async () => {
  try {
    loading.value = true;
    posts.value = await postsStore.getPostsByTestament('New Testament');
  } catch (err) {
    error.value = 'Failed to load posts. Please try again later.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// Group posts by book name
const groupedPosts = computed(() => {
  return posts.value.reduce((acc, post) => {
    if (!acc[post.book_name]) {
      acc[post.book_name] = [];
    }
    acc[post.book_name].push(post);
    return acc;
  }, {});
});
</script>

<style scoped>
.testament-container {
  padding: 20px;
}

.book-section {
  margin-bottom: 40px;
}

.book-title {
  color: var(--first-color-lighten);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--second-color);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.post-card {
  padding: 15px;
  border-radius: 8px;
  background: var(--card-background);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-3px);
}

.post-card a {
  text-decoration: none;
  color: var(--text-color);
}

.post-card h3 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.loading, .error, .no-posts {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: var(--text-color);
}

.error {
  color: #dc3545;
}

.post-author {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: var(--text-color);
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 20px;
}

.book-card {
  /* background: white; */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); 
  border-bottom: solid 1px var(--border-color);
  background-clip: padding-box; 
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.book-card:hover {
  transform: translateY(-2px);
}

.corner-curve {
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: var(--border-color);
  border-bottom-left-radius: 12px;
}

.arrow-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  color: var(--first-color);
  z-index: 1;
  transition: transform 0.2s ease;
}

.book-card:hover .arrow-icon {
  transform: translate(2px, -2px);
}

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-top: 8px;
}

.icon-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
}

.text-content {
  flex: 1;
}

.book-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var;
  margin: 0 0 8px 0;
}

.description {
  font-size: 0.875rem;
  color: var(--text-color);
  margin: 0;
  line-height: 1.5;
}

.book-card a {
  text-decoration: none;
  color: inherit;
}

/* Remove unused styles */
.book-stats,
.post-count {
  display: none;
}

.testament-header {
  margin-bottom: 30px;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.95rem;
  color: hsl(0, 0%, 50%);
  margin-bottom: 30px;
  flex-wrap: wrap;
  min-height: 40px;
}

.breadcrumb-item {
  color: hsl(0, 0%, 50%);
  text-decoration: none;
  transition: color 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.breadcrumb-item:hover {
  color: hsl(28, 42%, 26%);
  background-color: rgba(28, 42%, 26%, 0.1);
}

.separator {
  color: hsl(0, 0%, 50%);
  opacity: 0.5;
  margin: 0 4px;
  flex-shrink: 0;
}

.current-testament {
  font-weight: 600;
  color: var(--first-color);
  padding: 0 8px;
  white-space: nowrap;
}

.book-count {
  background: var(--title-color);
  color: var(--first-color-lighten);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Large screen spacing adjustments */
@media screen and (min-width: 1024px) {
  .separator {
    margin: 0 12px;
  }
}
</style> 