import type { AmplifyServer } from 'aws-amplify/adapter-core'
import { fetchAuthSession } from 'aws-amplify/auth/server'

export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/')) {
    try {
      const session = await runAmplifyApi(
        event,
        (contextSpec: AmplifyServer.ContextSpec) =>
          fetchAuthSession(contextSpec),
      )

      if (session.tokens === undefined) {
        setResponseStatus(event, 403)
        return {
          error: 'Access denied!',
        }
      }
    } catch (error) {
      setResponseStatus(event, 403)
      return {
        error: 'Access denied: Amplify Auth Middleware failed',
      }
    }
  }
})
