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
                  <!-- <div class="banner__shadow"></div> -->
   
                  <!-- <div class="banner__data">
                     <h2 class="banner__title">Avengers</h2>
                     <span class="banner__category">Action</span>
                  </div> -->
               <!-- </a> -->
            </article>
         </section>

         <section class="container">
            <div class="main-wrapper">
               <div class="main_content">
                  <div class="main_content_posts">
                     <div class="post_list">
                        <Card :posts="latestPosts" />
                     </div>
                     <section class="subscribe">
                     <div class="left_fashion main_nav_box">
                        <ul>
                           <li class="nav_gadgets"><a href="">Subscribe</a></li>
                        </ul>
                     </div>
                        <NewsletterSubscribe />
                     </section>
                     <div class="testament-sections">
                        <div class="header_fasion gadgets_heading">
                           <div class="left_fashion main_nav_box">
                              <ul>
                                 <li class="nav_gadgets"><a href="">New Testament</a></li>
                              </ul>
                           </div>
                           <div class="fasion_right">                        
                              <nuxt-link to="/testament/newtestament">View all</nuxt-link>
                           </div>
                        </div>
                        <div class="post_list">
                           <Card :posts="newTestamentPosts" />
                        </div>
                     </div>
                     <div class="testament-sections">
                        <div class="header_fasion gadgets_heading">
                        <div class="left_fashion main_nav_box">
                          <ul>
                            <li class="old_test"><a href="">Old Testament</a></li>
                          </ul>
                        </div>
                        <div class="fasion_right">                        
                          <nuxt-link to="/testament/oldtestament">View all</nuxt-link>
                        </div>
                      </div>
                        <div class="post_list">
                            <Card :posts="oldTestamentPosts" />
                        </div> 
                     </div>
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
                                        <h5><a href="single.html">{{ post.title }}</a></h5>
                                        <div class="entry-meta meta-1 font-small color-grey">
                                            <span class="post-on">{{ formatDate(post.created_at) }}</span>
                                            <span class="hit-count has-dot">{{ post.likes_count }} Likes</span>
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
                                 <!-- <span class="item-count vertical-align">1.</span> -->
                                 <div class="alith_post_title_small" v-for="post in latestPosts" :key="post.id">
                                    <h5><a href="single.html">{{ post.title }}</a></h5>
                                    <div class="entry-meta meta-1 font-small color-grey">
                                          <span class="post-on">{{ formatDate(post.created_at) }}</span>
                                          <span class="hit-count has-dot">{{ post.comments }} Views</span>
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
         <!--==================== MOVIES ====================-->
         <section class="movie">
            <h3 class="card__title">Movies</h3>

            <div class="movie__swiper swiper">
               <div class="swiper-wrapper">
                  <article class="card__article swiper-slide">
                     <a href="#" class="card__link">
                        <!-- <img src="assets/img/movie-1.png" alt="image" class="card__img"> -->
                        <div class="card__shadow"></div>
   
                        <div class="card__data">
                           <h3 class="card__name">Avengers</h3>
                           <span class="card__category">Action</span>
                        </div>
   
                        <i class="ri-heart-3-line card__like"></i>
                     </a>
                  </article>

                  <article class="card__article swiper-slide">
                     <a href="#" class="card__link">
                        <!-- <img src="assets/img/movie-2.png" alt="image" class="card__img"> -->
                        <div class="card__shadow"></div>
   
                        <div class="card__data">
                           <h3 class="card__name">Interstellar</h3>
                           <span class="card__category">Science/Fiction</span>
                        </div>
   
                        <i class="ri-heart-3-line card__like"></i>
                     </a>
                  </article>

                  <article class="card__article swiper-slide">
                     <a href="#" class="card__link">
                        <!-- <img src="assets/img/movie-3.png" alt="image" class="card__img"> -->
                        <div class="card__shadow"></div>
   
                        <div class="card__data">
                           <h3 class="card__name">The Lord of the Rings</h3>
                           <span class="card__category">Science/Fiction</span>
                        </div>
   
                        <i class="ri-heart-3-line card__like"></i>
                     </a>
                  </article>

                  <article class="card__article swiper-slide">
                     <a href="#" class="card__link">
                        <!-- <img src="assets/img/movie-4.png" alt="image" class="card__img"> -->
                        <div class="card__shadow"></div>
   
                        <div class="card__data">
                           <h3 class="card__name">Inception</h3>
                           <span class="card__category">Action</span>
                        </div>
   
                        <i class="ri-heart-3-line card__like"></i>
                     </a>
                  </article>

                  <article class="card__article swiper-slide">
                     <a href="#" class="card__link">
                        <!-- <img src="assets/img/movie-5.png" alt="image" class="card__img"> -->
                        <div class="card__shadow"></div>
   
                        <div class="card__data">
                           <h3 class="card__name">The Dark Knight</h3>
                           <span class="card__category">Science Fiction</span>
                        </div>
   
                        <i class="ri-heart-3-line card__like"></i>
                     </a>
                  </article>
                   
                  <article class="card__article swiper-slide">
                     <a href="#" class="card__link">
                        <!-- <img src="assets/img/movie-6.png" alt="image" class="card__img"> -->
                        <div class="card__shadow"></div>
   
                        <div class="card__data">
                           <h3 class="card__name">Avengers Age of Ultron</h3>
                           <span class="card__category">Action</span>
                        </div>
   
                        <i class="ri-heart-3-line card__like"></i>
                     </a>
                  </article>
               </div>
            </div>
         </section>

         <!--==================== NEW ====================-->
         <section class="new">
            <h3 class="card__title">New</h3>

            <div class="new__swiper swiper">
               <div class="swiper-wrapper">
                  <article class="new__card card__article swiper-slide">
                     <a href="#" class="card__link">
                        <div class="card__shadow"></div>
   
                        <div class="new__data card__data">
                           <h3 class="card__name">Jurassic World</h3>
                           <span class="card__category">Science/Fiction</span>
                        </div>
                     </a>
                  </article>

                  <article class="new__card card__article swiper-slide">
                     <a href="#" class="card__link">
                        <div class="card__shadow"></div>
   
                        <div class="new__data card__data">
                           <h3 class="card__name">Spider-Man No Way Home</h3>
                           <span class="card__category">Science/Action</span>
                        </div>
                     </a>
                  </article>

                  <article class="new__card card__article swiper-slide">
                     <a href="#" class="card__link">
                        <div class="card__shadow"></div>
   
                        <div class="new__data card__data">
                           <h3 class="card__name">Fantastic Beasts: Dumbledore's Secrets</h3>
                           <span class="card__category">Adventure/Fantasy</span>
                        </div>
                     </a>
                  </article>

                  <article class="new__card card__article swiper-slide">
                     <a href="#" class="card__link">
                        <div class="card__shadow"></div>
   
                        <div class="new__data card__data">
                           <h3 class="card__name">Toy Story</h3>
                           <span class="card__category">Animation</span>
                        </div>
                     </a>
                  </article>

                  <article class="new__card card__article swiper-slide">
                     <a href="#" class="card__link">
                        <div class="card__shadow"></div>
   
                        <div class="new__data card__data">
                           <h3 class="card__name">Sonic 2</h3>
                           <span class="card__category">Action/Adventure</span>
                        </div>
                     </a>
                  </article>
                  
                  <article class="new__card card__article swiper-slide">
                     <a href="#" class="card__link">
                        <!-- <img src="assets/img/new-6.png" alt="image" class="card__img"> -->
                        <div class="card__shadow"></div>
   
                        <div class="new__data card__data">
                           <h3 class="card__name">X-Men</h3>
                           <span class="card__category">Science/Action</span>
                        </div>
                     </a>
                  </article>
               </div>
            </div>

            <!-- Pagination -->
         </section>

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
    /* margin-bottom: 45px; */
    display: table;
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
    padding: 0 2rem;
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

</style>