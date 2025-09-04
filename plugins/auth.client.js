import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  
  // Initialize auth on app start
  await auth.initializeAuth();
}); 