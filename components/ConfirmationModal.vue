<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h3>Changes Summary</h3>
      
      <div class="changes-list">
        <div v-if="changes.profile" class="change-section">
          <h4>Profile Changes:</h4>
          <ul>
            <li v-if="changes.profile.names">Name: {{ changes.profile.names }}</li>
            <li v-if="changes.profile.surnames">Surname: {{ changes.profile.surnames }}</li>
            <li v-if="changes.profile.avatar">New profile photo will be uploaded</li>
          </ul>
        </div>

        <div v-if="changes.password" class="change-section">
          <h4>Security:</h4>
          <ul>
            <li>Password will be updated</li>
          </ul>
        </div>
      </div>

      <div class="modal-actions">
        <button class="button blue" @click="$emit('confirm')">
          Confirm Changes
        </button>
        <button class="button outline" @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  changes: Object
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.modal-overlay {
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
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--header-color);
}

h4 {
  margin-bottom: 0.5rem;
  color: var(--header-color);
}

.changes-list {
  margin-bottom: 1.5rem;
}

.change-section {
  margin-bottom: 1rem;
}

.change-section ul {
  list-style: none;
  padding-left: 0;
  margin: 0.5rem 0;
}

.change-section li {
  padding: 0.25rem 0;
  color: #363636;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.button.outline {
  background: transparent;
  border: 1px solid var(--header-color);
  color: var(--header-color);
}
</style> 