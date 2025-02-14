// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
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

  runtimeConfig: {

  },

  modules:
    [
      '@nuxtjs/tailwindcss',
    ],

    hub: {
      database: true
    }

})
