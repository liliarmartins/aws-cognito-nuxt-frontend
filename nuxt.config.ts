// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['@fortawesome/vue-fontawesome'],
  },
  css: ['bulma/css/bulma.css', '@fortawesome/fontawesome-svg-core/styles.css'],
  devtools: { enabled: true },
  imports: { dirs: ['stores'] },
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMRUpdate'] }],
  ],
  plugins: [
    '~/plugins/01.amplify-apis.client.ts',
    '~/plugins/02.auth-redirect.ts',
    '~/plugins/fontawesome.ts',
  ],
})
