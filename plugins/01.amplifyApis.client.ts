// https://docs.amplify.aws/vue/build-a-backend/server-side-rendering/
import { Amplify } from 'aws-amplify'
import { updateUserAttributes, signOut } from 'aws-amplify/auth'
import outputs from '../amplify_outputs.json'

export default defineNuxtPlugin({
  name: 'AmplifyAPIs',
  enforce: 'pre',

  setup() {
    // This configures Amplify on the client side of your Nuxt app
    Amplify.configure(outputs, { ssr: true })

    return {
      provide: {
        // You can add the Amplify APIs that you will use on the client side
        // of your Nuxt app here.
        //
        // You can call the API by via the composable `useNuxtApp()`. For example:
        // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
        Amplify: {
          Auth: {
            updateUserAttributes,
            signOut,
          },
        },
      },
    }
  },
})
