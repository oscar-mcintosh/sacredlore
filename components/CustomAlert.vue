<template>
  <Transition name="fade">
    <div v-if="show" class="alert-overlay">
      <div class="alert-box">
        <div class="alert-content">
          <p>{{ message }}</p>
          <div class="alert-buttons">
            <button 
              v-if="isConfirm" 
              class="alert-button cancel-button" 
              @click="$emit('close', false)"
            >
              Cancel
            </button>
            <button 
              class="alert-button" 
              @click="$emit('close', isConfirm ? true : undefined)"
            >
              {{ isConfirm ? 'Confirm' : 'OK' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String,
  isConfirm: Boolean
});

defineEmits(['close']);
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.alert-box {
  background: var(--shadow-bg);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90%;
  width: 400px;
  text-align: center;
}

.alert-content p {
  margin-bottom: 1.5rem;
  color: var(--body-color);
  font-size: var(--normal-font-size);
}

.alert-button {
  background-color: var(--first-color);
  color: var(--white-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 200px;
  cursor: pointer;
  font-size: var(--normal-font-size);
  transition: background-color 0.3s;
}

.alert-button:hover {
  background-color: var(--first-color-alt);
}

.alert-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cancel-button {
  background-color: var(--header-color);
}

.cancel-button:hover {
  background-color: var(--title-color);
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 