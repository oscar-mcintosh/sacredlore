<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const { $toast } = useNuxtApp()

// Create a composable to handle logout notifications
const showLogoutMessage = (username) => {
  $toast.success(`${username} has signed out successfully`)
}

// Make it available globally
provide('showLogoutMessage', showLogoutMessage)
</script>

<!-- <script>
export default defineNuxtConfig({
  router: {
    middleware: ['auth']
  }
}) 
</script>  -->