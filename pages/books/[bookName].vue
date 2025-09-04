<template>
  <div class="book-posts-container">
    <div v-if="loading" class="loading">
      Loading posts...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else>
      <div class="book-header">
        <div class="breadcrumb-nav">
          <NuxtLink to="/" class="breadcrumb-item">Home</NuxtLink>
          <span class="separator">/</span>
          <NuxtLink :to="`/testament/${currentTestament.toLowerCase().replace(' ', '')}`" class="breadcrumb-item">
            {{ currentTestament }}
          </NuxtLink>
          <span class="separator">/</span>
          <div class="book-navigation">
            <NuxtLink v-if="prevBook" :to="`/books/${encodeURIComponent(prevBook)}`" class="nav-link prev">
              <i class="ri-arrow-left-line"></i>
            </NuxtLink>
            <span class="current-book">{{ bookName }}</span>
            <NuxtLink v-if="nextBook" :to="`/books/${encodeURIComponent(nextBook)}`" class="nav-link next">
              <i class="ri-arrow-right-line"></i>
            </NuxtLink>
          </div>
          <span class="post-count">{{ posts.length }} posts</span>
        </div>
      </div>
      
      <div class="container">
        <div class="post_list">
          <Card :posts="posts" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePostsStore } from '~/stores/posts';
import { useRoute } from 'vue-router';
import Card from '~/components/Card.vue';
import { oldTestamentOrder, newTestamentOrder } from '~/utils/bibleOrder';

const route = useRoute();
const postsStore = usePostsStore();
const posts = ref([]);
const loading = ref(true);
const error = ref(null);

const bookName = decodeURIComponent(route.params.bookName);
console.log('Fetching posts for book:', bookName);

// Get the current book's testament
const currentTestament = computed(() => {
  const book = postsStore.books.find(b => b.name === bookName);
  return book?.testament;
});

// Get the appropriate book order based on testament
const testamentOrder = computed(() => {
  return currentTestament.value === 'Old Testament' ? oldTestamentOrder : newTestamentOrder;
});

// Get books with posts in chronological order
const booksWithPosts = computed(() => {
  // Get all books that have posts in this testament
  const testamentPosts = postsStore.posts.filter(post => post.testament === currentTestament.value);
  const booksWithContent = [...new Set(testamentPosts.map(post => post.book_name))];
  
  // Filter and sort the testament order to only include books with posts
  return testamentOrder.value.filter(book => booksWithContent.includes(book));
});

// Get next and previous books that have posts
const nextBook = computed(() => {
  const currentIndex = booksWithPosts.value.indexOf(bookName);
  if (currentIndex === -1) return null;
  
  // If at the end, return the first book
  if (currentIndex === booksWithPosts.value.length - 1) {
    return booksWithPosts.value[0];
  }
  
  return booksWithPosts.value[currentIndex + 1];
});

const prevBook = computed(() => {
  const currentIndex = booksWithPosts.value.indexOf(bookName);
  if (currentIndex === -1) return null;
  
  // If at the beginning, return the last book
  if (currentIndex === 0) {
    return booksWithPosts.value[booksWithPosts.value.length - 1];
  }
  
  return booksWithPosts.value[currentIndex - 1];
});

// Simplify to use the store
onMounted(async () => {
  try {
    loading.value = true;
    console.log('Before fetching posts for:', bookName);
    
    // First fetch all posts and books
    await Promise.all([
      postsStore.fetchPosts(),
      postsStore.fetchBooksAndTestaments()
    ]);
    
    // Then filter for this book
    posts.value = await postsStore.fetchPostsByBook(bookName);
    
    console.log('Posts value after assignment:', posts.value);
  } catch (err) {
    error.value = 'Failed to load posts. Please try again later.';
    console.error('Error in onMounted:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.book-posts-container {
  padding: 20px;
}

.book-header {
  margin-bottom: 30px;
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

.loading, .error {
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

.post_list{
display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}
</style> 