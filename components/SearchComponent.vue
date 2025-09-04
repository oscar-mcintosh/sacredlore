<template>
  <div class="search-component">
    <!-- Search Input -->
    <div class="search-input-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search posts, books, or tags..."
          class="search-input"
          @input="handleSearchInput"
          @keyup.enter="performSearch"
        />
        <button 
          @click="performSearch" 
          class="search-button"
          :disabled="searchLoading"
        >
          <i class="ri-search-line"></i>
        </button>
      </div>
      
      <!-- Search Suggestions -->
      <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions">
        <div 
          v-for="suggestion in suggestions" 
          :key="suggestion"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="advanced-filters">
      <button 
        @click="toggleAdvancedFilters" 
        class="filter-toggle-button"
      >
        <i class="ri-filter-3-line"></i>
        Advanced Filters
        <i :class="showAdvancedFilters ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
      </button>
      
      <div v-if="showAdvancedFilters" class="filters-panel">
        <div class="filter-row">
          <div class="filter-group">
            <label>Testament</label>
            <select v-model="filters.testament" @change="applyFilters">
              <option value="">All Testaments</option>
              <option value="Old Testament">Old Testament</option>
              <option value="New Testament">New Testament</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Book</label>
            <select v-model="filters.book" @change="applyFilters">
              <option value="">All Books</option>
              <option v-for="book in availableBooks" :key="book" :value="book">
                {{ book }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Status</label>
            <select v-model="filters.status" @change="applyFilters">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-group">
            <label>Sort By</label>
            <select v-model="sort.field" @change="applySort">
              <option value="created_at">Date Created</option>
              <option value="title">Title</option>
              <option value="book_name">Book Name</option>
              <option value="views_count">Views</option>
              <option value="likes_count">Likes</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Order</label>
            <select v-model="sort.direction" @change="applySort">
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          
          <div class="filter-group">
            <button @click="clearFilters" class="clear-filters-button">
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="search-results">
      <div class="results-header">
        <h3>Search Results ({{ searchResults.length }})</h3>
        <button @click="clearSearch" class="clear-search-button">
          Clear Search
        </button>
      </div>
      
      <div class="results-list">
        <div 
          v-for="post in searchResults" 
          :key="post.id" 
          class="result-item"
        >
          <div class="result-content">
            <h4 class="result-title">
              <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
            </h4>
            <p class="result-description">{{ post.description }}</p>
            <div class="result-meta">
              <span class="result-book">{{ post.book_name }}</span>
              <span class="result-testament">{{ post.testament }}</span>
              <span class="result-date">{{ formatDate(post.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="hasSearched && !searchLoading" class="no-results">
      <p>No posts found matching your search criteria.</p>
      <button @click="clearSearch" class="try-again-button">
        Try Different Search
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="searchLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Searching...</p>
    </div>

    <!-- Error State -->
    <div v-if="searchError" class="error-state">
      <p class="error-message">{{ searchError }}</p>
      <button @click="retrySearch" class="retry-button">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// Composables
const { 
  searchQuery, 
  searchResults, 
  searchFilters, 
  searchSort, 
  searchLoading, 
  searchError,
  searchPosts,
  quickSearch,
  searchByFilters,
  updateFilters,
  updateSort,
  clearSearch,
  getSearchSuggestions,
  getFilterOptions
} = useSearch();

// Local state
const showAdvancedFilters = ref(false);
const showSuggestions = ref(false);
const suggestions = ref([]);
const hasSearched = ref(false);
const availableBooks = ref([]);

// Debounced search
let searchTimeout = null;

// Computed
const filters = computed({
  get: () => searchFilters.value,
  set: (value) => updateFilters(value)
});

const sort = computed({
  get: () => searchSort.value,
  set: (value) => updateSort(value)
});

// Methods
const handleSearchInput = () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Set new timeout for debounced search
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.trim().length >= 2) {
      await getSearchSuggestions(searchQuery.value);
      showSuggestions.value = true;
    } else {
      showSuggestions.value = false;
      suggestions.value = [];
    }
  }, 300);
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  try {
    hasSearched.value = true;
    showSuggestions.value = false;
    
    if (showAdvancedFilters.value && hasActiveFilters.value) {
      await searchPosts(searchQuery.value, filters.value, sort.value);
    } else {
      await quickSearch(searchQuery.value);
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
};

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion;
  showSuggestions.value = false;
  performSearch();
};

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

const applyFilters = async () => {
  if (hasSearched.value) {
    await searchByFilters(filters.value);
  }
};

const applySort = async () => {
  if (hasSearched.value) {
    await searchPosts(searchQuery.value, filters.value, sort.value);
  }
};

const clearFilters = () => {
  updateFilters({
    testament: '',
    book: '',
    author: '',
    status: 'published',
    dateRange: { start: null, end: null },
    tags: []
  });
  
  if (hasSearched.value) {
    performSearch();
  }
};

const retrySearch = () => {
  performSearch();
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

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.testament || 
         filters.value.book || 
         filters.value.author || 
         filters.value.status !== 'published' ||
         filters.value.dateRange.start || 
         filters.value.dateRange.end || 
         filters.value.tags.length > 0;
});

// Lifecycle
onMounted(async () => {
  try {
    const options = await getFilterOptions();
    availableBooks.value = options.books;
  } catch (error) {
    console.error('Failed to load filter options:', error);
  }
});

// Watch for external search query changes
watch(searchQuery, (newQuery) => {
  if (newQuery && newQuery.trim().length >= 2) {
    handleSearchInput();
  }
});

// Watch for suggestions changes
watch(suggestions, (newSuggestions) => {
  showSuggestions.value = newSuggestions.length > 0;
});
</script>

<style scoped>
.search-component {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-input-container {
  position: relative;
  margin-bottom: 20px;
}

.search-input-wrapper {
  display: flex;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  overflow: hidden;
  background: white;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  padding: 15px 20px;
  background: var(--header-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background: var(--first-color);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background: var(--border-color);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.advanced-filters {
  margin-bottom: 20px;
}

.filter-toggle-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-toggle-button:hover {
  background: var(--border-color);
}

.filters-panel {
  margin-top: 15px;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: var(--title-color);
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
}

.clear-filters-button {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-filters-button:hover {
  background: #c82333;
}

.search-results {
  margin-top: 30px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
}

.results-header h3 {
  margin: 0;
  color: var(--title-color);
}

.clear-search-button {
  padding: 8px 16px;
  background: var(--text-muted-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-search-button:hover {
  background: var(--title-color);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-item {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
  transition: box-shadow 0.2s ease;
}

.result-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-title {
  margin: 0 0 10px 0;
  color: var(--header-color);
}

.result-title a {
  color: inherit;
  text-decoration: none;
}

.result-title a:hover {
  text-decoration: underline;
}

.result-description {
  margin: 0 0 15px 0;
  color: var(--text-color);
  line-height: 1.6;
}

.result-meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: var(--text-muted-color);
}

.result-book,
.result-testament,
.result-date {
  padding: 4px 8px;
  background: var(--border-color);
  border-radius: 4px;
}

.no-results,
.loading-state,
.error-state {
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

.error-message {
  color: #dc3545;
  margin-bottom: 20px;
}

.retry-button,
.try-again-button {
  padding: 10px 20px;
  background: var(--header-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover,
.try-again-button:hover {
  background: var(--first-color);
}

@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
  }
  
  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}
</style> 