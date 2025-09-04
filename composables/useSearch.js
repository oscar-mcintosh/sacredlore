export const useSearch = () => {
  const { $supabase } = useNuxtApp();
  
  // Search state
  const searchQuery = ref('');
  const searchResults = ref([]);
  const searchFilters = ref({
    testament: '',
    book: '',
    author: '',
    status: 'published',
    dateRange: {
      start: null,
      end: null
    },
    tags: []
  });
  const searchSort = ref({
    field: 'created_at',
    direction: 'desc'
  });
  const searchLoading = ref(false);
  const searchError = ref(null);
  
  // Search posts with advanced filters
  const searchPosts = async (query = '', filters = {}, sort = {}) => {
    try {
      searchLoading.value = true;
      searchError.value = null;
      
      // Build the query
      let supabaseQuery = $supabase
        .from('posts')
        .select(`
          *,
          profiles:author_profile_id (
            names,
            surnames,
            avatar_url
          )
        `);
      
      // Apply text search
      if (query && query.trim().length > 0) {
        const searchTerm = query.trim();
        supabaseQuery = supabaseQuery.or(`
          title.ilike.%${searchTerm}%,
          description.ilike.%${searchTerm}%,
          book_name.ilike.%${searchTerm}%
        `);
      }
      
      // Apply filters
      if (filters.testament) {
        supabaseQuery = supabaseQuery.eq('testament', filters.testament);
      }
      
      if (filters.book) {
        supabaseQuery = supabaseQuery.eq('book_name', filters.book);
      }
      
      if (filters.author) {
        supabaseQuery = supabaseQuery.eq('author_profile_id', filters.author);
      }
      
      if (filters.status) {
        supabaseQuery = supabaseQuery.eq('status', filters.status);
      }
      
      if (filters.dateRange?.start) {
        supabaseQuery = supabaseQuery.gte('created_at', filters.dateRange.start);
      }
      
      if (filters.dateRange?.end) {
        supabaseQuery = supabaseQuery.lte('created_at', filters.dateRange.end);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        supabaseQuery = supabaseQuery.overlaps('tags', filters.tags);
      }
      
      // Apply sorting
      if (sort.field && sort.direction) {
        supabaseQuery = supabaseQuery.order(sort.field, { ascending: sort.direction === 'asc' });
      }
      
      // Execute query
      const { data, error } = await supabaseQuery;
      
      if (error) throw error;
      
      searchResults.value = data || [];
      return data;
      
    } catch (err) {
      searchError.value = err.message;
      console.error('Search error:', err);
      throw new Error('Search failed. Please try again.');
    } finally {
      searchLoading.value = false;
    }
  };
  
  // Quick search (simple text search)
  const quickSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      searchResults.value = [];
      return [];
    }
    
    return await searchPosts(query, {}, { field: 'created_at', direction: 'desc' });
  };
  
  // Search by filters only
  const searchByFilters = async (filters) => {
    return await searchPosts('', filters, searchSort.value);
  };
  
  // Update search filters
  const updateFilters = (newFilters) => {
    searchFilters.value = { ...searchFilters.value, ...newFilters };
  };
  
  // Update search sort
  const updateSort = (newSort) => {
    searchSort.value = { ...searchSort.value, ...newSort };
  };
  
  // Clear search
  const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
    searchFilters.value = {
      testament: '',
      book: '',
      author: '',
      status: 'published',
      dateRange: {
        start: null,
        end: null
      },
      tags: []
    };
    searchError.value = null;
  };
  
  // Get search suggestions (for autocomplete)
  const getSearchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) return [];
    
    try {
      const { data, error } = await $supabase
        .from('posts')
        .select('title, book_name, tags')
        .or(`
          title.ilike.%${query.trim()}%,
          book_name.ilike.%${query.trim()}%
        `)
        .limit(5);
      
      if (error) throw error;
      
      // Extract unique suggestions
      const suggestions = new Set();
      data.forEach(post => {
        if (post.title.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(post.title);
        }
        if (post.book_name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(post.book_name);
        }
        if (post.tags) {
          post.tags.forEach(tag => {
            if (tag.toLowerCase().includes(query.toLowerCase())) {
              suggestions.add(tag);
            }
          });
        }
      });
      
      return Array.from(suggestions).slice(0, 10);
      
    } catch (err) {
      console.error('Error getting search suggestions:', err);
      return [];
    }
  };
  
  // Get available filter options
  const getFilterOptions = async () => {
    try {
      const [testaments, books, authors] = await Promise.all([
        $supabase.from('posts').select('testament').not('testament', 'is', null),
        $supabase.from('books').select('name'),
        $supabase.from('profiles').select('id, names, surnames').eq('isAuthor', true)
      ]);
      
      return {
        testaments: [...new Set(testaments.data?.map(t => t.testament) || [])],
        books: books.data?.map(b => b.name) || [],
        authors: authors.data?.map(a => ({ 
          id: a.id, 
          name: `${a.names} ${a.surnames}` 
        })) || []
      };
    } catch (err) {
      console.error('Error getting filter options:', err);
      return { testaments: [], books: [], authors: [] };
    }
  };
  
  return {
    // State
    searchQuery: readonly(searchQuery),
    searchResults: readonly(searchResults),
    searchFilters: readonly(searchFilters),
    searchSort: readonly(searchSort),
    searchLoading: readonly(searchLoading),
    searchError: readonly(searchError),
    
    // Actions
    searchPosts,
    quickSearch,
    searchByFilters,
    updateFilters,
    updateSort,
    clearSearch,
    getSearchSuggestions,
    getFilterOptions
  };
}; 