<template>
  <article class="post-card">
    <div v-if="title && postId" class="post-content">
      <div class="post-meta">
        <div class="meta-left">
          <div class="author">
            <img :src="author.avatar" :alt="author.name" class="author-image">
            <span class="author-name">{{ author.name }}</span>
          </div>
          <span class="date">{{ date }}</span>
        </div>
        <span class="tag">{{ tag }}</span>
      </div>
      <h2 class="post-title">
        <NuxtLink :to="`/posts/${postId}`">{{ title }}</NuxtLink>
      </h2>
      <p class="post-description">{{ description }}</p>
    </div>
    <p v-else>Loading post...</p>
  </article>
</template>

<!-- Rest of the code remains the same --> 