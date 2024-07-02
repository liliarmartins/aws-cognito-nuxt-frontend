import {
  ListUsersCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '~/amplify_outputs.json'

export default defineEventHandler(async (event) => {
  const amplifyConfig = parseAmplifyConfig(outputs)

  if (!(await checkIfUserAdminUser(event))) {
    setResponseStatus(event, 403)
    return {
      error: 'Access denied: You should be a User Admin to list users',
    }
  }

  const listUsers = () => {
    const client = new CognitoIdentityProviderClient({})

    const command = new ListUsersCommand({
      UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
    })

    return client.send(command)
  }

  return listUsers()
})
