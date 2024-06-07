// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['@fortawesome/vue-fontawesome'],
  },
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  plugins: ['~/plugins/fontawesome.ts'],
})
