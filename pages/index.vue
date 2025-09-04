<template>
  <!--==================== HEADER ====================-->
  <!-- <header class="header" id="header">
      <div class="header__content">
         <a href="#" class="header__logo">PELIXS</a>
         <div class="header__actions">
            <template v-if="user">
               <button class="nav__button" @click="handleLogout">
               Logout
               </button>
            </template>
            <template v-else>
               <NuxtLink to="/login" class="nav__button">Login</NuxtLink>
            </template>
         </div>


         <div class="header__actions">
            <div class="nav__item">
               <a href="#" class="nav__link">
                  <i class="ri-notification-2-line"></i>Login
               </a>
            </div>
            <div class="nav__item">
               <a href="#" class="nav__link">
                  <i class="ri-account-circle-line"></i>Register
               </a>
            </div>   
            <div class="header__menu" id="header-menu">
               <i class="ri-menu-line"></i> 
            </div>
         </div>
      </div>

      <form action="" class="header__search">
         <i class="ri-search-line"></i> 
         <input type="search" placeholder="Search movies" class="header__input">
      </form>
   </header> -->
   <Header-3 />
     <!--==================== NAV ====================-->
     <!-- <nav class="nav" id="nav">
      <div class="nav__menu">
         <a href="#" class="nav__logo">PELIXS</a>

         <ul class="nav__list">
            <li class="nav__item">
               <a href="#" class="nav__link">
                  <i class="ri-home-5-line"></i> <span>Home</span>
               </a>
            </li>
            <li class="nav__item">
               <a href="#" class="nav__link">
                  <i class="ri-home-5-line"></i> <span>About</span>
               </a>
            </li>
       </ul>
       <div>
       <h3 class="nav__title">Testaments</h3>
       <ul class="nav__list">
            <li class="nav__item">
               <a href="#" class="nav__link">
                  <i class="ri-map-line"></i> <span>Old</span>
               </a>
            </li>

            <li class="nav__item">
               <a href="#" class="nav__link">
                  <i class="ri-map-line"></i> <span>New</span>
               </a>
            </li>

         </ul>
      </div>
         <div>
            <h3 class="nav__title">Account</h3>
            
            <ul class="nav__list">
               <li class="nav__item">
                  <a href="#" class="nav__link">
                     <i class="ri-account-circle-line"></i> <span>Profile</span>
                  </a>
               </li>

               <li class="nav__item">
                  <a href="#" class="nav__link">
                     <i class="ri-account-circle-fill"></i> <span>Profile 2</span>
                  </a>
               </li>
               <li class="nav__item">
                  <a href="#" class="nav__link">
                     <i class="ri-heart-3-line"></i> <span>Favorites</span>
                  </a>
               </li>
            </ul>
         </div>
      </div>

      <NuxtLink to="/" class="nav__link" @click.prevent="logoutUser">
         <i class="ri-logout-box-line"></i> <span>Log Out</span>
      </NuxtLink>

      <div class="nav__close" id="nav-close">
         <i class="ri-close-line"></i>
      </div>
   </nav> -->
      <Sidebar />
   <!--==================== DASHBOARD ====================-->
   <main class="main">
      <!--==================== BANNER ====================-->
      <section class="banner">
         <article class="banner__card">
             <div class="hero-content">
                     <div class="banner__content">
                         <p class="banner__experience">12 Years Experienced</p>
                         <h1 class="banner__title">Sacred Lore</h1>
                         <p class="banner__subtitle">A Fanfiction Site for Bible Stories</p>
                         <p class="banner__description">
                         Discover retellings of sacred texts with creative interpretations, tailored for today's readers.
                         </p>
                         <div class="banner__actions">
                             <NuxtLink href="#get-started" class="button">
                                 Get Started <span class="button-ornament"><i class="ri-arrow-right-s-line"></i></span>
                             </NuxtLink>
                             <NuxtLink href="#how-it-works" class="button">
                                 How It Works <span class="button-ornament"><i class="ri-arrow-right-s-line"></i></span>
                             </NuxtLink>
                         </div>
                     </div>
                 </div>
         </article>
      </section>

      <section class="container">
         <div class="main-wrapper">
            <div class="main_content">
               <div class="main_content_posts">
               <section class="search">

                  <!-- Old Testament Section -->
                  <div class="demo-section">
                  <h2>Old Testament Posts</h2>
                  <div class="posts-controls">
                     <div class="view-controls">
                        <label>View:</label>
                        <select v-model="oldTestamentViewMode" class="view-select">
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                        </select>
                     </div>
                     
                     <div class="filter-controls">
                        <label>Filter by Book:</label>
                        <select v-model="oldTestamentBookFilter" @change="filterOldTestamentPosts" class="filter-select">
                        <option value="">All Books</option>
                        <option v-for="book in oldTestamentBooks" :key="book" :value="book">
                           {{ book }}
                        </option>
                        </select>
                     </div>

                     <div class="filter-controls">
                        <label>Filter by Category:</label>
                        <select v-model="oldTestamentCategoryFilter" @change="filterOldTestamentPosts" class="filter-select">
                        <option value="">All Categories</option>
                        <option v-for="category in oldTestamentCategories" :key="category" :value="category">
                           {{ category }}
                        </option>
                        </select>
                     </div>

                     <div class="filter-controls">
                        <label>Sort by:</label>
                        <select v-model="oldTestamentSortOrder" @change="filterOldTestamentPosts" class="filter-select">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title A-Z</option>
                        <option value="likes">Most Liked</option>
                        <option value="views">Most Viewed</option>
                        </select>
                     </div>
                  </div>

                  <!-- Old Testament Posts Grid/List -->
                  <div v-if="filteredOldTestamentPosts.length > 0" class="posts-container" :class="oldTestamentViewMode">
                     <div 
                        v-for="post in paginatedOldTestamentPosts" 
                        :key="post.id" 
                        class="post-card"
                     >
                        <div class="post-header">
                           <div class="post-meta">
                              <span class="post-book">{{ post.book_name }}</span>
                              <span class="post-testament">{{ post.testament }}</span>
                              <span class="post-category">{{ post.category }}</span>
                           </div>
                           <h3 class="post-title">
                              <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
                           </h3>
                        </div>
                        
                        <!-- <p class="post-description">{{ post.description }}</p> -->

                        <!-- Author Information -->
                        <div class="post-author">
                        <div class="author-avatar">
                           <img 
                              :src="post.profiles?.avatar_url || '/assets/images/default-avatar.png'" 
                              :alt="post.profiles?.names || 'Author'"
                              class="avatar-image"
                           />
                        </div>
                        <div class="author-info">
                           <span class="author-name">{{ post.profiles?.names }} {{ post.profiles?.surnames }}</span>
                        </div>
                        </div>
                        
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

                  <!-- No Old Testament Posts Message -->
                  <div v-else-if="!postsStore.loading" class="no-posts">
                     <p>No Old Testament posts found matching your criteria.</p>
                     <button @click="resetOldTestamentFilters" class="reset-button">
                        Reset Filters
                     </button>
                  </div>

                  <!-- Old Testament Pagination -->
                  <PaginationComponent
                     v-if="filteredOldTestamentPosts.length > 0"
                     :current-page="oldTestamentCurrentPage"
                     :total-pages="oldTestamentTotalPages"
                     :total-items="filteredOldTestamentPosts.length"
                     :items-per-page="oldTestamentItemsPerPage"
                     @page-change="handleOldTestamentPageChange"
                     @items-per-page-change="handleOldTestamentItemsPerPageChange"
                  />
                  </div>

                  <section class="subscribe">
                                 <!-- <div class="left_fashion main_nav_box">
                                    <ul>
                                       <li class="nav_gadgets"><a href="">Subscribe</a></li>
                                    </ul>
                                 </div> -->
                                    <NewsletterSubscribe />
                                 </section>


                  <!-- New Testament Section -->
                  <div class="demo-section">
                  <h2>New Testament Posts</h2>
                  <div class="posts-controls">
                     <div class="view-controls">
                        <label>View:</label>
                        <select v-model="newTestamentViewMode" class="view-select">
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                        </select>
                     </div>
                     
                     <div class="filter-controls">
                        <label>Filter by Book:</label>
                        <select v-model="newTestamentBookFilter" @change="filterNewTestamentPosts" class="filter-select">
                        <option value="">All Books</option>
                        <option v-for="book in newTestamentBooks" :key="book" :value="book">
                           {{ book }}
                        </option>
                        </select>
                     </div>

                     <div class="filter-controls">
                        <label>Filter by Category:</label>
                        <select v-model="newTestamentCategoryFilter" @change="filterNewTestamentPosts" class="filter-select">
                        <option value="">All Categories</option>
                        <option v-for="category in newTestamentCategories" :key="category" :value="category">
                           {{ category }}
                        </option>
                        </select>
                     </div>

                     <div class="filter-controls">
                        <label>Sort by:</label>
                        <select v-model="newTestamentSortOrder" @change="filterNewTestamentPosts" class="filter-select">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title A-Z</option>
                        <option value="likes">Most Liked</option>
                        <option value="views">Most Viewed</option>
                        </select>
                     </div>
                  </div>

                  <!-- New Testament Posts Grid/List -->
                  <div v-if="filteredNewTestamentPosts.length > 0" class="posts-container" :class="newTestamentViewMode">
                     <div 
                        v-for="post in paginatedNewTestamentPosts" 
                        :key="post.id" 
                        class="post-card"
                     >
                        <div class="post-header">
                           <div class="post-meta">
                              <span class="post-book">{{ post.book_name }}</span>
                              <span class="post-testament">{{ post.testament }}</span>
                              <span class="post-category">{{ post.category }}</span>
                           </div>
                           <h3 class="post-title">
                              <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
                           </h3>
                        </div>
                        
                        <!-- <p class="post-description">{{ post.description }}</p> -->

                        <!-- Author Information -->
                        <div class="post-author">
                        <div class="author-avatar">
                           <img 
                              :src="post.profiles?.avatar_url || '/assets/images/default-avatar.png'" 
                              :alt="post.profiles?.names || 'Author'"
                              class="avatar-image"
                           />
                        </div>
                        <div class="author-info">
                           <span class="author-name">{{ post.profiles?.names }} {{ post.profiles?.surnames }}</span>
                        </div>
                        </div>
                        
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

                  <!-- No New Testament Posts Message -->
                  <div v-else-if="!postsStore.loading" class="no-posts">
                     <p>No New Testament posts found matching your criteria.</p>
                     <button @click="resetNewTestamentFilters" class="reset-button">
                        Reset Filters
                     </button>
                  </div>

                  <!-- New Testament Pagination -->
                  <PaginationComponent
                     v-if="filteredNewTestamentPosts.length > 0"
                     :current-page="newTestamentCurrentPage"
                     :total-pages="newTestamentTotalPages"
                     :total-items="filteredNewTestamentPosts.length"
                     :items-per-page="newTestamentItemsPerPage"
                     @page-change="handleNewTestamentPageChange"
                     @items-per-page-change="handleNewTestamentItemsPerPageChange"
                  />
                  </div>
               </section>
                  <!-- </div> -->
               </div>
               <aside class="sidebar">
                 <div class="sidebar-content">
                     <div v-if="popularPosts.length > 0" class="sidebar-widget widget-popular-posts mb-50">
                         <div class="widget-header widget-header-style-1 position-relative mb-30 wow fadeInUp animated">
                             <h5 class="widget-title mt-5 mb-30">Popular Posts</h5>
                         </div>
                         <div class="post-block-list post-module-6 mt-50 overflow-hidden">
                             <div class="main_content_posts">
                                 <div class="alith_post_title_small" v-for="post in popularPosts" :key="post.id">
                                    <div class="post-header">
                                       <h3 class="post-title">
                                          <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
                                       </h3>
                                    </div>
                                     <!-- <h5><a href="single.html">{{ post.title }}</a></h5> -->
                                     <!-- <div class="entry-meta meta-1 font-small color-grey">
                                         <span class="post-on">{{ formatDate(post.created_at) }}</span>
                                         <span class="hit-count has-dot">{{ post.likes_count }} Likes</span>
                                     </div> -->
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
                         </div>
                     </div>

                     <div class="sidebar-widget widget-latest-posts mb-50 mt-15">
                        <div class="widget-header widget-header-style-1 position-relative mb-30  wow fadeInUp animated">
                              <h5 class="widget-title mt-5 mb-30">Recent Posts</h5>
                        </div>
                        <div class="post-block-list post-module-6 mt-50 overflow-hidden">
                           <div class="main_content_posts">
                              <div class="alith_post_title_small" v-for="post in latestPosts" :key="post.id">
                                 <div class="post-header">
                                       <h3 class="post-title">
                                          <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
                                       </h3>
                                    </div>
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
                        </div>
                     </div>
                 </div>
               </aside>
            </div>
         </div>
     </section>

   </main>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePostsStore } from '@/stores/posts';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const authors = ref([]);

const isLoggedIn = computed(() => !!authStore.user);

const logoutUser = async () => {
await authStore.logOut();
navigateTo('/');
};

// Access the posts store
const postsStore = usePostsStore();

// Define a loading state
const isLoading = ref(true);

// Fetch posts on mount
onMounted(async () => {
try {
 await postsStore.fetchPosts(); 
} catch (error) {
 console.error('Error fetching posts:', error);
} finally {
 isLoading.value = false; 
}
});

const formatDate = (dateString) => {
if (!dateString) return 'Unknown Date';
const date = new Date(dateString);
return date.toLocaleDateString(undefined, {
 year: 'numeric',
 month: 'long',
 day: 'numeric'
});
};


// Get all posts
const allPosts = computed(() => postsStore.posts);

// Latest 6 posts, excluding drafts
const latestPosts = computed(() =>
allPosts.value
 .filter(post => post.status !== 'draft')
 .slice(0, 6)
);

// Next posts, excluding drafts 
const nextPosts = computed(() => {
if (!allPosts.value.length) return [];
return allPosts.value
 .filter(post => post.status !== 'draft')
 .slice(2, 6)
 .map(({ title, thumbnail, thumbnail_alt, comments, created_at, category }) => ({
   title,
   thumbnail,
   thumbnail_alt, 
   comments,
   created_at,
   category,
 }));
});

// Group posts by testament, excluding drafts
const postsByTestament = (testament) =>
postsStore.posts
 .filter(post => post.status !== 'draft')
 .filter(post => post.testament === testament);

const newTestamentPosts = computed(() =>
postsByTestament('New Testament').slice(0, 4)
);

const oldTestamentPosts = computed(() =>
postsByTestament('Old Testament').slice(0, 3)
);

const popularPosts = computed(() => 
 allPosts.value
     .filter(post => post.status !== 'draft' && post.likes_count > 0)
     .sort((a, b) => b.likes_count - a.likes_count)
     .slice(0, 5)
);




// ==================== DEMO CODE START ====================
// Old Testament Section Variables
const oldTestamentViewMode = ref('grid');
const oldTestamentBookFilter = ref('');
const oldTestamentCategoryFilter = ref('');
const oldTestamentSortOrder = ref('newest');
const oldTestamentCurrentPage = ref(1);
const oldTestamentItemsPerPage = ref(10);

// New Testament Section Variables
const newTestamentViewMode = ref('grid');
const newTestamentBookFilter = ref('');
const newTestamentCategoryFilter = ref('');
const newTestamentSortOrder = ref('newest');
const newTestamentCurrentPage = ref(1);
const newTestamentItemsPerPage = ref(10);

// Old Testament Computed Properties
const oldTestamentBooks = computed(() => {
  const books = allPosts.value
    .filter(post => post.testament === 'Old Testament' && post.status !== 'draft')
    .map(post => post.book_name);
  return [...new Set(books)].sort();
});

const oldTestamentCategories = computed(() => {
  const categories = allPosts.value
    .filter(post => post.testament === 'Old Testament' && post.status !== 'draft')
    .map(post => post.category);
  return [...new Set(categories)].filter(Boolean).sort();
});

const filteredOldTestamentPosts = computed(() => {
  let posts = allPosts.value.filter(post => 
    post.testament === 'Old Testament' && post.status !== 'draft'
  );

  // Filter by book
  if (oldTestamentBookFilter.value) {
    posts = posts.filter(post => post.book_name === oldTestamentBookFilter.value);
  }

  // Filter by category
  if (oldTestamentCategoryFilter.value) {
    posts = posts.filter(post => post.category === oldTestamentCategoryFilter.value);
  }

  // Sort posts
  switch (oldTestamentSortOrder.value) {
    case 'newest':
      posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'oldest':
      posts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case 'title':
      posts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'likes':
      posts.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      break;
    case 'views':
      posts.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
      break;
  }

  return posts;
});

const oldTestamentTotalPages = computed(() => 
  Math.ceil(filteredOldTestamentPosts.value.length / oldTestamentItemsPerPage.value)
);

const paginatedOldTestamentPosts = computed(() => {
  const start = (oldTestamentCurrentPage.value - 1) * oldTestamentItemsPerPage.value;
  const end = start + oldTestamentItemsPerPage.value;
  return filteredOldTestamentPosts.value.slice(start, end);
});

// New Testament Computed Properties
const newTestamentBooks = computed(() => {
  const books = allPosts.value
    .filter(post => post.testament === 'New Testament' && post.status !== 'draft')
    .map(post => post.book_name);
  return [...new Set(books)].sort();
});

const newTestamentCategories = computed(() => {
  const categories = allPosts.value
    .filter(post => post.testament === 'New Testament' && post.status !== 'draft')
    .map(post => post.category);
  return [...new Set(categories)].filter(Boolean).sort();
});

const filteredNewTestamentPosts = computed(() => {
  let posts = allPosts.value.filter(post => 
    post.testament === 'New Testament' && post.status !== 'draft'
  );

  // Filter by book
  if (newTestamentBookFilter.value) {
    posts = posts.filter(post => post.book_name === newTestamentBookFilter.value);
  }

  // Filter by category
  if (newTestamentCategoryFilter.value) {
    posts = posts.filter(post => post.category === newTestamentCategoryFilter.value);
  }

  // Sort posts
  switch (newTestamentSortOrder.value) {
    case 'newest':
      posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'oldest':
      posts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case 'title':
      posts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'likes':
      posts.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      break;
    case 'views':
      posts.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
      break;
  }

  return posts;
});

const newTestamentTotalPages = computed(() => 
  Math.ceil(filteredNewTestamentPosts.value.length / newTestamentItemsPerPage.value)
);

const paginatedNewTestamentPosts = computed(() => {
  const start = (newTestamentCurrentPage.value - 1) * newTestamentItemsPerPage.value;
  const end = start + newTestamentItemsPerPage.value;
  return filteredNewTestamentPosts.value.slice(start, end);
});

// Old Testament Methods
const filterOldTestamentPosts = () => {
  oldTestamentCurrentPage.value = 1; // Reset to first page when filtering
};

const resetOldTestamentFilters = () => {
  oldTestamentBookFilter.value = '';
  oldTestamentCategoryFilter.value = '';
  oldTestamentSortOrder.value = 'newest';
  oldTestamentCurrentPage.value = 1;
};

const handleOldTestamentPageChange = (page) => {
  oldTestamentCurrentPage.value = page;
  // Scroll to top of old testament posts section
  const postsSection = document.querySelector('.demo-section:nth-of-type(2) .posts-container');
  if (postsSection) {
    postsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleOldTestamentItemsPerPageChange = (newItemsPerPage) => {
  oldTestamentItemsPerPage.value = newItemsPerPage;
};

// New Testament Methods
const filterNewTestamentPosts = () => {
  newTestamentCurrentPage.value = 1; // Reset to first page when filtering
};

const resetNewTestamentFilters = () => {
  newTestamentBookFilter.value = '';
  newTestamentCategoryFilter.value = '';
  newTestamentSortOrder.value = 'newest';
  newTestamentCurrentPage.value = 1;
};

const handleNewTestamentPageChange = (page) => {
  newTestamentCurrentPage.value = page;
  // Scroll to top of new testament posts section
  const postsSection = document.querySelector('.demo-section:nth-of-type(3) .posts-container');
  if (postsSection) {
    postsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleNewTestamentItemsPerPageChange = (newItemsPerPage) => {
  newTestamentItemsPerPage.value = newItemsPerPage;
};
// ==================== DEMO CODE END ====================
</script>

<style scoped>

.main-container {
background: #0B0E18;
color: white;
min-height: 100vh;
padding: 20px;
}

.main_content_posts{
display: flex;
flex-direction: column;
gap: 2.5rem;
}

.header {
margin-bottom: 30px;
background-color: var(--bg);
}

.header-content {
display: flex;
justify-content: space-between;
align-items: center;
}

.header h1 {
font-size: 24px;
margin-bottom: 8px;
}

.subtitle {
color: #8E93AF;
font-size: 14px;
}

.header-right {
display: flex;
align-items: center;
gap: 16px;
}

.network-selector, .connect-wallet {
display: flex;
align-items: center;
gap: 8px;
padding: 8px 16px;
background: rgba(255, 255, 255, 0.1);
border-radius: 12px;
border: none;
color: white;
cursor: pointer;
}

.earn-card {
background: linear-gradient(45deg, #1E2230, #2E3348);
border-radius: 20px;
padding: 30px;
display: flex;
justify-content: space-between;
margin-bottom: 30px;
}

.stats {
display: flex;
gap: 30px;
margin-top: 20px;
}

.tabs-section {
margin-bottom: 30px;
}

.tabs {
display: flex;
gap: 16px;
margin-bottom: 20px;
}

.tab-item {
display: flex;
align-items: center;
gap: 8px;
padding: 12px 24px;
background: rgba(255, 255, 255, 0.1);
border-radius: 12px;
border: none;
color: white;
cursor: pointer;
}

.chain-stats {
display: flex;
gap: 16px;
}

.chain-item {
display: flex;
align-items: center;
gap: 8px;
padding: 8px 16px;
background: rgba(255, 255, 255, 0.1);
border-radius: 12px;
}

.value-header {
display: flex;
justify-content: space-between;
align-items: center;
}

.view-controls {
display: flex;
align-items: center;
gap: 16px;
}

.switch {
position: relative;
display: inline-block;
width: 40px;
height: 20px;
}

.slider {
position: absolute;
cursor: pointer;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(255, 255, 255, 0.1);
border-radius: 20px;
transition: 0.4s;
}

.banner {
position: relative;
margin-bottom: 2rem;
}

.banner__card {
position: relative;
border-radius: 1rem;
overflow: hidden;
background-image: linear-gradient(rgba(7, 5, 2, 0.4), rgba(0, 0, 0, 0.3)), 
                 radial-gradient(circle at center, transparent 0%, rgba(7, 5, 2, 0.9) 100%),
                 url('/assets/images/book-hero.png');
background-position: center;
background-size: cover;
background-repeat: no-repeat;
min-height: 300px; 
display: flex;
align-items: center;
padding: 0 2rem;
}

.banner__shadow {
position: absolute;
left: 0;
bottom: 0;
width: 100%;
height: 100%;
/* Removing the previous gradient as we've added it to the background-image */
/* background: linear-gradient(0deg, rgba(139, 161, 122, 1) 0%, rgba(139, 161, 122, 0) 100%); */
}

.banner__data {
position: absolute;
bottom: 1.5rem;
left: 1.5rem;
z-index: 1;
}

.banner__title {
color: var(--white-color);
font-size: 1.5rem;
margin-bottom: 0.5rem;
}

.banner__category {
color: #ccc;
font-size: 0.875rem;
}

.banner__content{
 margin: auto 0;
}

.hero-content{
height: 100%;
display: grid;
place-items: center;
}

.hero-content h1 {
 font-size: 8rem;
 font-weight: 700;
 margin-bottom: 1rem;
 line-height: 1.2;
 text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6);
 /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); */
}


.hero-content p {
font-size: 1.2rem;
margin-bottom: 2rem;
max-width: 600px;
font-weight: 600;
}

.banner__actions{
 display: flex;
 gap: 1.5rem;
}

.button {
display: inline-block;
height: 46px;
border-radius: 200px;
padding: 0 68px 0 34px;
background: linear-gradient(145deg, hsl(28, 42%, 26%), hsl(28, 42%, 26%));
box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1);
box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.1);
color: var(--first-color-lighten);
letter-spacing: .5px;
text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
font-weight: 800;
line-height: 46px;
cursor: pointer;
transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
position: relative;
text-align: center;
}

.button:hover {
background: linear-gradient(145deg, hsl(112, 6%, 50%), hsl(112, 6%, 42%));
transform: translateY(-2px);
box-shadow: 
 6px 6px 12px rgba(0, 0, 0, 0.25),
 -6px -6px 12px rgba(255, 255, 255, 0.15);
}

.button-ornament {
position: absolute;
top: 6px;
right: 6px;
width: 34px;
height: 34px;
border-radius: 50%;
background: hsl(28, 42%, 18%);
display: flex;
align-items: center;
justify-content: center;
transition: all 0.2s ease-in-out;
}

.button:hover .button-ornament {
background: hsl(16, 63%, 32%);
transform: scale(1.05);
}

.button-ornament i {
color: #fff;
font-size: 20px;
transition: transform 0.3s ease-in-out;
}

.button:hover .button-ornament i {
transform: scale(1.2);
}


.main_content{
 display: grid;
 grid-template-columns: 3fr 300px;
 gap: 20px;
}

.post_list{
display: grid;
grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
gap: 20px;
}

.subscribe {
 margin-bottom: 45px;
 display: table;
 padding: 0px 30px;
 width: 100%;
 border-radius: 5px;
}

.side-newsletter {
 background: var(--body-color);
 padding: 20px;
 border-radius: 5px;
 box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.subscribe h4 {
 font-weight: 600;
 font-size: 20px;
 margin: -8px 0 14px;
 color: #222222;
}

.side-newsletter p {
 font-size: 15px;
 color: #707070;
 margin: 0 0 15px;
}

.side-newsletter input {
 border: 1px solid #e5e5e5;
 border-radius: 5px;
 height: 36px;
 background: #ffffff;
 padding: 0 20px;
 width: 100%;
 text-align: center;
 margin-bottom: 10px;
}

.side-newsletter button {
 border: 1px solid var(--title-color);
 border-radius: 5px;
 height: 36px;
 background: var(--title-color);
 padding: 0 20px;
 width: 100%;
 text-align: center;
 margin-bottom: 10px;
 color: var(--first-color-lighten);
 font-size: 11px;
 letter-spacing: 0.06em;
 font-weight: bold;
 text-transform: uppercase;
}

.side-newsletter span {
 color: #787878;
 font-size: 12px;
 letter-spacing: 0.03em;
 margin: -7px 0 -3px;
 display: table;
 width: 100%;
}


.sidebar{
 /* box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); */
 box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
 /* padding: 0 2rem; */
 background-color: var(--bg);
}

.main_nav_box ul {
 list-style: outside none none;
 padding: 0;
}

.main_nav_box ul li {
 display: inline-block;
 margin-right: -4px;
 padding: 8px 0;
 position: relative;
}

.main_nav_box ul li a {
 border-right: 1px solid #efefef;
 color: #444444;
 display: block;
 font-size: 13px;
 font-weight: 600;
 /* margin-left: 20px; */
 padding: 18px 37px 18px 54px;
 text-transform: uppercase;
}

.header_fasion{
 border-bottom: 1px solid var(--first-color-lighten);
 margin-bottom: 36px;
 overflow: hidden;
 padding-top: 12px;
 display: flex;
 justify-content: space-between;
 align-items: center;
}

.left_fashion.main_nav_box ul li a {
 border-right: 0 solid #efefef;
 color: #35a3f0;
 font-size: 1.2rem;
 /* margin-left: 23px; */
 padding: 18px 29px 9px 20px;
}

.left_fashion.main_nav_box ul li.nav_gadgets a {
 color: var(--sidebar-title);
}

.left_fashion.main_nav_box ul li.old_test a {
 color: var(--first-color);
}

.fasion_right {
 /* float: left; */
 box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.8), -2px -2px 8px rgba(178, 132, 73, 0.2);
 /* box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1);
box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.1); */
padding: 10px 20px 10px 20px;
border-radius: 200px;
display: flex;
align-items: center;
}

.fasion_right > a {
 display: block;
 color: var(--white-color);
 letter-spacing: .5px;
 text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
 font-weight: 800;
 cursor: pointer;
 transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;

}

.widget-popular-posts {
 /* background-color: var(--body-color); */
 padding: 20px;
 border-radius: 5px;
 box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.widget-title {
 font-size: 1.5rem;
 font-weight: 600;
 /* border-bottom: 2px solid var(--first-color); */
 /* padding-bottom: 10px; */
}

.alith_post_title_small h5 a{
 color: var(--title-color);
 text-transform: capitalize;
 font-size: 1rem;
}



/* ==================== DEMO STYLES START ==================== */
.demo-section {
  /* margin-bottom: 40px; */
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  margin: 0 0 20px 0;
  color: var(--title-color);
  font-size: 1.8rem;
  padding-bottom: 10px;
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
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   gap: 10px;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: box-shadow 0.2s ease;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); 
  background-clip: padding-box;
}

.post-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* .post-header {
  margin-bottom: 15px;
} */

.post-title {
  /* margin: 0 0 15px 0; */
  font-size: 1.3rem;
  text-transform: capitalize;
}

.post-title a {
  color: var(--title-color);
  text-decoration: none;
}

.post-title a:hover {
  text-decoration: underline;
}

.post-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
}

.post-book,
.post-testament,
.post-category {
  padding: 4px 12px;
  background: var(--border-color);
  border-radius: 4px;
  color: var(--white-color);
}

.post-description {
  /* margin: 0 0 15px 0; */
  color: var(--white-color);
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

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
  /* margin: 10px 0;
  padding: 12px 0; */
  /* background: #f8f9fa; */
  border-radius: 8px;
}

.author-avatar {
  flex-shrink: 0;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1);
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.1);
    /* border: 2px solid var(--title-color); */
    padding: 10px;
    overflow: hidden;
}

.avatar-image {
   width: 100%;
   height: 100%;
  /* width: 40px;
  height: 40px; */
  border-radius: 50%;
  object-fit: cover;
  /* border: 2px solid var(--border-color); */
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: var(--sidebar-title);
  font-size: 14px;
}

.alith_post_title_small{
   border-bottom: 1px solid var(--border-color);
   padding-bottom: 15px;
}

.alith_post_title_small:last-child {
   border-bottom: none;
}

.alith_post_title_small .post-header{
   margin-bottom: 15px;
}

.alith_post_title_small .post-header .post-title {
   font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .posts-controls {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}
/* ==================== DEMO STYLES END ==================== */
</style>