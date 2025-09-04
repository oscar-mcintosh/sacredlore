<template>
         <header class="header" id="header">
         <div class="header__content">
            <a href="#" class="header__logo">PELIXS</a>

   
            <div class="header__actions">
                <template v-if="isLoggedIn">
                    <div class="user-profile">
                        <img 
                            :src="authStore.userMeta?.avatar_url || '/default-avatar.png'" 
                            alt="User avatar"
                            class="avatar"
                            @click="toggleProfileMenu"
                        />
                        <div class="profile-info">
                            <p>{{ getGreeting() }}, <span class="title-color">{{ authStore.userMeta?.names }}</span></p>
                            <div class="profile-actions">
                                <!-- <label class="avatar-upload">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        @change="handleAvatarUpload" 
                                        class="hidden"
                                    >
                                    <span>Change Avatar</span>
                                </label> -->
                                <!-- <NuxtLink to="/" class="nav__link" @click.prevent="logoutUser">
                                    <i class="ri-logout-box-line"></i>Logout
                                </NuxtLink> -->
                            </div>
                        </div>
                    </div>
                </template>
                
                <template v-else>
                    <div class="nav__item">
                        <NuxtLink to="/login" class="nav__link">
                            <i class="ri-notification-2-line"></i>Login
                        </NuxtLink>
                    </div>
                    <div class="nav__item">
                        <NuxtLink to="/register" class="nav__link">
                            <i class="ri-account-circle-line"></i>Register
                        </NuxtLink>
                    </div>
                </template>
                
                <div class="header__menu" id="header-menu">
                    <i class="ri-menu-line"></i> 
                </div>
            </div>
         </div>

         <form action="" class="header__search">
            <i class="ri-search-line"></i> 
            <input type="search" placeholder="Search movies" class="header__input">
         </form>
      </header>

</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const authStore = useAuthStore();
const showProfileMenu = ref(false);

const isLoggedIn = computed(() => !!authStore.user);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};


const logoutUser = async () => {
  await authStore.logOut();
  // Optionally, redirect to the login page or homepage after logging out
  // e.g., use Nuxt's $router to redirect
  navigateTo('/');
};

const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        // Upload directly to Supabase storage
        const avatarUrl = await authStore.uploadAvatarToStorage(file);
        if (avatarUrl) {
            // Update the profile with new avatar URL
            await authStore.updateProfile({
                avatarFile: file
            });
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
    }
};
</script>

<style lang="css" scoped>
header {
background: var(--dark-body-color);
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.nav-bar
{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
}

nav
{
    padding: 10px 2%;
    justify-content: space-between;
    box-shadow: 0 0 10px rgba(0,0,0,.2);
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
}

.nav-right img
{
    width: 25px;
    margin-right: 25px;
}

.nav-right .user-icon{
    width: 35px;
    border-radius: 50%;
    margin-right: 0;
}

.nav-left .menu-icon
{
    width: 22px;
    margin-right: 25px;
}

.nav-left .logo{
    width: 130px;
}

.nav-middle .mic-icon
{
    width: 16px;
}

.nav-middle .search-box
{
    border: 1px solid #ccc;
    margin-right: 15px;
    padding: 8px 12px;
    border-radius: 25px;
}

.nav-middle .search-box input
{
    width: 400px;
    border: 0;
    outline: 0;
    background: transparent;
}

.nav-middle .search-box img
{
    width: 15px;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.profile-info p{
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0;
}

.profile-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.avatar-upload {
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #f0f0f0;
    font-size: 0.875rem;
}

.avatar-upload:hover {
    background-color: #e0e0e0;
}

.hidden {
    display: none;
}

.title-color{
    color: var(--title-color);
}
</style>