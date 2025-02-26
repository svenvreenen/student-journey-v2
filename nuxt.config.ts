// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://use.typekit.net/puq3dyq.css' }
      ]
    }
  },

  css: [
    '@/assets/css/main.css',
    ],

  ssr: false,

  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL || 'https://student-journey-back-bxovn.ondigitalocean.app'
    }
  },

  modules:
    [
      '@nuxtjs/tailwindcss',
      '@pinia/nuxt',
    ],

  // The autoImports config is handled automatically by the module
})
