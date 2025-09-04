<!-- <template>
  <div class="testament-container">
    <div v-if="loading" class="loading">
      Loading books...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="Object.keys(groupedPosts).length === 0" class="no-posts">
      No books found in Old Testament
    </div>
    <div v-else class="books-grid">
      <div v-for="(posts, bookName) in groupedPosts" :key="bookName" class="book-card">
        <NuxtLink :to="`/books/${encodeURIComponent(bookName)}`">
          <h2 class="book-title">{{ bookName }}</h2>
          <div class="book-stats">
            <span class="post-count">{{ posts.length }} posts</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template> -->

<template>
  <div class="testament-container">
    <div v-if="loading" class="loading">
      Loading books...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="Object.keys(groupedPosts).length === 0" class="no-posts">
      No books found in Old Testament
    </div>
    <div v-else>
      <div class="testament-header">
        <div class="breadcrumb-nav">
          <NuxtLink to="/" class="breadcrumb-item">Home</NuxtLink>
          <span class="separator">/</span>
          <span class="current-testament">Old Testament</span>
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
import { oldTestamentOrder } from '~/utils/bibleOrder';

const postsStore = usePostsStore();
const posts = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch posts for Old Testament
onMounted(async () => {
  try {
    loading.value = true;
    posts.value = await postsStore.getPostsByTestament('Old Testament');
  } catch (err) {
    error.value = 'Failed to load posts. Please try again later.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// Group posts by book name and sort by biblical chronology
const groupedPosts = computed(() => {
  const grouped = posts.value.reduce((acc, post) => {
    if (!acc[post.book_name]) {
      acc[post.book_name] = [];
    }
    acc[post.book_name].push(post);
    return acc;
  }, {});

  // Create a new sorted object based on oldTestamentOrder
  return Object.fromEntries(
    Object.entries(grouped)
      .sort(([bookA], [bookB]) => {
        const indexA = oldTestamentOrder.indexOf(bookA);
        const indexB = oldTestamentOrder.indexOf(bookB);
        return indexA - indexB;
      })
  );
});
</script>

<!-- <style scoped>
.testament-container {
  padding: 20px;
}

.book-section {
  margin-bottom: 40px;
}

.book-title {
  color: var(--header-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--second-color);
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
  color: var(--header-color);
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.book-card {
  background: var(--card-background);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.book-card:hover {
  transform: translateY(-3px);
}

.book-card a {
  text-decoration: none;
  color: var(--text-color);
}

.book-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--header-color);
}

.book-stats {
  display: flex;
  align-items: center;
  color: var(--text-color);
  opacity: 0.8;
  font-size: 0.9rem;
}

.post-count {
  background: var(--second-color);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}
</style>  -->

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
</style> 