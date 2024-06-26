import type { AmplifyServer } from 'aws-amplify/adapter-core'
import { getCurrentUser } from 'aws-amplify/auth/server'

export default defineEventHandler(async (event) => {
  const user = await runAmplifyApi(
    event,
    (contextSpec: AmplifyServer.ContextSpec) => getCurrentUser(contextSpec),
  )

  return user
})
