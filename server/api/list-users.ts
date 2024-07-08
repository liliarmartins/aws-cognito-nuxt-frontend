import type { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import {
  ListUsersCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '~/amplify_outputs.json'

const amplifyConfig = parseAmplifyConfig(outputs)

const getUsersWithGroups = async (data: ListUsersCommandOutput) => {
  return await Promise.all(
    data.Users!.map(async (user) => {
      const formattedUser = formatUserAttributes(user)
      const groups: string[] = user.Username
        ? await getGroupsForUser(user.Username)
        : []

      return {
        ...formattedUser,
        Groups: groups,
      }
    }),
  )
}

const listUsers = async () => {
  const client = new CognitoIdentityProviderClient({})
  const command = new ListUsersCommand({
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })
  const data = await client.send(command)

  return await getUsersWithGroups(data)
}

export default defineEventHandler(async (event) => {
  if (!(await checkIfUserAdminUser(event))) {
    throw createError({
      statusCode: 403,
      message:
        'Access Denied: User Admin privileges are required to list users.',
    })
  }

  const users = await listUsers()

  const isActive = getQuery(event).isActive === 'true'
  if (isActive) {
    return users.filter((user) => user.Enabled)
  }

  return users
})
