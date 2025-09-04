<template>
  <div class="side-newsletter text-center">
    <p>Get the best viral stories straight into your inbox!</p>
    <form @submit.prevent="handleSubscribe" id="invite">
      <input 
        v-model="email" 
        placeholder="Your email address" 
        class="e-mail" 
        name="email" 
        id="address" 
        type="email"
        required
      >
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Subscribing...' : 'Sign up' }}
      </button>
      <span>Don't worry we don't spam</span>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const isLoading = ref(false)
const error = ref(null)

const handleSubscribe = async () => {
  try {
    isLoading.value = true
    error.value = null

    console.log('Attempting to subscribe with email:', email.value)
    
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value })
    })

    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)

    if (!data.success) {
      console.error('Subscription failed:', data.message)
      throw new Error(data.message)
    }

    // Clear form and show success message
    email.value = ''
    console.log('Subscription successful:', data.message)
    alert(data.message)
  } catch (err) {
    error.value = err.message
    console.error('Error during subscription:', err)
    alert(err.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.side-newsletter {
  background: var(--body-color);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.side-newsletter p {
  font-size: 15px;
  color: #707070;
  margin: 0 0 15px;
}

.side-newsletter input {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  height: 36px;
  background: #ffffff;
  padding: 0 20px;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

.side-newsletter button {
  border: 1px solid var(--title-color);
  border-radius: 5px;
  height: 36px;
  background: var(--title-color);
  padding: 0 20px;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  color: var(--first-color-lighten);
  font-size: 11px;
  letter-spacing: 0.06em;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
}

.side-newsletter button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.side-newsletter span {
  color: #787878;
  font-size: 12px;
  letter-spacing: 0.03em;
  margin: -7px 0 -3px;
  display: table;
  width: 100%;
}
</style> 