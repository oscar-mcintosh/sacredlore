import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const names = ref('');
const surnames = ref('');

const handleSignUp = async () => {
  try {
    const result = await authStore.signUp({
      email,
      password,
      names,
      surnames
    });

    if (!result) {
      throw new Error('Registration failed');
    }

    if (result.message) {
      // Email confirmation required case
      alert(result.message);
      return navigateTo('/auth/confirm-email');
    }

    if (result.user) {
      // Immediate login case (if email confirmation is disabled)
      return navigateTo('/dashboard');
    }
  } catch (err) {
    // Handle any errors that occurred during signup
    console.error('Signup error:', err);
    alert(err.message || 'An error occurred during registration');
  }
};

<template>
  <form @submit.prevent="handleSignUp">
    <input v-model="email" type="email" required />
    <input v-model="password" type="password" required />
    <input v-model="names" type="text" required />
    <input v-model="surnames" type="text" required />
    <button type="submit">Sign Up</button>
  </form>
</template> 