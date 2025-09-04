<template>
    <div class="login__box">
      <input
        v-bind="$attrs"
        v-model="internalValue"  
        :type="type"
        :placeholder="placeholder"
        class="login__input"
      />
      <label class="login__label">{{ label }}</label>
      <i v-if="icon" :class="icon" class="login__icon"></i>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, watch } from 'vue';
  
  // Define props
  const props = defineProps({
    modelValue: String,  // v-model binds to this prop
    label: String,
    type: {
      type: String,
      default: 'text',
    },
    placeholder: String,
    icon: String,
    error: String,
  });
  
  // Define emits to handle update:modelValue
  const emit = defineEmits(['update:modelValue']);
  
  // Create internal ref for modelValue to work with v-model binding
  const internalValue = ref(props.modelValue);
  
  // Watch for changes to internalValue and emit to parent component
  watch(internalValue, (newValue) => {
    emit('update:modelValue', newValue);
  });
  
  // Sync internalValue with props.modelValue on prop change
  watch(() => props.modelValue, (newValue) => {
    internalValue.value = newValue;
  });
  </script>
  