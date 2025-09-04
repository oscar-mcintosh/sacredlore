<!-- <template>
  <article class="down-content"       
  
  v-if="posts.length > 0"
  v-for="(post, index) in posts"
  :key="index"
>
<div class="meta">
  <div class="meta-category" :class="{ 'widget-meta': isWidget }">
    <span>{{ post.book_name }}</span>
  </div>
</div>
<div class="corner-curve">
          <div class="arrow-icon">
            <i class="ri-arrow-right-up-line"></i>
          </div>
</div>


  <div class="vid-list">
    <NuxtLink class="post-title" v-if="post.id" :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
    <div class="publisher">
      <div class="avatar">
        <img :src="post.profiles?.avatar_url" alt="">
      </div>
        <div>
            <p class="author-name">{{ post.profiles?.names }} {{ post.profiles?.surnames }}</p>
            <div class="flex-div">
              <span>{{ formatDate(post.created_at) }}</span>
              <p class="comments-info"><span>{{ post.comments || 0 }}</span> comments</p>
            </div>
        </div>
    </div>
  </div>
    </article>
    <p v-else>Loading posts...</p>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  posts: {
    type: Array,
    required: true
  },
  isWidget: {
    type: Boolean,
    default: false
  }
});



const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script> -->
<template>
  <article class="post-card"
    v-if="posts.length > 0"
    v-for="(post, index) in posts"
    :key="index"
  >
  <div class="main_content_posts">
      <!-- <span class="item-count vertical-align">1.</span> -->
      <div class="alith_post_title_small">
        <h5>
          <NuxtLink v-if="post.id" :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
        </h5>
        <div class="entry-meta meta-1 font-small color-grey">
              <span class="post-on">{{ formatDate(post.created_at) }}</span>
              <span class="hit-count has-dot">{{ post.comments }} Views</span>
        </div>
      </div>
  </div>

    <!-- <div class="post-content">
      <div class="post-meta">
        <div class="meta-left">
          <div class="author">
            <img :src="post.profiles?.avatar_url" :alt="post.profiles?.names" class="author-image">
            <span class="author-name">{{ post.profiles?.names }} {{ post.profiles?.surnames }}</span>
          </div>
          <span class="date">{{ formatDate(post.created_at) }}</span>
        </div>
        <span class="tag">{{ post.book_name }}</span>
      </div>
      <h2 class="post-title">
        <NuxtLink class="post-title" v-if="post.id" :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
      </h2>
      <p class="comments-info"><span>{{ post.comments || 0 }}</span> comments</p>
    </div> -->
  </article>
  <article v-else class="post-card">
    <p>Loading posts...</p>
  </article>
</template>

<script setup>
import { defineProps } from 'vue';

// Props Declaration
defineProps({  posts: {
    type: Array,
    required: true
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
/* .publisher
{
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.publisher div
{
    flex: 1;
    line-height: 18px;
}

.publisher img
{
    width: 40px;
    border-radius: 50%;
    margin-right: 15px;
    border: 1px solid var(--header-color);
}

.publisher div p
{
  color: #656e81;
    font-size: 18px;
    font-weight: 600;
}

.publisher div .author-name{
  color: var(--header-color);
}

.publisher div p span
{
  color: var(--header-color);
  margin-right: 5px;
}


.new-testament .publisher div p{
  color: #656e81;
  letter-spacing: .5px;
}


.new-testament .publisher div span{
  color: var(--second-color);
}

.old-testament .publisher div span{
  color: var(--first-color);
}



.flex-div
{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}


.list-container .vid-list .thumbnail
{
    width: 100%;
    border-radius: 5%;
}

.list-container .vid-list .flex-div
{
    align-items: flex-start;
    margin-top: 7px;
}

.vid-list{
  padding: 20px;
}

.vid-list a{
  color: var(--body-color);
  text-decoration: none;
}


.vid-list a:hover{
  color: var(--first-color);
}


.flex-div img
{
    width: 35px;
    margin-right: 10px;
    border-radius: 50%;    
}

 .flex-div .vid-info
{
    color: #5a5a5a;
    font-size: 13px;
}

.flex-div .vid-info a
{
    color: var(--first-color-lighten);
    font-size: 1.1rem;
}


.down-content {
  padding-top: 16px;
  box-shadow: 0 2px 8px hsla(220, 68%, 12%, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); 
  border-bottom: solid 1px var(--header-color);
  background-clip: padding-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  position: relative;
}

.meta{
  position: relative;
  height: 2rem;
}

.meta-category {
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
}

.widget-meta {
  background-color: var(--first-color) !important;
}

.new-testament .meta-category {
  background-color: var(--second-color);
}

.new-testament .down-content{
  border-bottom: 1px solid var(--second-color);
}

.old-testament .meta-category {
  background-color: var(--first-color);
}

.old-testament .down-content{
  border-bottom: 1px solid var(--first-color);
}


.meta-category span {
  font-size: var(--smallest-font-size);
    color: var(--first-color-lighten);
    font-family: "Cormorant", Arial, Helvetica, serif;
}

.down-content h4 {
  font-family: 'Cormorant Garamond', serif;
  color: var(--first-color-lighten);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 10px 0;
}

.down-content h4 em {
  font-style: italic;
  color: #333;
}

.down-content ul.post-info {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  display: flex;
  gap: 15px;
}

.down-content ul.post-info li {
  font-size: 14px;
  color: #999;
}

.down-content ul.post-info li a {
  color: #999;
  text-decoration: none;
}

.down-content p {
  font-size: 15px;
  color: #555;
}

.comments-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #e3b505;
}

.comments-info i {
  margin-right: 8px;
  font-size: 16px;
}

.share-post {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 0;
}

.share-post li {
  font-size: 14px;
  color: #555;
}

.share-post li i {
  font-size: 16px;
  color: #5ca46a;
  margin-right: 5px;
}

.share-post li a {
  color: #555;
  text-decoration: none;
}

.share-post li a:hover {
  text-decoration: underline;
} */
/* :root {
  --primary-color: #5ca46a;
  --text-color: #555;
  --heading-color: #333;
  --light-gray: #999;
  --header-color: #5ca46a;
  --first-color: #5ca46a;
  --first-color-lighten: #76c288;
  --second-color: #999;
}

body {
  font-family: Arial, sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  margin: 0;
  padding: 0;
} */

header {
  background-color: var(--header-color);
  color: #fff;
  padding: 1rem 0;
  text-align: center;
}

main {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 1rem;
}

.card__container {
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  gap: 2rem;
}

.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 15px;
}

.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.vid-list {
  padding: 20px;
}

.vid-list a {
  /* color: var(--first-color-lighten); */
  color: var(--body-color);
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

.publisher .avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 2px solid var(--title-color); */
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1);
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.1);
  padding: 10px;
  overflow: hidden;
}

.publisher img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}


.publisher div {
  /* flex: 1; */
  line-height: 1.2;
}

.publisher div p {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--body-color);
}

.publisher div .author-name {
  color: var(--header-color);
}

.new-testament .publisher div p {
  color: #656e81;
  letter-spacing: 0.5px;
}

.new-testament .publisher div span {
  color: var(--second-color);
}

.old-testament .publisher div span {
  color: var(--first-color);
}


.down-content {
  background-color: var(--bg);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.7);
  padding-top: 16px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); 
  border-bottom: solid 1px var(--header-color);
  background-clip: padding-box;
  display: flex;
  flex-direction: column;
  /* box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); */
  border-radius: 5px;
  position: relative;
}

.meta{
  position: relative;
  height: 2rem;
}

.meta-category {
    position: absolute;
    top: 8px;
    left: 1.5rem;
    /* text-transform: uppercase; */
    letter-spacing: 0.5px;
    /* font-family: "Cormorant", Arial, Helvetica, serif; */
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
}

.meta-category span {
  font-size: var(--smallest-font-size);
    color: var(--first-color-lighten);
}

.new-testament .meta-category {
  background-color: var(--second-color);
}

.new-testament .down-content{
  border-bottom: 1px solid var(--second-color);
}

.old-testament .meta-category {
  background-color: var(--first-color);
}

.old-testament .down-content{
  border-bottom: 1px solid var(--first-color);
}




.testament-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.testament-grid {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.bottom-posts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.bd-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.subscribe {
  display: table;
  width: 100%;
  border-radius: 5px;
}

.side-newsletter {
  background: #f8f8f8;
  padding: 20px;
}

.subscribe h4 {
  font-weight: 600;
  font-size: 20px;
  margin: -8px 0 14px;
  color: #222222;
}

.side-newsletter p {
  font-size: 15px;
  color: #707070;
  margin: 0 0 15px;
}

.side-newsletter input {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  height: 36px;
  background: #ffffff;
  padding: 0 20px;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

.side-newsletter button {
  border: 1px solid var(--header-color);
  border-radius: 5px;
  height: 36px;
  background: var(--header-color);
  padding: 0 20px;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 11px;
  letter-spacing: 0.06em;
  font-weight: bold;
  text-transform: uppercase;
}

.side-newsletter span {
  color: #787878;
  font-size: 12px;
  letter-spacing: 0.03em;
  display: table;
  width: 100%;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 10px;
}

.modal__buttons {
  display: flex;
  gap: 1rem;
  justify-content: space-around;
}

/* Breakpoints */
@media screen and (max-width: 300px) {
  .modal {
    padding: 1rem;
  }

  .modal__buttons {
    flex-direction: column;
  }
}

@media screen and (min-width: 540px) {
  .card__container {
    grid-template-columns: 330px;
  }
}

@media screen and (min-width: 768px) {
  .card__container {
    grid-template-columns: repeat(2, 330px);
  }
}

@media screen and (min-width: 1150px) {
  .card__container {
    grid-template-columns: repeat(3, 330px);
    gap: 5rem;
  }

  .single-posts {
    display: grid;
    grid-template-columns: 4fr 2fr;
    gap: 4rem;
    margin-top: 1rem;
  }
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.col-lg-6, .col-md-6 {
  width: 48%;
}

aside article .meta-category{
    background-color: var(--over-lay-color) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px); 
    border: solid 1px var(--third-color);
    background-clip: padding-box; 
    height: 2rem;
}

aside article{
  position: relative;
} 

aside .down-content{
border-bottom: 1px solid var(--third-color);
}

aside .publisher div span{
  color: var(--third-color);
}

aside .section-title{
  font-size: 2.5rem;
}

.corner-curve{
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: var(--bg);
	/* border-radius: 50%; */
  /* border: 1px solid var(--header-color); */
  border-bottom-left-radius: 50%;
  background: linear-gradient(145deg, hsl(112, 6%, 50%), hsl(112, 6%, 42%));
  transform: translateY(-2px);
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.25),
    -6px -6px 12px rgba(255, 255, 255, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
}

.arrow-icon{
  background: hsl(112, 6%, 30%);
  /* position: absolute; */
  border-radius: 50%;
  display: flex;
    justify-content: center;
    align-items: center;
  width: 20px;
  height: 20px;
  top: 0;
  right: 0;
}

.post-title {
  text-transform: capitalize !important;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: block;
  color: var(--title-color);
}

.post-card {
  border: 1px solid var(--text-color);
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
}

          /* <div class="arrow-icon">
            <i class="ri-arrow-right-up-line"></i>
          </div> */

</style>
