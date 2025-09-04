<template>
  <div class="pagination-component" v-if="totalPages > 1">
    <div class="pagination-info">
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <span>{{ totalItems }} total items</span>
    </div>
    
    <div class="pagination-controls">
      <!-- First Page -->
      <button 
        @click="goToFirstPage" 
        class="pagination-button"
        :disabled="!hasPreviousPage"
        title="Go to first page"
      >
        <i class="ri-skip-back-line"></i>
      </button>
      
      <!-- Previous Page -->
      <button 
        @click="previousPage" 
        class="pagination-button"
        :disabled="!hasPreviousPage"
        title="Go to previous page"
      >
        <i class="ri-arrow-left-s-line"></i>
      </button>
      
      <!-- Page Numbers -->
      <div class="page-numbers">
        <button 
          v-for="page in visiblePageNumbers" 
          :key="page"
          @click="goToPage(page)"
          class="page-number"
          :class="{ active: page === currentPage }"
        >
          {{ page }}
        </button>
        
        <!-- Ellipsis for skipped pages -->
        <span v-if="showStartEllipsis" class="ellipsis">...</span>
        <span v-if="showEndEllipsis" class="ellipsis">...</span>
      </div>
      
      <!-- Next Page -->
      <button 
        @click="nextPage" 
        class="pagination-button"
        :disabled="!hasNextPage"
        title="Go to next page"
      >
        <i class="ri-arrow-right-s-line"></i>
      </button>
      
      <!-- Last Page -->
      <button 
        @click="goToLastPage" 
        class="pagination-button"
        :disabled="!hasNextPage"
        title="Go to last page"
      >
        <i class="ri-skip-forward-line"></i>
      </button>
    </div>
    
    <!-- Items per page selector -->
    <div class="items-per-page">
      <label for="items-per-page">Items per page:</label>
      <select 
        id="items-per-page"
        :value="itemsPerPage"
        @change="handleItemsPerPageChange"
        class="items-per-page-select"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  }
});

// Emits
const emit = defineEmits([
  'page-change',
  'items-per-page-change'
]);

// Computed
const hasNextPage = computed(() => props.currentPage < props.totalPages);
const hasPreviousPage = computed(() => props.currentPage > 1);

const visiblePageNumbers = computed(() => {
  if (props.totalPages <= props.maxVisiblePages) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }
  
  const halfVisible = Math.floor(props.maxVisiblePages / 2);
  let start = Math.max(1, props.currentPage - halfVisible);
  let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1);
  
  // Adjust start if we're near the end
  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1);
  }
  
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const showStartEllipsis = computed(() => {
  return visiblePageNumbers.value[0] > 1;
});

const showEndEllipsis = computed(() => {
  return visiblePageNumbers.value[visiblePageNumbers.value.length - 1] < props.totalPages;
});

// Methods
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page);
  }
};

const nextPage = () => {
  if (hasNextPage.value) {
    emit('page-change', props.currentPage + 1);
  }
};

const previousPage = () => {
  if (hasPreviousPage.value) {
    emit('page-change', props.currentPage - 1);
  }
};

const goToFirstPage = () => {
  if (hasPreviousPage.value) {
    emit('page-change', 1);
  }
};

const goToLastPage = () => {
  if (hasNextPage.value) {
    emit('page-change', props.totalPages);
  }
};

const handleItemsPerPageChange = (event) => {
  emit('items-per-page-change', parseInt(event.target.value));
};
</script>

<style scoped>
.pagination-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  display: flex;
  gap: 20px;
  color: var(--text-muted-color);
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background: var(--border-color);
  border-color: var(--header-color);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button i {
  font-size: 18px;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-number {
  min-width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover {
  background: var(--border-color);
  border-color: var(--header-color);
}

.page-number.active {
  background: var(--header-color);
  color: white;
  border-color: var(--header-color);
}

.ellipsis {
  padding: 0 10px;
  color: var(--text-muted-color);
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted-color);
  font-size: 14px;
}

.items-per-page-select {
  padding: 5px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-numbers {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style> 
