<template>
    <!--==================== HEADER ====================-->
      <header class="header">
         <nav class="nav container">
            <a href="#" class="nav__logo">Logo</a>

            <div class="nav__menu" id="nav-menu">
               <ul class="nav__list">
                  <li>
                     <NuxtLink to="/" class="nav__link">Home</NuxtLink>
                  </li>

                  <li>
                     <a href="#" class="nav__link">About Us</a>
                  </li>

                  <li>
                     <a href="#" class="nav__link">Services</a>
                  </li>
                  <li v-if="!isLoggedIn">
                    <NuxtLink to="/login" class="nav__link">Login</NuxtLink>
                </li>

                <li v-if="!isLoggedIn">
                    <NuxtLink to="/register" class="nav__link button tiny">Register</NuxtLink>
                </li>

                  <li>
                     <a href="#" class="nav__link">Products</a>
                  </li>

                  <li>
                     <a href="#" class="nav__link">Contact</a>
                  </li>
               </ul>

               <!-- Close button -->
               <div class="nav__close" id="nav-close">
                  <i class="ri-close-large-line"></i>
               </div>
            </div>

            <div v-if="isLoggedIn" class="nav__actions">
               <!-- Dropdown -->
               <div class="dropdown" id="dropdown">
                  <div class="dropdown__profile">
                     <div class="dropdown__names">
                        <p v-if="authStore.user">Welcome, {{ authStore.user.email }}</p>
                        <p v-else>Please log in</p>

                        <h3>Mark Sparks</h3>
                        <span>Developer</span>
                     </div>
      
                     <div class="dropdown__image">
                        <img src="" alt="image">
                     </div>
                  </div>
   
                  <div class="dropdown__list">
                     <NuxtLink href="#" class="dropdown__link">
                        <i class="ri-user-line"></i>
                        <span>Profile</span>
                     </NuxtLink>
   
                     <NuxtLink href="#" class="dropdown__link">
                        <i class="ri-time-line"></i>
                        <span>Activity</span>
                     </NuxtLink>
   
                     <NuxtLink href="#" class="dropdown__link">
                        <i class="ri-bookmark-line"></i>
                        <span>Saved</span>
                     </NuxtLink>
   
                     <NuxtLink href="#" class="dropdown__link">
                        <i class="ri-settings-3-line"></i>
                        <span>Settings</span>
                     </NuxtLink>

                     <NuxtLink to="/" class="dropdown__link" @click.prevent="logoutUser">
                        <i class="ri-logout-box-r-line"></i>
                        <span>Logout</span>
                     </NuxtLink>
                  </div>
               </div>

               <!-- Toggle button -->
               <div class="nav__toggle" id="nav-toggle">
                  <i class="ri-menu-line"></i>
               </div>
            </div>
         </nav>
      </header>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const isLoggedIn = computed(() => !!authStore.user);

const logoutUser = async () => {
  await authStore.logOut();
  // Optionally, redirect to the login page or homepage after logging out
  // e.g., use Nuxt's $router to redirect
  navigateTo('/');
};
</script>

<style lang="css" scoped>
.register{
    background-color: var(--header-color);
    padding: 5px 15px;
    color: var(--first-color-lighten);
    border-radius: 200px;
}

</style>