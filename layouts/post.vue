<template>
    <div>
        <!-- <div> -->
        <!-- <img src="/assets/images/abba_hero.jpg" alt="image" class="bg__image">
        <div class="bg__blur"></div> -->

      <header class="post-banner">
        <div class="bg__blur"></div>
        <nav class="breadcrumb" v-show="title">
          <NuxtLink to="/" class="nav__link">Home</NuxtLink>
          <span class="separator">/</span>
          <span class="current">{{ title }}</span>
        </nav>
      </header>
        <!-- </div> -->
      <main>
        <slot />
      </main>
    </div>
  </template>

  <script setup>
  const props = defineProps({
    title: {
      type: String,
      default: ''
    }
  })
  </script>
  
  <style scoped>
  .posts_banner {
    /* position: relative;
    background-color: var(--over-lay-color);
    border-bottom: 2px solid var(--border-color);
    height: 4rem; */
    position: fixed;
    top: 0;
    width: 100%;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background-clip: padding-box;
    padding: 1rem 2rem;
    z-index: var(--z-fixed);


  }

  /* .bg__image  {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: -1;
  } */


  .post-header {
    position: fixed;
    top: 0;
    width: 100%;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background-clip: padding-box;
    padding: 1rem 2rem;
    z-index: var(--z-fixed);
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--first-color-lighten);
    height: 4rem;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background-clip: padding-box;
    padding: 1rem 2rem;
    z-index: var(--z-fixed);

  }

  .nav__link {
    color: var(--first-color-lighten);
    text-decoration: none;
    transition: color 0.3s;
  }

  .nav__link:hover {
    color: var(--first-color);
  }

  .separator {
    color: var(--first-color-lighten);
    opacity: 0.7;
  }

  .current {
    color: var(--first-color-lighten);
    opacity: 0.7;
  }
  </style>
  