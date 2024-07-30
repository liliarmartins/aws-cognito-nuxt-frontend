import type { AdminGetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
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

export const listUsers = async (): Promise<DetailedUser[]> => {
  const command = new ListUsersCommand({
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })
  const data = await client.send(command)

  if (!data.Users) return []

  const usersPromises = data.Users.map((user) => {
    if (!user.Username) {
      return undefined
    }
    return getDetailedUserByUsername(user.Username)
  })

  const users = await Promise.all(usersPromises)
  return users.filter((user): user is DetailedUser => user !== undefined)
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
  return client.send(command)
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
  return client.send(updateAttributesCommand)
}

const enableUser = async (username: string) => {
  const command = new AdminEnableUserCommand({
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
    Username: username,
  })
  return client.send(command)
}

const disableUser = async (username: string) => {
  const command = new AdminDisableUserCommand({
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
    Username: username,
  })
  return client.send(command)
}

const addUserToGroup = async (username: string, group: string) => {
  const command = new AdminAddUserToGroupCommand({
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
    Username: username,
    GroupName: group,
  })
  return client.send(command)
}

const removeUserFromGroup = async (username: string, group: string) => {
  const command = new AdminRemoveUserFromGroupCommand({
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
    Username: username,
    GroupName: group,
  })
  return client.send(command)
}

const updateGroups = async (
  username: string,
  groupsBefore: string[],
  groupsNew: string[],
) => {
  groupsNew.forEach((group) => {
    if (!groupsBefore.includes(group)) addUserToGroup(username, group)
  })

  groupsBefore.forEach((group) => {
    if (!groupsNew.includes(group)) removeUserFromGroup(username, group)
  })
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

  await updateGroups(username, userBefore.groups ?? [], groups)

  if (!userBefore.enabled && enabled) {
    await enableUser(username)
  }

  if (userBefore.enabled && !enabled) {
    await disableUser(username)
  }

  return getDetailedUserByUsername(username)
}
