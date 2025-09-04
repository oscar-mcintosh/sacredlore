<template>
    <div>
      <h1>Posts for Book: {{ book.name }}</h1>
      <div v-if="posts.length > 0">
        <div v-for="post in posts" :key="post.id">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
        </div>
      </div>
      <p v-else>No posts available for this book.</p>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from "vue-router";
  import { usePostsStore } from "@/stores/posts";
  
  const route = useRoute();
  const bookId = parseInt(route.params.id, 10);
  
  const postsStore = usePostsStore();
  await postsStore.fetchPosts(); 
  
  const book = computed(() => postsStore.books.find((b) => b.id === bookId));
  const posts = computed(() => postsStore.posts.filter((p) => p.book_id === bookId));
  </script>
