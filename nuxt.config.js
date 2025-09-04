export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '~/assets/css/global.css',
    '~/assets/css/style.css',
    '~/assets/css/widgets.css',
    '~/assets/css/responsive.css'
  ],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css',
        },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-tiptap-editor',
    '@nuxtjs/supabase',
    '@nuxt/ui'
  ],
  tiptap: {
    prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
  },
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.VITE_SUPABASE_ANON_KEY,
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
      CLOUDINARY_UPLOAD_URL: process.env.CLOUDINARY_UPLOAD_URL
    },
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.VITE_SUPABASE_ANON_KEY,
    redirectOptions: {
      enabled: false,
      exclude: ['/**'],  // Exclude all routes from redirect
      globalMiddleware: false  // Disable global middleware
    }
  },
  hooks: {
    'ready': () => {
      console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
      console.log('SUPABASE_KEY:', process.env.VITE_SUPABASE_ANON_KEY)
    }
  }
});
