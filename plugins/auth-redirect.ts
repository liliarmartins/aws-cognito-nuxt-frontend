import { Amplify } from 'aws-amplify'
import { fetchAuthSession } from 'aws-amplify/auth'
import outputs from '../amplify_outputs.json'

if (import.meta.client) {
  Amplify.configure(outputs, { ssr: true })
}

export default defineNuxtPlugin({
  name: 'AmplifyAuthRedirect',
  enforce: 'pre',
  setup() {
    addRouteMiddleware(
      'AmplifyAuthMiddleware',
      defineNuxtRouteMiddleware(async (to) => {
        try {
          const session = await fetchAuthSession()

          if (session.tokens === undefined && to.path !== '/login') {
            return navigateTo('/login')
          }

          if (session.tokens !== undefined && to.path === '/login') {
            return navigateTo('/')
          }
        } catch (e) {
          if (to.path !== '/login') {
            return navigateTo('/login')
          }
        }
      }),
      { global: true },
    )
  },
})
