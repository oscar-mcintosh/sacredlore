<template>
        <div>
            <!-- <Header-3 /> -->
        </div>

    <div>
        <!-- <Sidebar /> -->

        <!-- <img src="/assets/images/abba_hero.jpg" alt="image" class="bg__image">
      <div class="bg__blur"></div> -->

        <div>
            <!-- <Header /> -->
        </div>
        <div class="main-content">
            <slot />
        </div>
    </div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
      integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
      crossorigin: 'anonymous'
    }
  ],
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
      integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz',
      crossorigin: 'anonymous'
    }
  ]
})
</script>

<style lang="css" scoped>
/* .main-content{
    width: 90%;
    margin-left: 10%;
} */

</style>