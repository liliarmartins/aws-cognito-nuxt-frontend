import type { H3Event, EventHandlerRequest } from 'h3'
import type { AmplifyServer } from 'aws-amplify/adapter-core'
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth/server'
import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '~/amplify_outputs.json'

const amplifyConfig = parseAmplifyConfig(outputs)

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
  const client = new CognitoIdentityProviderClient({})
  const command = new AdminListGroupsForUserCommand({
    Username: authUser.username,
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })
  const data = await client.send(command)

  if (!data.Groups) return []

  return data.Groups.map((group) => group.GroupName).filter(
    (name): name is string => !!name,
  )
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
