<template>
  <div class="login container grid" id="loginAccessRegister">
    <div class="login__area">
      <form @submit.prevent="loginUser" class="login__form">
        <div class="login__content grid">
          <InputField v-model="email" id="email" label="Email" type="email" />
          <InputField v-model="password" id="password" label="Password" type="password" />
        </div>

        <a href="#" class="login__forgot">Forgot your password?</a>

        <button type="submit" class="login__button">Login</button>
      </form>

      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>

      <div class="login__social">
        <p class="login__social-title">Or login with</p>
        <div class="login__social-links">
          <a href="#" class="login__social-link">
            <img src="" alt="Google" class="login__social-img" />
          </a>
          <a href="#" class="login__social-link">
            <img src="" alt="Facebook" class="login__social-img" />
          </a>
          <a href="#" class="login__social-link">
            <img src="" alt="Apple" class="login__social-img" />
          </a>
        </div>
      </div>

      <p class="login__switch">
        Don't have an account?
        <button id="loginButtonRegister">Create Account</button>
      </p>

      <div class="login__access">
        <h1 class="login__title">Log in to your account.</h1>
        <div>
          <p v-if="authStore.user">Welcome, {{ authStore.user.email }}</p>
          <p v-else>Please log in</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter, useRoute } from 'vue-router';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Initialize authentication state when component mounts
authStore.initializeAuth();

watchEffect(() => {
  if (authStore.user) {
    console.log('User is logged in:', authStore.user);
  }
});

// Login function
const loginUser = async () => {
  const user = await authStore.logIn({
    email: email.value,
    password: password.value,
  });

  if (user) {
    // Get the redirect path from query parameters, default to home if none exists
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } else {
    console.error('Login failed:', authStore.error);
  }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
