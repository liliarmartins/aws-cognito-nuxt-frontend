import type { H3Event, EventHandlerRequest } from 'h3'
import type { AmplifyServer } from 'aws-amplify/adapter-core'
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth/server'

const getAuthUser = async (event: H3Event<EventHandlerRequest>) => {
  return await runAmplifyApi(event, (contextSpec: AmplifyServer.ContextSpec) =>
    getCurrentUser(contextSpec),
  )
}

const getAuthUserAttributes = async (event: H3Event<EventHandlerRequest>) => {
  return await runAmplifyApi(event, (contextSpec: AmplifyServer.ContextSpec) =>
    fetchUserAttributes(contextSpec),
  )
}

const getTinyAuthUser = async (event: H3Event<EventHandlerRequest>) => {
  const attributes = await getAuthUserAttributes(event)
  const tinyUser: TinyUser = {
    email: attributes.email,
    name: attributes.name,
    nickname: attributes.nickname,
    username: attributes.sub,
  }

  return tinyUser
}

const getAuthUserGroups = async (
  event: H3Event<EventHandlerRequest>,
): Promise<string[]> => {
  const authUser = await getAuthUser(event)
  return getUserGroupsByUsername(authUser.username)
}

export const getAuthUserWithGroups = async (
  event: H3Event<EventHandlerRequest>,
) => {
  const tinyUser = await getTinyAuthUser(event)
  const groups = await getAuthUserGroups(event)
  const userWithGroups: UserWithGroups = {
    ...tinyUser,
    groups,
  }

  return userWithGroups
}

export const checkIfAuthUserIsUserAdmin = async (
  event: H3Event<EventHandlerRequest>,
): Promise<boolean> => {
  const groups = await getAuthUserGroups(event)
  return groups.includes('SUPER_ADMIN') || groups.includes('USER_ADMIN')
}
