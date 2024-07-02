import type { H3Event, EventHandlerRequest } from 'h3'
import type { AmplifyServer, CookieStorage } from 'aws-amplify/adapter-core'
import type { LibraryOptions } from '@aws-amplify/core'
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

export const getGroupsForUser = async (
  event: H3Event<EventHandlerRequest>,
): Promise<Array<string | undefined>> => {
  const client = new CognitoIdentityProviderClient({})

  const user = await getUser(event)

  const command = new AdminListGroupsForUserCommand({
    Username: user.username,
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })

  const data = await client.send(command)
  return data.Groups?.map((group) => group.GroupName) ?? []
}

export const checkIfUserAdminUser = async (
  event: H3Event<EventHandlerRequest>,
): Promise<boolean> => {
  const groups = await getGroupsForUser(event)
  return groups.includes('SUPER_ADMIN') || groups.includes('USER_ADMIN')
}
