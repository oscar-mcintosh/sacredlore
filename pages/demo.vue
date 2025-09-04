<template>
  <NuxtLayout name="default">
    <div class="demo-page">
      <div class="demo-header">
        <h1>Phase 3 & 4 Features Demo</h1>
        <p>Showcasing the new store architecture, search functionality, and pagination features</p>
      </div>

      <!-- Store Status Section -->
      <div class="demo-section">
        <h2>Store Status & Caching</h2>
        <div class="status-grid">
          <div class="status-card">
            <h3>Posts Store</h3>
            <div class="status-info">
              <p><strong>Total Posts:</strong> {{ postsStore.postCount }}</p>
              <p><strong>Loading:</strong> {{ postsStore.loading ? 'Yes' : 'No' }}</p>
              <p><strong>Cache Valid:</strong> {{ postsStore.isCacheValid ? 'Yes' : 'No' }}</p>
              <p><strong>Error:</strong> {{ postsStore.error || 'None' }}</p>
            </div>
            <div class="status-actions">
              <button @click="refreshPosts" :disabled="postsStore.loading" class="action-button">
                Refresh Posts
              </button>
              <button @click="clearCache" class="action-button secondary">
                Clear Cache
              </button>
              <button @click="clearError" v-if="postsStore.error" class="action-button warning">
                Clear Error
              </button>
            </div>
          </div>

          <div class="status-card">
            <h3>Search Store</h3>
            <div class="status-info">
              <p><strong>Results:</strong> {{ searchStore.searchResults.length }}</p>
              <p><strong>Loading:</strong> {{ searchStore.searchLoading ? 'Yes' : 'No' }}</p>
              <p><strong>Error:</strong> {{ searchStore.searchError || 'None' }}</p>
            </div>
            <div class="status-actions">
              <button @click="clearSearch" class="action-button secondary">
                Clear Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="demo-section">
        <h2>Advanced Search & Filtering</h2>
        <SearchComponent />
      </div>

      <!-- Posts Display Section -->
      <div class="demo-section">
        <h2>Posts with Pagination</h2>
        <div class="posts-controls">
          <div class="view-controls">
            <label>View:</label>
            <select v-model="viewMode" class="view-select">
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>
          
          <div class="filter-controls">
            <label>Filter by Testament:</label>
            <select v-model="selectedTestament" @change="filterPosts" class="filter-select">
              <option value="">All Testaments</option>
              <option value="Old Testament">Old Testament</option>
              <option value="New Testament">New Testament</option>
            </select>
          </div>
        </div>

        <!-- Posts Grid/List -->
        <div v-if="filteredPosts.length > 0" class="posts-container" :class="viewMode">
          <div 
            v-for="post in paginatedPosts" 
            :key="post.id" 
            class="post-card"
          >
            <div class="post-header">
              <h3 class="post-title">
                <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
              </h3>
              <div class="post-meta">
                <span class="post-book">{{ post.book_name }}</span>
                <span class="post-testament">{{ post.testament }}</span>
              </div>
            </div>
            
            <p class="post-description">{{ post.description }}</p>
            
            <div class="post-footer">
              <div class="post-stats">
                <span class="post-views">
                  <i class="ri-eye-line"></i> {{ post.views_count || 0 }}
                </span>
                <span class="post-likes">
                  <i class="ri-heart-line"></i> {{ post.likes_count || 0 }}
                </span>
                <span class="post-comments">
                  <i class="ri-chat-1-line"></i> {{ post.comments || 0 }}
                </span>
              </div>
              
              <div class="post-date">
                {{ formatDate(post.created_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- No Posts Message -->
        <div v-else-if="!postsStore.loading" class="no-posts">
          <p>No posts found matching your criteria.</p>
          <button @click="resetFilters" class="reset-button">
            Reset Filters
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="postsStore.loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>

        <!-- Pagination -->
        <PaginationComponent
          v-if="filteredPosts.length > 0"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredPosts.length"
          :items-per-page="itemsPerPage"
          @page-change="handlePageChange"
          @items-per-page-change="handleItemsPerPageChange"
        />
      </div>

      <!-- Store Actions Demo -->
      <div class="demo-section">
        <h2>Store Actions Demo</h2>
        <div class="actions-grid">
          <div class="action-card">
            <h3>Like/Unlike Posts</h3>
            <p>Test the improved like functionality with better error handling</p>
            <div class="action-example">
              <button 
                v-for="post in samplePosts" 
                :key="post.id"
                @click="toggleLike(post.id)"
                :class="['like-button', { 'liked': post.liked }]"
                :disabled="postsStore.loading"
              >
                <i class="ri-heart-line"></i>
                {{ post.liked ? 'Unlike' : 'Like' }}
              </button>
            </div>
          </div>

          <div class="action-card">
            <h3>Search by Book</h3>
            <p>Test fetching posts by specific book</p>
            <div class="action-example">
              <select v-model="selectedBook" @change="fetchPostsByBook" class="book-select">
                <option value="">Select a book</option>
                <option v-for="book in availableBooks" :key="book" :value="book">
                  {{ book }}
                </option>
              </select>
              <div v-if="bookPosts.length > 0" class="book-posts">
                <p><strong>{{ bookPosts.length }} posts found in {{ selectedBook }}</strong></p>
                <ul>
                  <li v-for="post in bookPosts.slice(0, 3)" :key="post.id">
                    {{ post.title }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// Page meta
definePageMeta({
  layout: 'default',
});

// Composables
const postsStore = usePostsStore();
const searchStore = useSearch();

// Local state
const viewMode = ref('grid');
const selectedTestament = ref('');
const selectedBook = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const bookPosts = ref([]);

// Computed
const filteredPosts = computed(() => {
  if (!selectedTestament.value) {
    return postsStore.posts;
  }
  return postsStore.posts.filter(post => post.testament === selectedTestament.value);
});

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage.value));

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPosts.value.slice(start, end);
});

const samplePosts = computed(() => {
  return postsStore.posts.slice(0, 3);
});

const availableBooks = computed(() => {
  return [...new Set(postsStore.posts.map(post => post.book_name))];
});

// Methods
const refreshPosts = async () => {
  try {
    await postsStore.fetchPosts(true); // Force refresh
    currentPage.value = 1; // Reset to first page
  } catch (error) {
    console.error('Failed to refresh posts:', error);
  }
};

const clearCache = () => {
  postsStore.clearCache();
};

const clearError = () => {
  postsStore.clearError();
};

const clearSearch = () => {
  searchStore.clearSearch();
};

const filterPosts = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const resetFilters = () => {
  selectedTestament.value = '';
  selectedBook.value = '';
  currentPage.value = 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  // Scroll to top of posts section
  const postsSection = document.querySelector('.posts-container');
  if (postsSection) {
    postsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleItemsPerPageChange = (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage;
};

const toggleLike = async (postId) => {
  try {
    await postsStore.toggleLikePost(postId);
  } catch (error) {
    console.error('Failed to toggle like:', error);
  }
};

const fetchPostsByBook = async () => {
  if (!selectedBook.value) {
    bookPosts.value = [];
    return;
  }
  
  try {
    bookPosts.value = await postsStore.fetchPostsByBook(selectedBook.value);
  } catch (error) {
    console.error('Failed to fetch posts by book:', error);
    bookPosts.value = [];
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

// Lifecycle
onMounted(async () => {
  try {
    // Load posts if not already loaded
    if (postsStore.posts.length === 0) {
      await postsStore.fetchPosts();
    }
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
});

// Watch for filtered posts changes
watch(filteredPosts, () => {
  // Reset to first page when filters change
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
});
</script>

<style scoped>
.demo-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, var(--header-color), var(--first-color));
  color: white;
  border-radius: 12px;
}

.demo-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.demo-header p {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.demo-section {
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  margin: 0 0 20px 0;
  color: var(--title-color);
  font-size: 1.8rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 10px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.status-card {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #f8f9fa;
}

.status-card h3 {
  margin: 0 0 15px 0;
  color: var(--title-color);
  font-size: 1.3rem;
}

.status-info p {
  margin: 5px 0;
  font-size: 14px;
}

.status-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.action-button {
  background: var(--header-color);
  color: white;
}

.action-button:hover {
  background: var(--first-color);
}

.action-button.secondary {
  background: var(--text-muted-color);
}

.action-button.secondary:hover {
  background: var(--title-color);
}

.action-button.warning {
  background: #dc3545;
}

.action-button.warning:hover {
  background: #c82333;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.posts-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.view-controls,
.filter-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-select,
.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
}

.posts-container {
  margin-bottom: 30px;
}

.posts-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.posts-container.list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-card {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
  transition: box-shadow 0.2s ease;
}

.post-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  margin-bottom: 15px;
}

.post-title {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
}

.post-title a {
  color: var(--header-color);
  text-decoration: none;
}

.post-title a:hover {
  text-decoration: underline;
}

.post-meta {
  display: flex;
  gap: 10px;
  font-size: 14px;
}

.post-book,
.post-testament {
  padding: 4px 8px;
  background: var(--border-color);
  border-radius: 4px;
  color: var(--text-muted-color);
}

.post-description {
  margin: 0 0 15px 0;
  color: var(--text-color);
  line-height: 1.6;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.post-stats {
  display: flex;
  gap: 15px;
}

.post-views,
.post-likes,
.post-comments {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted-color);
}

.post-date {
  color: var(--text-muted-color);
}

.no-posts {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted-color);
}

.reset-button {
  padding: 10px 20px;
  background: var(--header-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}

.reset-button:hover {
  background: var(--first-color);
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted-color);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--header-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #f8f9fa;
}

.action-card h3 {
  margin: 0 0 10px 0;
  color: var(--title-color);
}

.action-card p {
  margin: 0 0 15px 0;
  color: var(--text-color);
}

.action-example {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-button:hover {
  background: var(--border-color);
}

.like-button.liked {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.book-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  width: 100%;
}

.book-posts {
  margin-top: 15px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.book-posts ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.book-posts li {
  margin: 5px 0;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .demo-page {
    padding: 10px;
  }
  
  .demo-header {
    padding: 30px 15px;
  }
  
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-section {
    padding: 20px;
  }
  
  .posts-controls {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .status-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
