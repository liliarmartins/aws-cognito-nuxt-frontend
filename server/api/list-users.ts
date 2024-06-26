import {
  ListUsersCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '~/amplify_outputs.json'

const amplifyConfig = parseAmplifyConfig(outputs)

export default defineEventHandler(async () => {
  const listUsers = () => {
    const client = new CognitoIdentityProviderClient({})

    const command = new ListUsersCommand({
      UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
    })

    return client.send(command)
  }

  return listUsers()
})
