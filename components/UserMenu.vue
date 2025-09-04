<script setup>
const { $toast } = useNuxtApp()

const handleLogout = async () => {
  const username = user.value?.name // or however you store the user name
  await logout() // your existing logout logic
  $toast.success(`${username} has signed out successfully`)
}
</script> 