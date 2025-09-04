<template>
    <form class="account-settings-form" @submit.prevent="submitProfileUpdate">
      <!-- FORM ROW -->
      <div class="form-row">
        <InputField
          label="First Name"
          placeholder="Enter your first name here..."
          v-model="form.names"
          class="form-item half blue"
        />
        <InputField
          label="Last Name"
          placeholder="Enter your last name here..."
          v-model="form.surnames"
          class="form-item half blue"
        />
      </div>
  
      <!-- FORM ROW -->
      <div class="form-row">
        <InputField
          label="Email"
          placeholder="Enter your email here..."
          v-model="form.email"
          class="form-item blue"
          disabled
        />
        <p class="form-item-message">This is never shown to the public</p>
      </div>
  
      <!-- FORM ROW -->
      <div class="form-row">
        <InputField
          label="Enter Current Password"
          placeholder=""
          type="password"
          v-model="form.currentPassword"
          class="form-item blue"
        />
      </div>
  
      <!-- FORM ROW -->
      <div class="form-row">
        <InputField
          label="Enter New Password"
          placeholder=""
          type="password"
          v-model="form.newPassword"
          class="form-item half blue"
        />
        <InputField
          label="Confirm New Password"
          placeholder=""
          type="password"
          v-model="form.passwordConfirm"
          class="form-item half blue"
        />
      </div>
  
      <!-- FORM ROW -->
      <div class="form-row">
        <div class="form-item">
          <label class="rl-label">Profile Photo</label>
          <div class="avatar-change">
            <img :src="form.avatarPreview || form.avatar" class="user-avatar big" alt="user-avatar" />
            <input type="file" accept="image/*" @change="onFileChange" hidden ref="fileInput" />
            <div class="avatar-change-action bubble-ornament blue" @click="triggerFileInput">
                <i class="ri-add-line plus-cc-2-icon medium"></i>
            </div>
          </div>
          <p class="form-item-message">100x100px minimum resolution</p>
        </div>
      </div>
  
      <!-- SUBMIT BUTTON -->
      <div class="submit-button-wrap">
        <button type="submit" class="button blue">
          Save all changes
          <span class="button-ornament">
            <i class="ri-arrow-right-s-line"></i>
          </span>
        </button>
      </div>

      <!-- Add the modal component -->
      <ConfirmationModal
        :show="showConfirmModal"
        :changes="pendingChanges"
        @confirm="processUpdate"
        @cancel="showConfirmModal = false"
      />
    </form>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  const supabase = useSupabaseClient();
  import ConfirmationModal from './ConfirmationModal.vue';
  import { useRouter } from 'vue-router';
  
  // Get the auth store using Pinia
  const authStore = useAuthStore();
  
  // Reactive form state
  const form = ref({
    names: authStore.userMeta?.names || '',
    surnames: authStore.userMeta?.surnames || '',
    email: authStore.userMeta?.email || '',
    avatar: authStore.userMeta?.avatar_url || '',
    avatarPreview: null,
    avatarFile: null,
    currentPassword: '',
    newPassword: '',
    passwordConfirm: ''
  });
  
  // Trigger file input for avatar upload
  const fileInput = ref(null);
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  
  // Handle file change for avatar
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Add file size check
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File is too large. Please choose an image under 5MB.');
        return;
      }
      
      // Add file type check
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      form.value.avatarPreview = URL.createObjectURL(file);
      form.value.avatarFile = file;
      console.log('File selected:', file.name, file.type, file.size);
    }
  };
  
  // Add this function
  const checkProfileData = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authStore.user.id)
      .single();
      
    console.log('Current profile data:', data);
    console.log('Current user ID:', authStore.user.id);
    if (error) console.error('Error fetching profile:', error);
  };
  
  // Add this helper function at the top of your script
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  // Update this function to handle Supabase storage upload
  const uploadToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      // Structure the path to match the policy requirements: avatars/userId/filename
      const filePath = `${authStore.user.id}/${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Storage error details:', error);
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  
  // Add password validation function
  const validatePasswords = () => {
    if (!form.value.currentPassword && !form.value.newPassword && !form.value.passwordConfirm) {
      return true; // No password change requested
    }
    
    if (!form.value.currentPassword || !form.value.newPassword || !form.value.passwordConfirm) {
      alert('Please fill in all password fields to change your password');
      return false;
    }

    if (form.value.newPassword !== form.value.passwordConfirm) {
      alert('New passwords do not match');
      return false;
    }

    if (form.value.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return false;
    }

    return true;
  };
  
  // Add to your existing script setup
  const showConfirmModal = ref(false);
  const pendingChanges = ref(null);

  // Add this function to detect changes
  const getChangedFields = () => {
    const changes = {
      profile: {},
      password: false
    };

    // Check profile changes
    if (form.value.names !== authStore.userMeta?.names) {
      changes.profile.names = form.value.names;
    }
    if (form.value.surnames !== authStore.userMeta?.surnames) {
      changes.profile.surnames = form.value.surnames;
    }
    if (form.value.avatarFile) {
      changes.profile.avatar = true;
    }

    // Check password change
    if (form.value.currentPassword && form.value.newPassword) {
      changes.password = true;
    }

    return Object.keys(changes.profile).length || changes.password ? changes : null;
  };
  
  // Update the submitProfileUpdate function
  const submitProfileUpdate = async () => {
    try {
      // Validate passwords if attempting to change
      if (!validatePasswords()) {
        return;
      }

      // Get changes and show confirmation modal
      const changes = getChangedFields();
      if (!changes) {
        alert('No changes to save');
        return;
      }

      pendingChanges.value = changes;
      showConfirmModal.value = true;
    } catch (error) {
      console.error('Error preparing update:', error);
      alert('Error preparing update. Please try again.');
    }
  };
  
  // Add router instance in setup
  const router = useRouter();

  // Update the processUpdate function
  const processUpdate = async () => {
    try {
      // Handle password change first if requested
      if (form.value.currentPassword && form.value.newPassword) {
        showConfirmModal.value = false; // Close modal first
        await nextTick();

        const result = await authStore.confirmPasswordChange(
          form.value.currentPassword,
          form.value.newPassword
        );
        
        if (!result) {
          throw new Error('Failed to update password');
        }

        // Clear password fields
        form.value.currentPassword = '';
        form.value.newPassword = '';
        form.value.passwordConfirm = '';

        alert('Password updated successfully!');
        
        // Force a complete page reload to refresh the session
        window.location.replace(window.location.href);
        return;
      }

      // Handle other profile updates
      let avatarUrl = null;
      if (form.value.avatarFile) {
        avatarUrl = await authStore.uploadAvatarToStorage(form.value.avatarFile);
        if (!avatarUrl) {
          throw new Error('Failed to upload avatar');
        }
      }

      const userEmail = authStore.user?.email;
      if (!userEmail) {
        throw new Error('No user email found');
      }

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();

      const profileData = {
        email: userEmail,
        names: form.value.names,
        surnames: form.value.surnames,
        ...(avatarUrl && { avatar_url: avatarUrl })
      };

      let result;
      if (!existingProfile) {
        result = await supabase
          .from('profiles')
          .insert([profileData])
          .select()
          .single();
      } else {
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('email', userEmail)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Update local form state
      if (avatarUrl) {
        form.value.avatar = avatarUrl;
      }

      // Close modal and show success
      showConfirmModal.value = false;
      await nextTick();
      alert('Profile updated successfully!');

    } catch (error) {
      showConfirmModal.value = false;
      await nextTick();
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}\nPlease check the console for more details.`);
    }
  };
  </script>
    
  <style scoped>
   .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
   .form-item {
    flex: 1;
    margin-bottom: 1rem;
  }

  .form-item .form-item-message {
    margin-top: 14px;
    padding-left: 20px;
    color: #bfbfbf;
    font-size: .75em;
    line-height: 1em;
}

  .avatar-change {
    width: 100px;
    height: 100px;
    margin-top: 26px;
    position: relative;
}

.form-row {
    margin-top: 22px;
}

.user-avatar.big {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.avatar-change .avatar-change-action {
    position: absolute;
    top: -6px;
    right: -6px;
}

img {
    overflow-clip-margin: content-box;
    overflow: clip;
}

.bubble-ornament {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: var(--header-color);
    text-align: center;
    cursor: pointer;
    position: relative;
}
.bubble-ornament .plus-cc-2-icon {
    color: var(--first-color-lighten);
    position: relative;
    top: 7px;
}

/* .bubble-ornament:after {
    content: '';
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 12px solid transparent;
    position: absolute;
    bottom: -2px;
    left: -2px;
    background-color: var(--header-color);
    transform: rotate(45deg);
} */

input[type="text"], input[type="password"], input[type="email"], select {
    height: 46px;
    padding: 3px 20px;
    border-radius: 200px;
}

input[type="password"], input[type="email"], textarea, select {
    width: 100%;
    border: 1px solid #dbdbdb;
    background-color: #fff;
    color: #363636;
    font-family: "Roboto", sans-serif;
    font-size: .8125em;
    transition: border-color .2s ease-in-out;
}

label {
    display: block;
    color: #363636;
    font-family: "Exo", sans-serif;
    font-size: .6875em;
    text-transform: uppercase;
}
  </style>
  
