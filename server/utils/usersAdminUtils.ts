import type { AdminGetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import {
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '~/amplify_outputs.json'

const amplifyConfig = parseAmplifyConfig(outputs)
const client = new CognitoIdentityProviderClient({})

export const getUserGroupsByUsername = async (
  username: string,
): Promise<string[]> => {
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

export const getDetailedUserByUsername = async (username: string) => {
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

export const createUser = async (
  email: string,
  name: string,
  nickname: string,
) => {
  const command = new AdminCreateUserCommand({
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'name',
        Value: name,
      },
      {
        Name: 'nickname',
        Value: nickname,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
    Username: email,
  })
  return await client.send(command)
}

const updateUserAttributes = async (
  email: string,
  name: string,
  nickname: string,
) => {
  const updateAttributesCommand = new AdminUpdateUserAttributesCommand({
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'name',
        Value: name,
      },
      {
        Name: 'nickname',
        Value: nickname,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
    Username: email,
  })
  return await client.send(updateAttributesCommand)
}

export const updateUser = async (
  username: string,
  email: string,
  name: string,
  nickname: string,
  enabled: boolean,
  groups: string[],
) => {
  const userBefore = await getDetailedUserByUsername(username)
  if (
    userBefore.email !== email ||
    userBefore.name !== name ||
    userBefore.nickname !== nickname
  ) {
    await updateUserAttributes(email, name, nickname)
  }

  // TODO update enabled and groups
}
