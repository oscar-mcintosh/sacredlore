export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  
  // Wait for initial auth check
  if (auth.loading) {
    return;
  }
  
  // Redirect to login if not authenticated
  if (!auth.isAuthenticated) {
    return navigateTo('/login');
  }
}); 