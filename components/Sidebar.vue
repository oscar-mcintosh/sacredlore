<template>
        <!--==================== NAV ====================-->
        <nav class="nav" id="nav">
         <div class="nav__menu">
            <a href="#" class="nav__logo">PELIXS</a>

            <ul class="nav__list">
               <li class="nav__item">
                  <NuxtLink to="/" class="nav__link" @click="() => console.log('Home clicked')">
                     <i class="ri-home-5-line"></i> <span>Home</span>
                  </NuxtLink>
               </li>
               <li class="nav__item">
                  <NuxtLink to="/about" class="nav__link">
                     <i class="ri-home-5-line"></i> <span>About</span>
                  </NuxtLink>
               </li>
          </ul>
          <div>
          <h3 class="nav__title">Testaments</h3>
          <ul class="nav__list">
               <li class="nav__item">
                  <NuxtLink to="/testament/oldtestament" class="nav__link">
                     <i class="ri-map-line"></i> <span>Old</span>
                  </NuxtLink>
               </li>

               <li class="nav__item">
                  <NuxtLink to="/testament/newtestament" class="nav__link">
                     <i class="ri-map-line"></i> <span>New</span>
                  </NuxtLink>
               </li>

            </ul>
          </div>
            <!-- Only show user section if logged in -->
            <div class="user__section" v-if="isLoggedIn">
               <h3 class="nav__title">Account</h3>
               
               <ul class="nav__list">
                  <li class="nav__item">
                     <a href="/admin" class="nav__link" @click="handleAdminClick">
                        <i class="ri-account-circle-line"></i> <span>Account</span>
                     </a>
                  </li>
   
                  <li class="nav__item">
                     <NuxtLink to="/admin" class="nav__link" @click="scrollToSettings">
                      <i class="ri-settings-2-line"></i> <span>Profile</span>
                     </NuxtLink>
                  </li>
                  <li class="nav__item">
                     <NuxtLink v-if="isLoggedIn" to="/" class="nav__link" @click.prevent="logoutUser">
                        <i class="ri-logout-box-line"></i> <span>Log Out</span>
                     </NuxtLink>
                  </li>
               </ul>
            </div>
         </div>


         <div class="nav__close" id="nav-close">
            <i class="ri-close-line"></i>
         </div>
         

      </nav>

  </template>
<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const authors = ref([]);

const isLoggedIn = computed(() => {
  console.log('Auth store user:', authStore.user);
  console.log('Auth store isAuthenticated:', authStore.isAuthenticated);
  return !!authStore.user || authStore.isAuthenticated;
});

const logoutUser = async () => {
  await authStore.logOut();
  navigateTo('/');
};

const scrollToSettings = () => {
  // Wait for navigation to complete, then scroll to settings
  nextTick(() => {
    const settingsSection = document.getElementById('settings-section');
    if (settingsSection) {
      settingsSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

const handleAdminClick = async () => {
  console.log('Admin link clicked');
  console.log('Current auth state:', { user: authStore.user, isAuthenticated: authStore.isAuthenticated });
  
  // Test navigation
  try {
    await navigateTo('/admin');
    console.log('Navigation successful');
  } catch (error) {
    console.error('Navigation failed:', error);
  }
};



// Fetch authors from profiles table
const fetchAuthors = async () => {
  try {
    const data = await authStore.getAuthors();
    authors.value = data;
  } catch (error) {
    console.error('Error fetching authors:', error);
  }
};

onMounted(() => {
  fetchAuthors();
  
  // Debug auth state
  console.log('Sidebar mounted');
  console.log('Auth store state:', {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    loading: authStore.loading
  });
});
</script>

<style lang="css" scoped>
/* Sidebar */
.sidebar{
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px); 
    background-clip: padding-box; 
    background: var(--dark-body-color);
    box-shadow: 2px 0 15px rgba(255, 255, 255, 0.9),
                inset -1px 0 5px rgba(255, 255, 255, 0.05);
    width: 10%;
    height: 100vh;
    position: fixed;
    top: 0;
    padding-left: 2%;
    padding-top: 80px;
}

.shortcut-links a, .subscribed-list a
{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: fit-content;
    flex-wrap: wrap;
    color: var(--text-color);
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(6, 84, 86, 0.1);
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(6, 84, 86, 0.1);
    padding: 5px 14px 5px 14px;
    border-radius: 200px;
    transition: color 0.3s ease;
}

.shortcut-links a:hover, .subscribed-list a:hover
{
    color: var(--second-color);
}

/* .shortcut-links a:first-child
{
    color: var(--header-color);
} */


.shortcut-links a i
{
    width: 20px;
    margin-right: 20px;
}

.sidebar .shortcut-links hr
{
    border: 0;
    height: 1px;
    background: var(--header-color);
    width: 85%;
}

.subscribed-list 
{
    padding: 2rem 0;
}


.subscribed-list h3
{
    font-size: 13px;
    margin: 20px 13px;
    color: #5a5a5a;
}


.subscribed-list a img
{
    width: 25px;
    border-radius: 50%;
    margin-right: 20px;
}

.small-sidebar
{
    width: 5%;
}

.small-sidebar h3
{
    display: none;
}

.small-sidebar a p
{
    display: none;
}

.small-sidebar hr
{
    width: 50%;
    margin-bottom: 25px;
}

.active {
    color: var(--second-color);
    font-weight: bold;
    font-size: 1rem;  
    background: hsl(16, 63%, 30%);
}

/* Add these new rules */
.nav__menu {
   display: flex;
   flex-direction: column;
   gap: 1.5rem;
}

.nav__list {
   display: flex;
   flex-direction: column;
   gap: 1rem;
}

.nav__title {
   margin: 0.8rem 0;
   color: var(--text-color);
}

/* Update existing nav__link rule or add if it doesn't exist */
.nav__link {
   display: flex;
   align-items: center;
   gap: 0.75rem;
   padding: 0.55rem;
   border-radius: 0.5rem;
   transition: all 0.3s ease;
}

.nav__link i {
   font-size: 1.25rem;
}
</style>