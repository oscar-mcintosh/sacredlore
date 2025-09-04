<template>
  <div>
    <Header-3 />
    <Sidebar />
    
    <main class="main">
      <CustomAlert 
        :show="showAlert"
        :message="alertMessage"
        :isConfirm="isConfirmDialog"
        @close="handleAlertClose"
      />
      
      <!-- Show loading states -->
      <div v-if="loading" class="spinner-container">
        <div class="spinner"></div>
      </div>

      <!-- Show error states -->
      <div v-else-if="hasErrors" class="error-container">
        <div v-if="errors.auth" class="error-message">
          <h3>Authentication Error</h3>
          <p>Please try refreshing the page or logging in again.</p>
          <button @click="retryAuth" class="button">Retry Authentication</button>
        </div>
        <div v-if="errors.posts" class="error-message">
          <h3>Posts Loading Error</h3>
          <p>Failed to load posts. Some features may be limited.</p>
          <button @click="retryPosts" class="button">Retry Loading Posts</button>
        </div>
        <div v-if="errors.books" class="error-message">
          <h3>Books Data Error</h3>
          <p>Failed to load books data. Some features may be limited.</p>
          <button @click="retryBooks" class="button">Retry Loading Books</button>
        </div>
        <div v-if="errors.metadata" class="error-message">
          <h3>User Data Error</h3>
          <p>Failed to load user data. Some features may be limited.</p>
          <button @click="retryMetadata" class="button">Retry Loading User Data</button>
        </div>
      </div>

      <!-- Show partial content when some data loaded but others failed -->
      <div v-else-if="hasPartialData" class="partial-data-container">
        <div class="warning-message">
          <h3>Some data failed to load</h3>
          <p>You can still use the form, but some features may be limited.</p>
          <button @click="retryFailedData" class="button">Retry Failed Data</button>
        </div>
      </div>

      <!-- Only show content when not loading -->
      <div v-else class="container">
        <!-- Show message when no data is available -->
        <div v-if="!hasAnyData && !hasErrors" class="no-data-container">
          <h2>No Data Available</h2>
          <p>It seems like no data has been loaded. This could be due to:</p>
          <ul>
            <li>Authentication issues</li>
            <li>Database connection problems</li>
            <li>Network connectivity issues</li>
          </ul>
          <div class="button-group">
            <button @click="refreshCache" class="button">Refresh Page Data</button>
            <button @click="retryFailedData" class="button">Retry All Data</button>
          </div>
        </div>

        <!-- Show content when data is available -->
        <div v-else>
          <!-- <div class="dropdown__profile">
            <div class="dropdown__names">
              <h2 v-if="authStore.userMeta">
                {{ getGreeting() }}, {{ authStore.userMeta.names }} {{ authStore.userMeta.surnames }}
              </h2>
              <p v-else>Please log in</p>
            </div>      
          </div> -->

          <!-- Show loading indicators for individual sections -->
          <section v-if="loadingStates.posts">
            <div class="spinner-container">
              <div class="spinner"></div>
              <p>Loading posts...</p>
            </div>
          </section>
          <section v-else>
            <p v-if="userPosts.length === 0">No posts found for this user.</p>
            <h3 v-else>Your Posts</h3>
            <div class="user-posts">
              <article
                v-for="post in displayedPosts"
                :key="post.id"
                class="article-home down-content"
              >
                <div class="meta">
                  <div class="meta-category">
                    <span>{{ post.category }}</span>
                    <span v-if="post.status === 'draft'" class="draft-badge">Draft</span>
                  </div>
                  <div class="icons">
                    <i class="ri-pencil-line" @click="editPost(post)"></i>
                    <i class="ri-delete-bin-line" @click="confirmDelete(post.id)"></i>
                  </div>
                </div>
                <div class="vid-list">
                  <NuxtLink v-if="post.id" :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
                  <div class="publisher">
                    <div class="avatar">
                      <img :src="post.profiles?.avatar_url" alt=""/>
                    </div>
                    <div>
                      <p class="author-name">
                        {{ post.profiles?.names }} {{ post.profiles?.surnames }}
                      </p>
                      <div class="flex-div">
                        <span>{{ formatDate(post.created_at) }}</span>
                        <p class="comments-info">
                          <span>{{ post.comments || 0 }}</span> comments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <!-- Show loading indicators for books section -->
          <section v-if="loadingStates.books">
            <div class="spinner-container">
              <div class="spinner"></div>
              <p>Loading books data...</p>
            </div>
          </section>

          <!-- Add Load More Button -->
          <div v-if="hasMorePosts" class="load-more-container">
            <button class="button load-more-button" @click="loadMorePosts">
              Load More Posts <span class="button-ornament"><i class="ri-arrow-down-s-line"></i></span>
              <!-- <span class="button-ornament">
                <i class="ri-arrow-down-s-line"></i>
              </span> -->
            </button>
          </div>
          <section>
            <div class="container">
              <h2>Favorites</h2>
              <div class="user-posts favorites">
                <article
                  v-for="post in favoritePosts"
                  :key="post.id"
                  class="article-home down-content"
                >
                  <div class="meta">
                    <div class="meta-category">
                      <span>{{ post.category }}</span>
                      <span v-if="post.status === 'draft'" class="draft-badge">Draft</span>
                    </div>
                    <div class="icons">
                      <i class="ri-delete-bin-line" @click="removeFromFavorites(post.id)"></i>
                    </div>
                  </div>
                  <div class="vid-list">
                    <NuxtLink v-if="post.id" :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
                    <div class="publisher">
                      <img :src="post.profiles?.avatar_url" alt=""/>
                      <div>
                        <p class="author-name">
                          {{ post.profiles?.names }} {{ post.profiles?.surnames }}
                        </p>
                        <div class="flex-div">
                          <span>{{ formatDate(post.created_at) }}</span>
                          <p class="comments-info">
                            <span>{{ post.comments || 0 }}</span> comments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
          <section>
            <div class="container">
              <h2>Drafts</h2>
              <div class="user-posts draft-posts">
                <article
                v-for="post in draftPosts"
                :key="post.id"
                class="article-home down-content"
              >
                <div class="meta">
                  <div class="meta-category">
                    <span>{{ post.category }}</span>
                    <span class="draft-badge">Draft</span>
                  </div>
                  <div class="icons">
                    <i class="ri-pencil-line" @click="editPost(post)"></i>
                    <i class="ri-delete-bin-line" @click="confirmDelete(post.id)"></i>
                  </div>
                </div>
                <div class="vid-list">
                  <NuxtLink v-if="post.id" :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
                  <div class="publisher">
                    <img :src="post.profiles?.avatar_url" alt=""/>
                    <div>
                      <p class="author-name">
                        {{ post.profiles?.names }} {{ post.profiles?.surnames }}
                      </p>
                      <div class="flex-div">
                        <span>{{ formatDate(post.created_at) }}</span>
                        <p class="comments-info">
                          <span>{{ post.comments || 0 }}</span> comments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            </div>
          </section>

          <!-- Post Form -->
          <section class="post-form-section">
            <div class="post-form">
              <h2>{{ isEditing ? "Edit Post" : "Create A Story" }}</h2>
              <form @submit.prevent="submitForm">
                <!-- Post Details Section -->
                <div class="scripture-reference-section">
                  <h3>Post Details</h3>
                  
                  <!-- Title -->
                  <div class="form-group">
                    <label for="title">Title:</label>
                    <input
                      type="text"
                      id="title"
                      v-model="form.title"
                      required
                      placeholder="Enter post title"
                    />
                  </div>
                  
                  <div class="flex-div">
                    <!-- Testament -->
                    <div class="form-group">
                      <label for="testament">Testament:</label>
                      <select
                        id="testament"
                        v-model="form.testament"
                        @change="filterBooks"
                        required
                      >
                        <option value="" disabled>Select Testament</option>
                        <option
                          v-for="testament in testaments"
                          :key="testament"
                          :value="testament"
                        >
                          {{ testament }}
                        </option>
                      </select>
                    </div>

                    <!-- Book Name -->
                    <div class="form-group">
                      <label for="book_name">Book Name:</label>
                      <select id="book_name" v-model="form.book_name" required>
                        <option value="" disabled>Select Book</option>
                        <option
                          v-for="book in filteredBooks"
                          :key="book.name"
                          :value="book.name"
                        >
                          {{ book.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="flex-div">
                    <!-- Chapter -->
                    <div class="form-group">
                      <label for="chapter">Chapter:</label>
                      <input
                        type="number"
                        id="chapter"
                        v-model="form.chapter"
                        min="1"
                        placeholder="e.g., 1"
                        @input="updateScriptureReference"
                      />
                      <small class="form-help">Used to build scripture reference</small>
                    </div>

                    <!-- Verse -->
                    <div class="form-group">
                      <label for="verse">Verse:</label>
                      <input
                        type="text"
                        id="verse"
                        v-model="form.verse"
                        placeholder="e.g., 1 or 1-3"
                        @input="updateScriptureReference"
                      />
                      <small class="form-help">Used to build scripture reference</small>
                    </div>
                  </div>

                  <!-- Scripture Reference Display -->
                  <div class="form-group" v-if="form.scripture_reference">
                    <label>Scripture Reference:</label>
                    <small class="form-help">This will be stored in the database</small>
                    <div class="scripture-display" :class="{ 'invalid': !validateScriptureReference(form.scripture_reference) }">
                      <span class="scripture-text">{{ form.scripture_reference }}</span>
                      <div class="scripture-actions">
                        <span v-if="!validateScriptureReference(form.scripture_reference)" class="validation-error">
                          <i class="ri-error-warning-line"></i> Invalid format
                        </span>
                        <button 
                          type="button" 
                          class="clear-scripture-btn" 
                          @click="clearScriptureReference"
                          title="Clear scripture reference"
                        >
                          <i class="ri-close-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Thumbnail -->
                  <div class="form-group">
                    <label for="thumbnail">Thumbnail URL:</label>
                    <input
                      type="url"
                      id="thumbnail"
                      v-model="form.thumbnail"
                      placeholder="Enter thumbnail URL"
                    />
                  </div>

                  <!-- Description -->
                  <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      required
                      placeholder="Enter a short description"
                    ></textarea>
                  </div>

                  <!-- Biblical Reference Selection (Optional) -->
                  <div class="form-group">
                    <label for="biblical_reference">Biblical Reference Category (Optional):</label>
                    <select 
                      id="biblical_reference" 
                      v-model="form.biblical_reference_id"
                      @change="onBiblicalReferenceChange"
                    >
                      <option value="">Select a category (optional)</option>
                      <option
                        v-for="ref in biblicalReferences"
                        :key="ref.id"
                        :value="ref.id"
                      >
                        {{ ref.name }} - {{ ref.category || 'General' }}
                      </option>
                    </select>
                    <small class="form-help">
                      Link to a specific biblical reference for better categorization
                    </small>
                  </div>
                </div>

                <!-- Body -->
                <div class="form-group">
                  <label for="body">Body:</label>
                  <TiptapEditor v-model="form.body" />
                </div>

                <!-- Submit Button -->
                <div class="form-group">
                  <div class="button-group">
                    <button 
                      v-if="!isEditing || (isEditing && form.status !== 'draft')"
                      type="submit" 
                      class="button"
                      :disabled="isFormEmpty"
                      :class="{ 'button-inactive': isFormEmpty }"
                    >
                      {{ isEditing ? "Update Post" : "Publish Post" }}
                      <span class="button-ornament">
                        <i class="ri-arrow-right-s-line"></i>
                      </span>
                    </button>
                    
                    <button 
                      type="button" 
                      class="button draft-button"
                      :disabled="isFormEmpty"
                      :class="{ 'button-inactive': isFormEmpty }"
                      @click="saveDraftPost"
                    >
                      Save as Draft
                      <span class="button-ornament">
                        <i class="ri-draft-line"></i>
                      </span>
                    </button>
                    
                    <button 
                      v-if="isFormActive"
                      type="button" 
                      class="button cancel-button" 
                      @click="cancelForm"
                    >
                      Cancel
                      <span class="button-ornament">
                        <i class="ri-close-line"></i>
                      </span>
                    </button>
                    
                    <!-- Debug button -->
                    <button 
                      type="button" 
                      class="button debug-button" 
                      @click="debugForm"
                      style="background-color: #17a2b8;"
                    >
                      Debug Form
                      <span class="button-ornament">
                        <i class="ri-bug-line"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          <section id="settings-section" class="settings-section">
            <h2>Account Settings</h2>
            <AccountSettingsForm />
          </section>
        </div>
      </div>
      </main>
    </div>
  </template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { usePostsStore } from "@/stores/posts";
import { useAuthStore } from "@/stores/auth";
import TiptapEditor from "@/components/TiptapEditor.vue";
import CustomAlert from '@/components/CustomAlert.vue';
import { useRouter } from "vue-router";
import TheHeader from '@/components/TheHeader.vue';

// Enable auth middleware for proper authentication
definePageMeta({
  middleware: 'auth'
});

const postsStore = usePostsStore();
const authStore = useAuthStore();
const loading = ref(true);
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};


// Format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Form state
const form = ref({
  title: "",
  thumbnail: "",
  description: "",
  body: "",
  testament: "",
  book_name: "",
  chapter: "",
  verse: "",
  scripture_reference: "",
  biblical_reference_id: null,
  status: "published"
});

// Add watcher for title capitalization
watch(() => form.value.title, (newValue) => {
  if (newValue) {
    form.value.title = newValue.charAt(0).toUpperCase() + newValue.slice(1);
  }
});

// Add watcher for book name changes to update scripture reference
watch(() => form.value.book_name, () => {
  updateScriptureReference();
});

// Add watcher for form.body to debug TiptapEditor integration
watch(() => form.value.body, (newValue, oldValue) => {
  console.log('Form body changed:', { oldValue, newValue });
}, { deep: true });

// Add watcher for form values to debug form state
watch(() => form.value, (newValue) => {
  console.log('Form values changed:', newValue);
}, { deep: true });

const isEditing = ref(false);
const editingPostId = ref(null);
const filteredBooks = ref([]);
const biblicalReferences = ref([]);

// Add these new refs
const postsPerPage = ref(6);
const currentPage = ref(1);

// Modify the userPosts computed property to handle all posts
const userPosts = computed(() => {
  const profileId = authStore.userMeta?.id;
  return profileId
    ? postsStore.posts.filter((post) => post.author_profile_id === profileId)
    : [];
});

// Add new computed properties for pagination
const displayedPosts = computed(() => {
  const startIndex = 0;
  const endIndex = currentPage.value * postsPerPage.value;
  return userPosts.value.slice(startIndex, endIndex);
});

const hasMorePosts = computed(() => {
  return displayedPosts.value.length < userPosts.value.length;
});

// Add load more function
const loadMorePosts = () => {
  currentPage.value++;
};

// Testaments
const testaments = computed(() => postsStore.testaments);
const filterBooks = () => {
  filteredBooks.value = postsStore.books.filter(
    (book) => book.testament === form.value.testament
  );
};

// Scripture reference functions
const updateScriptureReference = () => {
  if (form.value.book_name && form.value.chapter) {
    let reference = `${form.value.book_name} ${form.value.chapter}`;
    if (form.value.verse) {
      // Validate verse format (allow single verse or verse range)
      const versePattern = /^\d+(?:-\d+)?$/;
      if (versePattern.test(form.value.verse)) {
        reference += `:${form.value.verse}`;
      } else {
        // If invalid verse format, clear it
        form.value.verse = "";
        reference = `${form.value.book_name} ${form.value.chapter}`;
      }
    }
    form.value.scripture_reference = reference;
  } else {
    form.value.scripture_reference = "";
  }
};

const validateScriptureReference = (reference) => {
  // Pattern: Book Name Chapter:Verse or Book Name Chapter
  const pattern = /^[A-Za-z\s]+ \d+(?::\d+(?:-\d+)?)?$/;
  return pattern.test(reference);
};

const clearScriptureReference = () => {
  form.value.chapter = "";
  form.value.verse = "";
  form.value.scripture_reference = "";
  form.value.biblical_reference_id = null;
};

const onBiblicalReferenceChange = () => {
  // Optional: Add logic here if you want to auto-fill other fields
  // based on the selected biblical reference
  console.log('Biblical reference selected:', form.value.biblical_reference_id);
};

// Fetch biblical references
const fetchBiblicalReferences = async () => {
  try {
    const { data, error } = await client
      .from('biblical_references')
      .select('*')
      .order('name');
    
    if (error) throw error;
    biblicalReferences.value = data || [];
  } catch (error) {
    console.error('Error fetching biblical references:', error);
    biblicalReferences.value = [];
  }
};

// Update alert state
const showAlert = ref(false);
const alertMessage = ref('');
const isConfirmDialog = ref(false);
const pendingDeleteId = ref(null);

// Update the showCustomAlert function
const showCustomAlert = (message, isConfirm = false) => {
  alertMessage.value = message;
  isConfirmDialog.value = isConfirm;
  showAlert.value = true;
};

// Add handler for alert close
const handleAlertClose = async (confirmed) => {
  showAlert.value = false;
  
  if (pendingDeleteId.value && confirmed) {
    try {
      await postsStore.deletePost(pendingDeleteId.value);
      await postsStore.fetchPosts();
      // Show success message after a brief delay
      setTimeout(() => {
        showCustomAlert('Post deleted successfully!');
      }, 300);
    } catch (error) {
      console.error('Error deleting post:', error);
      setTimeout(() => {
        showCustomAlert('Failed to delete post.');
      }, 300);
    }
    pendingDeleteId.value = null;
  }
};

// Update the confirmDelete function
const confirmDelete = (postId) => {
  pendingDeleteId.value = postId;
  showCustomAlert('Are you sure you want to delete this post?', true);
};

// First, add this computed property to check if form has any content
const isFormActive = computed(() => {
  return Boolean(
    form.value.title?.trim() ||
    form.value.description?.trim() ||
    form.value.body?.trim() ||
    form.value.testament ||
    form.value.book_name ||
    form.value.scripture_reference?.trim() ||
    form.value.thumbnail?.trim()
  );
});

// Modify the resetForm function
const resetForm = async () => {
  // Reset all form fields
  form.value = {
    title: "",
    thumbnail: "",
    description: "",
    body: "",
    testament: "",
    book_name: "",
    chapter: "",
    verse: "",
    scripture_reference: "",
    biblical_reference_id: null,
    status: "published"
  };
  
  // Reset editing state
  isEditing.value = false;
  editingPostId.value = null;
  
  // Force reactivity update
  await nextTick();
};

// Update the submitForm function
const submitForm = async () => {
  console.log('=== SUBMIT FORM STARTED ===');
  console.log('Form values before processing:', JSON.stringify(form.value, null, 2));
  
  form.value.author_profile_id = authStore.userMeta?.id;
  form.value.status = 'published';

  console.log('Author profile ID set to:', form.value.author_profile_id);
  console.log('Status set to:', form.value.status);

  if (!form.value.author_profile_id) {
    console.error('No author profile ID found');
    showCustomAlert("Unable to find the author's profile ID.");
    return;
  }

  // Debug: Check authentication status
  console.log('Current user:', user.value);
  console.log('User meta:', authStore.userMeta);
  console.log('Author profile ID:', form.value.author_profile_id);
  
  // Test authentication with Supabase client
  try {
    const { data: { session }, error } = await client.auth.getSession();
    console.log('Supabase session:', session);
    console.log('Session error:', error);
    if (session) {
      console.log('User ID from session:', session.user.id);
    }
  } catch (authError) {
    console.error('Error checking Supabase session:', authError);
  }

  try {
    console.log('=== VALIDATING FORM FIELDS ===');
    
    // Validate required fields
    if (!form.value.title?.trim()) {
      console.error('Title validation failed');
      showCustomAlert("Title is required");
      return;
    }
    console.log('Title validation passed:', form.value.title);
    
    if (!form.value.description?.trim()) {
      console.error('Description validation failed');
      showCustomAlert("Description is required");
      return;
    }
    console.log('Description validation passed:', form.value.description);
    
    if (!form.value.body || form.value.body.trim() === '') {
      console.error('Body validation failed. Body value:', form.value.body);
      showCustomAlert("Body content is required");
      return;
    }
    console.log('Body validation passed:', form.value.body);
    
    if (!form.value.testament) {
      console.error('Testament validation failed');
      showCustomAlert("Testament is required");
      return;
    }
    console.log('Testament validation passed:', form.value.testament);
    
    if (!form.value.book_name?.trim()) {
      console.error('Book name validation failed');
      showCustomAlert("Book name is required");
      return;
    }
    console.log('Book name validation passed:', form.value.book_name);

    console.log('=== ALL VALIDATIONS PASSED ===');

    // Create a clean post object with only the fields that exist in the database
    const postData = {
      title: form.value.title.trim(),
      thumbnail: form.value.thumbnail?.trim() || null,
      description: form.value.description.trim(),
      body: form.value.body.trim(),
      testament: form.value.testament,
      book_name: form.value.book_name.trim(),
      scripture_reference: form.value.scripture_reference?.trim() || null,
      biblical_reference_id: form.value.biblical_reference_id || null,
      author_profile_id: form.value.author_profile_id,
      status: form.value.status
    };

    // Debug: Log what we're sending to the database
    console.log('=== SUBMITTING POST DATA ===');
    console.log('Post data to submit:', JSON.stringify(postData, null, 2));
    console.log('Form state:', form.value);
    console.log('Is editing:', isEditing.value);
    console.log('Editing post ID:', editingPostId.value);

    if (isEditing.value) {
      console.log('=== UPDATING EXISTING POST ===');
      console.log('Attempting to update post with ID:', editingPostId.value);
      const result = await postsStore.updatePost(editingPostId.value, postData, client);
      console.log('Update result:', result);
      showCustomAlert("Post updated successfully!");
    } else {
      console.log('=== CREATING NEW POST ===');
      console.log('Attempting to create new post');
      const result = await postsStore.addPost(postData, client);
      console.log('Create result:', result);
      showCustomAlert("Post published successfully!");
    }
    
    console.log('=== FORM SUBMISSION SUCCESSFUL ===');
    await resetForm();
    await refreshCache(); // Refresh cache after post changes
  } catch (error) {
    console.error("=== FORM SUBMISSION FAILED ===");
    console.error("Error saving post:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      formData: form.value
    });
    showCustomAlert(`Failed to save post: ${error.message}`);
  }
};

// Update the saveDraftPost function
const saveDraftPost = async () => {
  console.log('=== SAVE DRAFT STARTED ===');
  console.log('Form values before processing:', JSON.stringify(form.value, null, 2));
  
  form.value.author_profile_id = authStore.userMeta?.id;

  console.log('Author profile ID set to:', form.value.author_profile_id);

  if (!form.value.author_profile_id) {
    console.error('No author profile ID found for draft');
    showCustomAlert("Unable to find the author's profile ID.");
    return;
  }

  // Debug: Check authentication status
  console.log('Current user (draft):', user.value);
  console.log('User meta (draft):', authStore.userMeta);
  console.log('Author profile ID (draft):', form.value.author_profile_id);
  
  // Test authentication with Supabase client
  try {
    const { data: { session }, error } = await client.auth.getSession();
    console.log('Supabase session (draft):', session);
    console.log('Session error (draft):', error);
    if (session) {
      console.log('User ID from session (draft):', session.user.id);
    }
  } catch (authError) {
    console.error('Error checking Supabase session (draft):', authError);
  }

  try {
    console.log('=== VALIDATING DRAFT FIELDS ===');
    
    // Validate required fields
    if (!form.value.title?.trim()) {
      console.error('Draft title validation failed');
      showCustomAlert("Title is required");
      return;
    }
    console.log('Draft title validation passed:', form.value.title);
    
    if (!form.value.description?.trim()) {
      console.error('Draft description validation failed');
      showCustomAlert("Description is required");
      return;
    }
    console.log('Draft description validation passed:', form.value.description);
    
    if (!form.value.body || form.value.body.trim() === '') {
      console.error('Draft body validation failed. Body value:', form.value.body);
      showCustomAlert("Body content is required");
      return;
    }
    console.log('Draft body validation passed:', form.value.body);
    
    if (!form.value.testament) {
      console.error('Draft testament validation failed');
      showCustomAlert("Testament is required");
      return;
    }
    console.log('Draft testament validation passed:', form.value.testament);
    
    if (!form.value.book_name?.trim()) {
      console.error('Draft book name validation failed');
      showCustomAlert("Book name is required");
      return;
    }
    console.log('Draft book name validation passed:', form.value.book_name);

    console.log('=== ALL DRAFT VALIDATIONS PASSED ===');

    // Create a clean post object with only the fields that exist in the database
    const postData = {
      title: form.value.title.trim(),
      thumbnail: form.value.thumbnail?.trim() || null,
      description: form.value.description.trim(),
      body: form.value.body.trim(),
      testament: form.value.testament,
      book_name: form.value.book_name.trim(),
      scripture_reference: form.value.scripture_reference?.trim() || null,
      biblical_reference_id: form.value.biblical_reference_id || null,
      author_profile_id: form.value.author_profile_id,
      status: 'draft'
    };

    // Debug: Log what we're sending to the database
    console.log('=== SAVING DRAFT DATA ===');
    console.log('Draft data to save:', JSON.stringify(postData, null, 2));
    console.log('Form state (draft):', form.value);

    const result = await postsStore.saveDraft(postData, client);
    console.log('Draft save result:', result);
    showCustomAlert("Draft saved successfully!");
    
    console.log('=== DRAFT SAVE SUCCESSFUL ===');
    await resetForm();
    await refreshCache(); // Refresh cache after draft changes
  } catch (error) {
    console.error("=== DRAFT SAVE FAILED ===");
    console.error("Error saving draft:", error);
    console.error("Draft error details:", {
      message: error.message,
      stack: error.stack,
      formData: form.value
    });
    showCustomAlert(`Failed to save draft: ${error.message}`);
  }
};

// Edit post
const editPost = (post) => {
  // First set the testament to trigger book filtering
  form.value.testament = post.testament;
  // Filter books based on testament
  filterBooks();
  
  // Parse scripture reference if it exists
  let chapter = "";
  let verse = "";
  if (post.scripture_reference) {
    const match = post.scripture_reference.match(/(\d+)(?::(\d+(?:-\d+)?))?$/);
    if (match) {
      chapter = match[1];
      verse = match[2] || "";
    }
  }
  
  // Then set the rest of the form values
  form.value = {
    id: post.id,
    title: post.title,
    thumbnail: post.thumbnail || "",
    description: post.description,
    body: post.body || "",
    testament: post.testament,
    book_name: post.book_name,
    chapter: chapter,
    verse: verse,
    scripture_reference: post.scripture_reference || "",
    biblical_reference_id: post.biblical_reference_id,
    author_profile_id: post.author_profile_id,
    status: post.status
  };
  
  isEditing.value = true;
  editingPostId.value = post.id;

  // Scroll to the form
  document.querySelector('.post-form').scrollIntoView({ behavior: 'smooth' });
};

// Cancel edit
const cancelEdit = () => {
  isEditing.value = false;
  editingPostId.value = null;
  form.value = {
    title: "",
    thumbnail: "",
    description: "",
    body: "",
    testament: "",
    book_name: "",
    chapter: "",
    verse: "",
    scripture_reference: "",
    biblical_reference_id: null,
    status: "published"
  };
};

// Initialize all data in a single function
const loadingStates = ref({
  auth: true,
  posts: true,
  books: true,
  metadata: true
});
const errors = ref({
  auth: null,
  posts: null,
  books: null,
  metadata: null
});

// Add cache refs
const cache = ref({
  posts: null,
  books: null,
  metadata: null,
  lastUpdated: null
});

// Cache expiration time (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Add cache validation
const isCacheValid = computed(() => {
  if (!cache.value.lastUpdated) return false;
  return Date.now() - cache.value.lastUpdated < CACHE_DURATION;
});

// Update initializeData to use cache
const initializeData = async () => {
  try {
    loading.value = true;
    console.log('=== INITIALIZING DATA ===');
    
    // Reset all loading states
    loadingStates.value = {
      auth: true,
      posts: true,
      books: true,
      metadata: true
    };
    // Reset all errors
    errors.value = {
      auth: null,
      posts: null,
      books: null,
      metadata: null
    };

    // Initialize auth with retry
    try {
      console.log('Initializing auth...');
      await retryOperation(() => authStore.initializeAuth());
      loadingStates.value.auth = false;
      console.log('Auth initialized successfully');
    } catch (error) {
      console.error('Auth initialization failed:', error);
      errors.value.auth = error;
      // Don't return here, continue with other data
    }

    // Always try to fetch books and testaments (these don't require authentication)
    try {
      console.log('Fetching books and testaments...');
      if (cache.value.books && isCacheValid.value) {
        postsStore.books = cache.value.books;
        postsStore.testaments = [...new Set(cache.value.books.map(book => book.testament))];
        loadingStates.value.books = false;
        console.log('Using cached books data');
      } else {
        await postsStore.fetchBooksAndTestaments();
        cache.value.books = postsStore.books;
        cache.value.lastUpdated = Date.now();
        loadingStates.value.books = false;
        console.log('Books and testaments fetched successfully');
      }
    } catch (error) {
      errors.value.books = error;
      console.error('Books fetch failed:', error);
    }

    // Try to fetch biblical references (these don't require authentication)
    try {
      console.log('Fetching biblical references...');
      await fetchBiblicalReferences();
      console.log('Biblical references fetched successfully');
    } catch (error) {
      console.error('Biblical references fetch failed:', error);
    }

    // Only try to fetch user-specific data if user is authenticated
    if (user.value && authStore.userMeta?.id) {
      console.log('User authenticated, fetching user-specific data...');
      
      // Fetch posts and metadata in parallel
      await Promise.all([
        retryOperation(async () => {
          try {
            console.log('Fetching posts...');
            if (cache.value.posts && isCacheValid.value) {
              postsStore.posts = cache.value.posts;
              loadingStates.value.posts = false;
              console.log('Using cached posts data');
            } else {
              await postsStore.fetchPosts();
              cache.value.posts = postsStore.posts;
              cache.value.lastUpdated = Date.now();
              loadingStates.value.posts = false;
              console.log('Posts fetched successfully');
            }
          } catch (error) {
            errors.value.posts = error;
            console.error('Posts fetch failed:', error);
          }
        }),
        retryOperation(async () => {
          try {
            console.log('Fetching user metadata...');
            if (cache.value.metadata && isCacheValid.value) {
              authStore.userMeta = cache.value.metadata;
              loadingStates.value.metadata = false;
              console.log('Using cached metadata');
            } else {
              await authStore.fetchUserMetadata();
              cache.value.metadata = authStore.userMeta;
              cache.value.lastUpdated = Date.now();
              loadingStates.value.metadata = false;
              console.log('User metadata fetched successfully');
            }
          } catch (error) {
            errors.value.metadata = error;
            console.error('Metadata fetch failed:', error);
          }
        })
      ]);
    } else {
      console.log('User not authenticated, skipping user-specific data');
      // Mark these as not loading since we're not trying to fetch them
      loadingStates.value.posts = false;
      loadingStates.value.metadata = false;
    }
    
    console.log('=== DATA INITIALIZATION COMPLETED ===');
    console.log('Final loading states:', loadingStates.value);
    console.log('Final errors:', errors.value);
    
  } catch (error) {
    console.error('Data initialization failed:', error);
    showCustomAlert('Failed to load some data. Please try refreshing the page.');
  } finally {
    loading.value = false;
    console.log('Loading set to false');
  }
};

// Add cache invalidation function
const invalidateCache = () => {
  cache.value = {
    posts: null,
    books: null,
    metadata: null,
    lastUpdated: null
  };
};

// Add cache refresh function
const refreshCache = async () => {
  invalidateCache();
  await initializeData();
};

// Add computed property for overall loading state
const isLoading = computed(() => {
  return Object.values(loadingStates.value).some(state => state === true);
});

// Add computed property for error state
const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== null);
});

// Add computed property for partial data (when some but not all data is loaded)
const hasPartialData = computed(() => {
  return Object.values(loadingStates.value).some(state => state === true) &&
         Object.values(errors.value).some(error => error === null);
});

// Add computed property for total data availability
const hasAnyData = computed(() => {
  return userPosts.value.length > 0 ||
         favoritePosts.value.length > 0 ||
         draftPosts.value.length > 0 ||
         postsStore.posts.length > 0 || // Fallback for posts if userPosts is empty
         authStore.userMeta?.id; // Check if user is logged in
});

// Add retry mechanism
const MAX_RETRIES = 3;
const retryOperation = async (operation, retryCount = 0) => {
  try {
    return await operation();
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying operation, attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return retryOperation(operation, retryCount + 1);
    }
    throw error;
  }
};

// Simplified onMounted
onMounted(() => {
  console.log('Admin page mounted, starting data initialization...');
  
  // Add a timeout to prevent infinite loading
  const timeoutId = setTimeout(() => {
    if (loading.value) {
      console.error('Data initialization timed out after 30 seconds');
      loading.value = false;
      showCustomAlert('Page loading timed out. Please refresh the page.');
    }
  }, 30000); // 30 second timeout
  
  initializeData().finally(() => {
    clearTimeout(timeoutId);
  });
});

// Add new computed property for draft posts
const draftPosts = computed(() => {
  const profileId = authStore.userMeta?.id;
  return profileId
    ? postsStore.posts.filter(
        post => post.author_profile_id === profileId && post.status === 'draft'
      )
    : [];
});

// Add this computed property in the script section
const isFormEmpty = computed(() => {
  return !form.value.title?.trim() &&
         !form.value.description?.trim() &&
         (!form.value.body || form.value.body.trim() === '') &&
         !form.value.testament &&
         !form.value.book_name?.trim() &&
         !form.value.scripture_reference?.trim() &&
         !form.value.thumbnail?.trim();
});

// Update the cancelForm function
const cancelForm = async () => {
  await resetForm();
  showCustomAlert("Form has been reset");
};

// Add new computed property for favorite posts
const favoritePosts = computed(() => {
  const profileId = authStore.userMeta?.id;
  if (!profileId || !authStore.userMeta?.liked_posts) return [];
  
  // Filter posts that are in the user's liked_posts array
  return postsStore.posts.filter(post => 
    authStore.userMeta.liked_posts.includes(post.id)
  );
});

// Update the removeFromFavorites function
const removeFromFavorites = async (postId) => {
  try {
    const currentLikedPosts = authStore.userMeta.liked_posts || [];
    const updatedLikedPosts = currentLikedPosts.filter(id => id !== postId);
    
    const { error } = await client
      .from('profiles')
      .update({ liked_posts: updatedLikedPosts })
      .eq('id', authStore.userMeta.id);

    if (error) throw error;

    authStore.userMeta.liked_posts = updatedLikedPosts;
    invalidateCache(); // Invalidate cache after favorites change
    showCustomAlert('Post removed from favorites');
  } catch (error) {
    console.error('Error removing post from favorites:', error);
    showCustomAlert('Failed to remove post from favorites');
  }
};

// Debug function for form
const debugForm = () => {
  console.log('Current form state:', form.value);
  console.log('Is form active:', isFormActive.value);
  console.log('Is form empty:', isFormEmpty.value);
  console.log('Is editing:', isEditing.value);
  console.log('Editing post ID:', editingPostId.value);
  console.log('User meta:', authStore.userMeta);
  console.log('User ID:', user.value?.id);
  console.log('Supabase session:', user.value?.session);
};

// Retry functions for specific errors
const retryAuth = async () => {
  console.log('Retrying authentication...');
  await authStore.initializeAuth();
  await refreshCache();
  showCustomAlert('Authentication retry successful.');
};

const retryPosts = async () => {
  console.log('Retrying posts data...');
  await postsStore.fetchPosts();
  cache.value.posts = postsStore.posts;
  cache.value.lastUpdated = Date.now();
  loadingStates.value.posts = false;
  showCustomAlert('Posts data retry successful.');
};

const retryBooks = async () => {
  console.log('Retrying books data...');
  await postsStore.fetchBooksAndTestaments();
  cache.value.books = postsStore.books;
  cache.value.lastUpdated = Date.now();
  loadingStates.value.books = false;
  showCustomAlert('Books data retry successful.');
};

const retryMetadata = async () => {
  console.log('Retrying user metadata...');
  await authStore.fetchUserMetadata();
  cache.value.metadata = authStore.userMeta;
  cache.value.lastUpdated = Date.now();
  loadingStates.value.metadata = false;
  showCustomAlert('User metadata retry successful.');
};

const retryFailedData = async () => {
  console.log('Retrying all failed data...');
  await Promise.all([
    retryAuth(),
    retryPosts(),
    retryBooks(),
    retryMetadata()
  ]);
  showCustomAlert('All failed data retries successful.');
};
</script>

        
  <style scoped>
  .spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

  .editor {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 4px;
  min-height: 200px;
  width: 100%;
}

.is-active {
  font-weight: bold;
}
.editor-toolbar button {
  margin: 0 5px;
}
  .admin-page {
    padding: 2rem;
  }
  .greeting h2 {
    color: #555;
  }
  .create-post,
  .user-posts,
  .liked-posts {
    margin-top: 2rem;
  }
  .like-button {
    background: none;
    border: none;
    color: gray;
    cursor: pointer;
  }
  .like-button.liked {
    color: red;
  }

  /*=============== LAYOUT ===============*/
/* .main {
  display: grid;
  row-gap: 1.5rem;
  margin-inline: 1.5rem;
  padding-block: 8.5rem 4rem;
} */

.bg__image, 
.bg__blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}

.bg__image {
  object-fit: cover;
  object-position: center;
}

.bg__blur {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}


/*=============== BANNER ===============*/
.banner__link {
  position: relative;
  display: grid;
  place-items: center;
  color: var(--white-color);
}

.banner__img {
  border-radius: 1rem;
}

.banner__shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--shadow-bg);
  border-radius: 1rem;
}

.banner__data {
  position: absolute;
  bottom: 1.5rem;
  text-align: center;
}

.banner__title {
  font-size: var(--big-font-size);
}

/*=============== BREAKPOINTS ===============*/
/* For small devices */
@media screen and (max-width: 300px) {
  .main {
    margin-inline: 1rem;
  }
}

/* For medium devices */
@media screen and (min-width: 768px) {
  .banner__card, .banner__img {
    height: 400px;
  }
  .banner__img {
    width: 100%;
    object-fit: cover;
    object-position: top;
  }
}

/* For large devices */
/* @media screen and (min-width: 968px) {
  .main {
    margin-inline: 20rem 2rem;
    row-gap: 2.5rem;
    padding-top: 7.5rem;
  }

  .nav {
    right: initial;
    left: 0;
  }

  .nav__close,
  .header__logo,
  .header__menu {
    display: none;
  }

  .header {
    width: calc(100% - 17rem);
    left: initial;
    right: 0;
    height: calc(var(--header-height) + 2rem);
    grid-template-columns: repeat(2, max-content);
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem 0 3rem;
  }
  .header__search {
    order: -1;
    width: 450px;
  }
  .header__actions {
    column-gap: 1.25rem;
    font-size: 1.5rem;
  }
} */

@media screen and (min-width: 1150px) {
  .user-posts{
    display: grid;
    grid-template-columns: repeat(3, 330px);
    gap: 2rem;
  }
  .banner__data {
    bottom: 2.5rem;
  }
  .banner__category {
    font-size: var(--h1-font-size);
  }
}

@media screen and (min-width: 1300px) {
  .banner__card, 
  .banner__img {
    height: 480px;
  }
  .banner__img, 
  .banner__shadow {
    border-radius: 2rem;
  }

  .card__title {
    font-size: var(--h2-font-size);
  }
  .card__data {
    padding-inline: 1.5rem;
    bottom: 1.5rem;
  }
  .card__name {
    font-size: var(--h3-font-size);
    margin-bottom: .25rem;
  }
  .card__category {
    font-size: var(--normal-font-size);
  }
}

.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.flex-div .form-group{
  flex-basis: 50%;
}

.vid-list {
  padding: 20px;
}

.vid-list a {
  color: var(--first-color-lighten);
  text-decoration: none;
}

.vid-list a:hover {
  color: var(--first-color);
}

.publisher {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.publisher img {
  width: 40px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid var(--title-color);
}

.publisher div {
  flex: 1;
  line-height: 1.2;
}

.publisher div p {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.publisher div .author-name {
  color: var(--header-color);
}

.down-content {
  padding-top: 16px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); 
  border-bottom: solid 1px var(--header-color);
  background-clip: padding-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  position: relative;
}

.meta{
  position: relative;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* .meta-category {
    position: absolute;
    top: 8px;
    left: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: "Cormorant", Arial, Helvetica, serif;
    font-weight: 700;
    background-color: var(--header-color);
    height: 1.6rem;
    padding: 0 14px 0 14px;
    border-radius: 200px;
    letter-spacing: .5px;
    display: flex;
    align-items: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1);
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.1);
} */

.icons{
  position: absolute;
  top: 8px;
  right: 1.5rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  padding: 0 14px 0 14px;
  border-radius: 200px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1);
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.1);
}

.icons i{
  color: var(--header-color);
  cursor: pointer;
  margin: 0 5px;
  transition: color 0.2s ease;
}

.icons i:hover {
  color: var(--first-color);
}

.icons .ri-delete-bin-line:hover {
  color: #dc3545;  /* Red color for delete action */
}

/* .meta-category span {
  font-size: var(--smallest-font-size);
    color: var(--first-color-lighten);
} */

.post-form {
  /* max-width: 600px; */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tiptap{
  width: 100%;
  min-height: 100%;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea,
select
 {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
}

select {
  width: 100%;
  padding: 1rem;
  border-radius: 1.5rem;
  background-color: var(--container-color);
  color: var(--text-color);
  font-size: var(--normal-font-size);
  border: none;
  outline: none;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3),
              -4px -4px 8px rgba(255, 255, 255, 0.1);
  transition: transform .2s;
  cursor: pointer;
  appearance: none; /* Removes default arrow in some browsers */
  -webkit-appearance: none; /* For Safari */
  -moz-appearance: none; /* For Firefox */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

select:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.4),
              -6px -6px 10px rgba(255, 255, 255, 0.15);
}

select:focus {
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3),
              inset -4px -4px 8px rgba(255, 255, 255, 0.1);
  transform: translateY(0);
}

select option {
  background-color: var(--container-color);
  color: var(--text-color);
  padding: 0.5rem;
}

button {
  background-color: var(--header-color);
  color: var(--first-color-lighten);
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: var(--title-color);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  background-color: var(--first-color-lighten); /* Light gray background */
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  gap: 10px;
}

.toolbar-button {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 14px;
}

.toolbar-button:hover {
  background-color: #e0e0e0; /* Slightly darker gray */
}

.toolbar-button.is-active {
  background-color: #6200ea; /* Highlight color */
  color: white;
}

.toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.cancel-button {
  background-color: #dc3545;
}

.cancel-button:hover {
  background-color: #c82333;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.load-more-button {
  /* padding: 0.75rem 1.5rem; */
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.load-more-button:hover {
  transform: translateY(-2px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main {
  padding-top: calc(var(--header-height) + 2rem);
  padding-bottom: 4rem;
}

.post-form-section,
.settings-section {
  margin-top: 3rem;
}

.draft-button {
  background-color: #6c757d;
}

.draft-button:hover {
  background-color: #5a6268;
}

.draft-badge {
  background-color: #6c757d;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 8px;
}

/* Add these new styles */
.button-inactive {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #999;
}

.button-inactive:hover {
  background-color: #999;
  transform: none;
}

/* Update existing button styles */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #999;
}

button:disabled:hover {
  background-color: #999;
  transform: none;
}

.error-container {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.error-message {
  color: #dc3545;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(220, 53, 69, 0.05);
}

.error-message h3 {
  margin: 0 0 0.5rem 0;
  color: #dc3545;
}

.error-message p {
  margin: 0 0 1rem 0;
}

.error-message .button {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.error-message .button:hover {
  background-color: #c82333;
}

.partial-data-container {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.warning-message {
  color: #856404;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(255, 193, 7, 0.05);
}

.warning-message h3 {
  margin: 0 0 0.5rem 0;
  color: #856404;
}

.warning-message p {
  margin: 0 0 1rem 0;
}

.warning-message .button {
  background-color: #ffc107;
  color: #212529;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.warning-message .button:hover {
  background-color: #e0a800;
}

.no-data-container {
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 8px;
  background-color: rgba(108, 117, 125, 0.1);
  border: 1px solid rgba(108, 117, 125, 0.2);
  text-align: center;
}

.no-data-container h2 {
  color: #6c757d;
  margin-bottom: 1rem;
}

.no-data-container p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.no-data-container ul {
  text-align: left;
  max-width: 400px;
  margin: 1rem auto;
  color: #6c757d;
}

.no-data-container .button-group {
  justify-content: center;
  margin-top: 1.5rem;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.spinner-container p {
  color: var(--text-color);
  margin: 0;
}

.form-help {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
  display: block;
}

.scripture-reference-section {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scripture-reference-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--header-color);
  font-size: 1.1rem;
}

.scripture-reference-section input,
.scripture-reference-section textarea,
.scripture-reference-section select {
  background-color: var(--container-color);
  color: var(--text-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3),
              -4px -4px 8px rgba(255, 255, 255, 0.1);
  transition: transform .2s, box-shadow .2s;
}

.scripture-reference-section input:focus,
.scripture-reference-section textarea:focus,
.scripture-reference-section select:focus {
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3),
              inset -4px -4px 8px rgba(255, 255, 255, 0.1);
  transform: translateY(0);
  outline: none;
}

.scripture-reference-section input:hover,
.scripture-reference-section textarea:hover,
.scripture-reference-section select:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.4),
              -6px -6px 10px rgba(255, 255, 255, 0.15);
}

.scripture-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--container-color);
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scripture-text {
  font-family: 'Cormorant', serif;
  font-size: 1.1rem;
  color: var(--first-color);
  font-weight: 600;
}

.scripture-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.validation-error {
  font-size: 0.875rem;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.validation-error i {
  font-size: 1rem;
}

.scripture-display.invalid {
  border-color: #dc3545;
  box-shadow: 0 0 5px rgba(220, 53, 69, 0.5);
}

.scripture-display.invalid .scripture-text {
  color: #dc3545;
}

.scripture-display.invalid .validation-error {
  color: #dc3545;
}

.clear-scripture-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.clear-scripture-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.debug-button {
  background-color: #17a2b8;
}

.debug-button:hover {
  background-color: #138496;
}

  </style>
  
