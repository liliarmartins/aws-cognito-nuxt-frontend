import {
  CognitoIdentityProviderClient,
  CreateGroupCommand,
  ListGroupsCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '~/amplify_outputs.json'

const amplifyConfig = parseAmplifyConfig(outputs)

export const listGroups = async () => {
  const client = new CognitoIdentityProviderClient({})
  const command = new ListGroupsCommand({
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })
  const data = await client.send(command)

  return data.Groups
}

export const createGroup = async (groupName: string) => {
  const client = new CognitoIdentityProviderClient({})
  const command = new CreateGroupCommand({
    GroupName: groupName,
    UserPoolId: amplifyConfig.Auth?.Cognito.userPoolId,
  })
  return await client.send(command)
}
