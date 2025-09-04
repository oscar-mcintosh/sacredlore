<template>
  <header class="header">
    <nav class="nav">
      <div class="nav__data">
        <NuxtLink to="/" class="nav__logo">
          <i class="ri-book-open-line"></i> Biblio
        </NuxtLink>

        <div class="nav__toggle" id="nav-toggle" @click="toggleMenu">
          <i class="ri-menu-line nav__burger"></i>
          <i class="ri-close-line nav__close"></i>
        </div>
      </div>

      <div class="nav__menu" :class="{ 'show-menu': showMenu }" id="nav-menu">
        <ul class="nav__list">
          <li class="nav__item">
            <NuxtLink to="/" class="nav__link">Home</NuxtLink>
          </li>
          <li class="nav__item">
            <NuxtLink to="/sndbx" class="nav__link">Sandbox</NuxtLink>
          </li>
          <li v-if="user" class="nav__item">
            <NuxtLink to="/admin" class="nav__link">Admin</NuxtLink>
          </li>
        </ul>

        <!-- Login/Logout buttons -->
        <div class="nav__buttons">
          <template v-if="user">
            <button class="nav__button" @click="handleLogout">
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="nav__button">Login</NuxtLink>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const showMenu = ref(false);
const user = useSupabaseUser();
const authStore = useAuthStore();

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const handleLogout = async () => {
  await authStore.logOut();
  navigateTo('/login');
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--header-color);
  box-shadow: 0 2px 16px hsla(220, 32%, 8%, .3);
  z-index: var(--z-fixed);
}

.nav {
  height: var(--header-height);
}

.nav__data {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav__logo {
  display: inline-flex;
  align-items: center;
  column-gap: .25rem;
  color: var(--first-color-lighten);
  font-weight: var(--font-semi-bold);
  transition: color .3s;
}

.nav__logo i {
  font-size: 1.25rem;
}

.nav__logo:hover {
  color: var(--first-color);
}

.nav__toggle {
  position: relative;
  width: 32px;
  height: 32px;
}

.nav__burger,
.nav__close {
  position: absolute;
  width: max-content;
  height: max-content;
  inset: 0;
  margin: auto;
  font-size: 1.25rem;
  cursor: pointer;
  transition: opacity .1s, transform .4s;
}

.nav__close {
  opacity: 0;
}

/* Navigation for mobile devices */
.nav__menu {
  position: absolute;
  left: 0;
  top: 2.5rem;
  width: 100%;
  height: calc(100vh - 3.5rem);
  overflow: auto;
  pointer-events: none;
  opacity: 0;
  transition: top .4s, opacity .3s;
}

.nav__menu::-webkit-scrollbar {
  width: 0;
}

.nav__list {
  background-color: var(--header-color);
  padding-top: 1rem;
}

.nav__link {
  color: var(--first-color-lighten);
  font-weight: var(--font-semi-bold);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color .3s;
}

.nav__link:hover {
  background-color: var(--first-color);
}

/* Show menu */
.show-menu {
  opacity: 1;
  pointer-events: initial;
  top: 3.5rem;
}

/* Show icon */
.show-icon .nav__burger {
  opacity: 0;
  transform: rotate(90deg);
}

.show-icon .nav__close {
  opacity: 1;
  transform: rotate(90deg);
}

.nav__buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}

.nav__button {
  background-color: var(--first-color);
  color: var(--first-color-lighten);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
}

.nav__button:hover {
  background-color: var(--first-color-dark);
}

/* For large devices */
@media screen and (min-width: 1118px) {
  .nav {
    height: calc(var(--header-height) + 2rem);
    display: flex;
    justify-content: space-between;
  }
  .nav__toggle {
    display: none;
  }
  .nav__list {
    display: flex;
    flex-direction: row;
    padding: 0;
    background-color: transparent;
  }
  .nav__menu {
    width: initial;
    height: initial;
    display: flex;
    align-items: center;
    gap: 2rem;
    pointer-events: initial;
    opacity: 1;
    position: static;
    overflow: initial;
  }
  .nav__link {
    padding: 0;
    background-color: transparent;
  }
  .nav__link:hover {
    background-color: transparent;
    color: var(--first-color);
  }
  .nav__buttons {
    padding: 0;
  }
}
</style> 