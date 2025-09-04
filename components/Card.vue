<template>
  <article class="post-card"
    v-if="posts.length > 0"
    v-for="(post, index) in posts"
    :key="index"
  >
    <div class="post-content">
      <div class="post-meta">
        <div class="meta-left">
          <div class="author avatar">
            <img :src="post.profiles?.avatar_url" :alt="post.profiles?.names" class="author-image">
          </div>
          <span class="author-name">{{ post.profiles?.names }} {{ post.profiles?.surnames }}</span>
          <span class="date">{{ formatDate(post.created_at) }}</span>
        </div>
        <span class="tag">{{ post.book_name }}</span>
      </div>
      <h2 class="post-title">
        <NuxtLink class="post-title" v-if="post.id" :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
      </h2>
      <!-- <p class="post-description">{{ post.description }}</p> -->
      <div class="post-footer">
        <p class="comments-info"><span>{{ post.comments || 0 }}</span> comments</p>
        <NuxtLink class="read-more" v-if="post.id" :to="`/posts/${post.id}`">Read more</NuxtLink>
      </div>
    </div>
  </article>
  <div v-else class="post-card">
    <p>Loading posts...</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Props Declaration
defineProps({
  posts: {
    type: Array,
    required: false,
    default: () => []
  }
  // isWidget: {
  //   type: Boolean,
  //   default: false
  // }
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

<style scoped>
.post-card {
  position: relative;
  width: 100%;
  min-height: 200px;
  background: var(--bg);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  border-radius: 8px;
  overflow: hidden;
  padding: 1rem;
  color: var(--white-color);
}

.post-content {
  position: relative;
  z-index: 2;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
}

.tag {
  background: var(--header-color);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.post-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: capitalize;
}

.post-title a {
  color: var(--title-color);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.post-title a:hover {
  opacity: 0.8;
}

.post-description {
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0.9;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments-info span{
  color: var(--title-color);
  margin-right: 2px;
  font-size: 1.1rem;
}
.read-more {
  color: var(--white-color);
  text-decoration: none;
  font-size: 0.875rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  /* background-color: var(--sidebar-title); */
  /* box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(178, 132, 73, 0.2); */
  /* box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(96, 66, 39, 0.1); */
  padding: 5px 14px 5px 14px;
  border-radius: 200px;
  border:1px solid var(--sidebar-title);
  padding:6px 8px;
}

.read-more:hover {
  opacity: 1;
}
</style> 