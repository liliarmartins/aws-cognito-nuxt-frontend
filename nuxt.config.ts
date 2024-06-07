// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['@fortawesome/vue-fontawesome'],
  },
  css: ['bulma/css/bulma.css', '@fortawesome/fontawesome-svg-core/styles.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  plugins: ['~/plugins/fontawesome.ts'],
})
