import type { H3Event, EventHandlerRequest } from 'h3'
import type { AmplifyServer, CookieStorage } from 'aws-amplify/adapter-core'
import type { LibraryOptions } from '@aws-amplify/core'
import type { UserType } from '@aws-sdk/client-cognito-identity-provider'
import {
  createKeyValueStorageFromCookieStorageAdapter,
  createUserPoolsTokenProvider,
  createAWSCredentialsAndIdentityIdProvider,
  runWithAmplifyServerContext,
} from 'aws-amplify/adapter-core'
import { getCurrentUser } from 'aws-amplify/auth/server'
import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '~/amplify_outputs.json'

const amplifyConfig = parseAmplifyConfig(outputs)

const createCookieStorageAdapter = (
  event: H3Event<EventHandlerRequest>,
): CookieStorage.Adapter => {
  // `parseCookies`, `setCookie` and `deleteCookie` are Nuxt provided functions
  const readOnlyCookies = parseCookies(event)

  return {
    get(name) {
      if (readOnlyCookies[name]) {
        return { name, value: readOnlyCookies[name] }
      }
    },
    set(name, value, options) {
      setCookie(event, name, value, options)
    },
    delete(name) {
      deleteCookie(event, name)
    },
    getAll() {
      return Object.entries(readOnlyCookies).map(([name, value]) => {
        return { name, value }
      })
    },
  }
}

const createLibraryOptions = (
  event: H3Event<EventHandlerRequest>,
): LibraryOptions => {
  const cookieStorage = createCookieStorageAdapter(event)
  const keyValueStorage =
    createKeyValueStorageFromCookieStorageAdapter(cookieStorage)
  const tokenProvider = createUserPoolsTokenProvider(
    amplifyConfig.Auth!,
    keyValueStorage,
  )
  const credentialsProvider = createAWSCredentialsAndIdentityIdProvider(
    amplifyConfig.Auth!,
    keyValueStorage,
  )

  return {
    Auth: {
      tokenProvider,
      credentialsProvider,
    },
  }
}

export const runAmplifyApi = <Result>(
  // we need the event object to create a context accordingly
  event: H3Event<EventHandlerRequest>,
  operation: (
    contextSpec: AmplifyServer.ContextSpec,
  ) => Result | Promise<Result>,
) => {
  return runWithAmplifyServerContext<Result>(
    amplifyConfig,
    createLibraryOptions(event),
    operation,
  )
}

export const getUser = async (event: H3Event<EventHandlerRequest>) => {
  return await runAmplifyApi(event, (contextSpec: AmplifyServer.ContextSpec) =>
    getCurrentUser(contextSpec),
  )
}

export const getGroupsForUser = async (username: string): Promise<string[]> => {
  const client = new CognitoIdentityProviderClient({})
  const command = new AdminListGroupsForUserCommand({
    Username: username,
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })
  const data = await client.send(command)

  if (!data.Groups) return []

  return data.Groups.map((group) => group.GroupName).filter(
    (name): name is string => !!name,
  )
}

export const getGroupsForCurrentUser = async (
  event: H3Event<EventHandlerRequest>,
): Promise<Array<string | undefined>> => {
  const user = await getUser(event)

  return getGroupsForUser(user.username)
}

export const checkIfUserAdminUser = async (
  event: H3Event<EventHandlerRequest>,
): Promise<boolean> => {
  const groups = await getGroupsForCurrentUser(event)
  return groups.includes('SUPER_ADMIN') || groups.includes('USER_ADMIN')
}

export const formatUserAttributes = (user: UserType) => {
  const userAttributes =
    user.Attributes?.reduce(
      (acc, attr) => {
        if (attr.Name && attr.Value) {
          acc[attr.Name] = attr.Value
        }
        return acc
      },
      {} as { [key: string]: string },
    ) || {}

  return {
    Email: userAttributes.email,
    EmailVerified: userAttributes.email_verified === 'true',
    Nickname: userAttributes.nickname,
    Name: userAttributes.name,
    Username: user.Username,
    Enabled: user.Enabled,
    UserCreateDate: user.UserCreateDate,
    UserLastModifiedDate: user.UserLastModifiedDate,
    UserStatus: user.UserStatus,
  }
}
