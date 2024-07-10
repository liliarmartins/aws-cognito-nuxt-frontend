import type { AdminGetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import {
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '~/amplify_outputs.json'

const amplifyConfig = parseAmplifyConfig(outputs)

export const getUserGroupsByUsername = async (
  username: string,
): Promise<string[]> => {
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

const getUser = async (username: string) => {
  const client = new CognitoIdentityProviderClient({})
  const command = new AdminGetUserCommand({
    Username: username,
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })
  return client.send(command)
}

const flattenUserAttributes = (user: AdminGetUserCommandOutput) => {
  return (
    user.UserAttributes?.reduce(
      (acc, attr) => {
        if (attr.Name && attr.Value) {
          acc[attr.Name] = attr.Value
        }
        return acc
      },
      {} as { [key: string]: string },
    ) || {}
  )
}

const getDetailedUserByUsername = async (username: string) => {
  const user = await getUser(username)
  const attributes = flattenUserAttributes(user)
  const groups = await getUserGroupsByUsername(username)

  const detailedUser: DetailedUser = {
    email: attributes.email,
    name: attributes.name,
    nickname: attributes.nickname,
    username: username,
    groups,
    emailVerified: attributes.email_verified === 'true',
    enabled: user.Enabled,
    createDate: user.UserCreateDate,
    lastModifiedDate: user.UserLastModifiedDate,
    status: user.UserStatus,
  }

  return detailedUser
}

export const listUsers = async () => {
  const client = new CognitoIdentityProviderClient({})
  const command = new ListUsersCommand({
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })
  const data = await client.send(command)

  return await Promise.all(
    data.Users!.map(async (user) => {
      if (!user.Username) {
        return
      }
      return await getDetailedUserByUsername(user.Username)
    }),
  )
}
