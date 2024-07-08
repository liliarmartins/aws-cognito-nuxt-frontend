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
        setResponseStatus(event, 401)
        return {
          error: 'Unauthorized.',
        }
      }
    } catch (error) {
      setResponseStatus(event, 502)
      return {
        error: 'Bad Gateway: Unable to Retrieve Amplify Session.',
      }
    }
  }
})
