<template>
  <div class="about-container">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-nav">
      <NuxtLink to="/" class="breadcrumb-item">Home</NuxtLink>
      <span class="separator">/</span>
      <span class="current-testament">About</span>
    </div>

    <h1>About Biblical Narratives</h1>
    
    <div class="content-section">
      <h2>Our Vision</h2>
      <p>
        Welcome to a space where ancient scripture meets creative exploration. Our platform 
        invites you to dive deeper into biblical narratives through the power of 
        imaginative storytelling, helping you connect with these timeless stories in 
        profound and personal ways.
      </p>
    </div>

    <div class="content-section">
      <h2>Why Biblical Fan Fiction?</h2>
      <p>
        The Bible is filled with extraordinary narratives of faith, struggle, redemption, 
        and divine encounters. Yet, for many of its characters, we only glimpse brief 
        moments of their lives. What happened to the man born blind after Jesus healed him? 
        How did Noah's neighbors react as he built the ark? What were Martha's thoughts as 
        she served while her sister sat at Jesus' feet?
      </p>
      <p>
        Through respectful and thoughtful storytelling, we create a space where these 
        untold stories can come to life, helping readers:
      </p>
      <ul>
        <li>Develop deeper emotional connections with biblical characters</li>
        <li>Understand the historical and cultural context of scripture</li>
        <li>Explore the human elements of divine narratives</li>
        <li>Find themselves in the stories of faith</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>Our Community Guidelines</h2>
      <p>
        While we encourage creative exploration, our community maintains a respectful 
        approach to biblical narratives. All stories should:
      </p>
      <ul>
        <li>Remain faithful to the spirit and message of scripture</li>
        <li>Treat biblical figures and events with appropriate reverence</li>
        <li>Aim to illuminate, not alter, biblical truths</li>
        <li>Foster understanding and spiritual growth</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>Join Our Journey</h2>
      <p>
        Whether you're a writer seeking to explore biblical narratives or a reader looking 
        to deepen your understanding of scripture, we invite you to join our community. 
        Together, we can discover new perspectives on ancient truths and find fresh ways 
        to connect with the greatest story ever told.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.content-section {
  margin-bottom: 3rem;
}

h1 {
  color: var(--header-color);
  font-size: 2.5rem;
  margin-bottom: 2rem;
  margin-top: 3rem;
  text-align: center;
}

h2 {
  color: var(--header-color);
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--text-color);
}

ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

@media screen and (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  
  h2 {
    font-size: 1.3rem;
  }
}
</style> 