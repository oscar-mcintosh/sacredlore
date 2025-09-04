<template>
    <div class="card"  v-if="posts.length > 0"
        v-for="(post, index) in posts"
        :key="index"
        >


        <!-- post title start -->
        <div class="post-title d-flex align-items-center">
            <!-- profile picture end -->
            <div class="profile-thumb">
                <NuxtLink v-if="post.id" :to="`/posts/${post.id}`">
                    <figure class="profile-thumb-middle">
                        <img :src="post.profiles?.avatar_url" alt="profile picture">
                    </figure>
                </NuxtLink>
            </div>
            <!-- profile picture end -->

            <div class="posted-author">
                <h6 class="author"><a href="profile.html">{{ post.profiles?.names }} {{ post.profiles?.surnames }}</a></h6>
                <span class="post-time">{{ formatDate(post.created_at) }}</span>
            </div>

            <div class="post-settings-bar">
                <span></span>
                <span></span>
                <span></span>
                <div class="post-settings arrow-shape">
                    <ul>
                        <li><button>copy link to adda</button></li>
                        <li><button>edit post</button></li>
                        <li><button>embed adda</button></li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- post title start -->
        <div class="post-content">
            <p class="post-desc pb-0">{{ post.description }}</p>
            <div class="post-meta">
                <button class="post-meta-like">
                    <i class="bi bi-heart-beat"></i>
                    <span>You and 206 people like this</span>
                    <strong>206</strong>
                </button>
                <ul class="comment-share-meta">
                    <li>
                        <button class="post-comment">
                            <i class="bi bi-chat-bubble"></i>
                            <span>41</span>
                        </button>
                    </li>
                    <li>
                        <button class="post-share">
                            <i class="bi bi-share"></i>
                            <span>07</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <p v-else>Loading posts...</p>
</template>

<script setup>
import { defineProps } from 'vue';

// Props Declaration
defineProps({
  posts: {
    type: Array,
    required: true
  }
});

// Utility Function for Date Formatting
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

</script>

<style lang="scss" scoped>

</style>