<template>
  <div class="layout-content-full grid-limit">
    <div class="grid2-1col centered">
      <div class="login__register">
        <h1 class="login__title">Create new account.</h1>
        <div class="login__area">
          <form @submit.prevent="registerUser" class="login__form">
            <div class="login__content grid">
              <div class="login__group grid">
                <InputField
                  v-model="names"
                  label="First Name"
                  icon="ri-id-card-fill"
                  :error="errors.names"
                />
                <InputField
                  v-model="surnames"
                  label="Last Name"
                  icon="ri-id-card-fill"
                  :error="errors.surnames"
                />
              </div>

              <InputField
                v-model="email"
                label="Email"
                type="email"
                icon="ri-mail-fill"
                :error="errors.email"
              />
              
              <InputField
                v-model="password"
                label="Password"
                type="password"
                icon="ri-eye-off-fill"
                :error="errors.password"
              />
              
              <InputField
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                icon="ri-eye-off-fill"
                :error="errors.confirmPassword"
              />
              
              <!-- File Input for Profile Picture -->
              <div class="form-group">
                <label for="avatar-upload" class="file-upload-label">Upload Profile Picture (Optional)</label>
                <input 
                  type="file" 
                  id="avatar-upload"
                  class="login__file-input" 
                  accept="image/*"
                  @change="handleFileUpload"
                />
              </div>
            </div>
            
            <button type="submit" class="button">Create account</button>
          </form>

          <p class="login__switch">
            Already have an account?
            <button id="loginButtonAccess">Log In</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.file-upload-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: var(--small-font-size);
  color: var(--background-color);
}

.login__file-input {
  position: relative;
  font-family: inherit;
  /* width: 100%; */
  padding: 0.75rem 1rem;
  background-color: var(--second-color);
  border: none;
  border-radius: 200px;
  color: var(--background-color);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login__file-input::-webkit-file-upload-button {
  visibility: hidden;
  width: 0;
}

.login__file-input::before {
  content: 'Choose Profile Picture';
  display: inline-block;
  color: var(--first-color-lighten);
  outline: none;
  cursor: pointer;
}

.login__file-input:hover {
  background-color: var(--second-color-alt);
}

.login__file-input:active {
  background-color: var(--second-color-alt);
}
</style>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

// Form data
const names = ref('');
const surnames = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const avatarFile = ref(null); // File object for profile picture

// Validation errors
const errors = ref({});

// Handle file change
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.size <= 5 * 1024 * 1024) { // Limit file size to 5MB
    avatarFile.value = file;
  } else {
    errors.value.profilePicture = 'File must be an image and less than 5MB.';
  }
};

// Registration function
const registerUser = async () => {
  errors.value = {};

  // Enhanced validation
  if (!names.value.trim()) errors.value.names = 'Names are required.';
  if (!surnames.value.trim()) errors.value.surnames = 'Surnames are required.';
  if (!email.value.trim()) errors.value.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.value.email = 'Invalid email format.';
  
  // Enhanced password validation
  if (!password.value.trim()) {
    errors.value.password = 'Password is required.';
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters long.';
  }

  if (!confirmPassword.value.trim()) {
    errors.value.confirmPassword = 'Please confirm your password.';
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Passwords do not match.';
  }

  // Validate avatar file if one was selected
  if (avatarFile.value) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(avatarFile.value.type)) {
      errors.value.profilePicture = 'Please upload a valid image file (JPEG, PNG, or GIF).';
    }
    if (avatarFile.value.size > 5 * 1024 * 1024) {
      errors.value.profilePicture = 'File size must be less than 5MB.';
    }
  }

  // Stop if there are errors
  if (Object.keys(errors.value).length > 0) {
    return;
  }

  try {
    // Prepare registration data
    const registrationData = {
      email: email.value.trim(),
      password: password.value,
      names: names.value.trim(),
      surnames: surnames.value.trim(),
      avatarFile: avatarFile.value
    };

    // Attempt registration
    const user = await authStore.signUp(registrationData);

    // Check explicitly for successful registration
    if (!user) {
      throw new Error(authStore.error || 'Registration failed');
    }

    // Success path
    alert('Account created successfully! Please check your email for verification.');
    
    // Reset form fields
    names.value = '';
    surnames.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    avatarFile.value = null;
    
    router.push('/login');

  } catch (error) {
    console.error('Registration error:', error);
    
    // More specific error handling
    if (error.response?.status === 500) {
      alert('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      alert(`Registration failed: ${error.response.data.message}`);
    } else {
      alert(error.message || 'An unexpected error occurred during registration.');
    }
  }
};
</script>
