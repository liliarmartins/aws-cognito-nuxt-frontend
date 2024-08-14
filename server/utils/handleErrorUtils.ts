import { CognitoIdentityProviderServiceException } from '@aws-sdk/client-cognito-identity-provider'

export const getErrorMessage = (error: unknown) => {
  if (error instanceof CognitoIdentityProviderServiceException)
    return error.message
  if (error instanceof Error) return error.message
  return String(error)
}

export const getErrorStatusCode = (error: unknown) => {
  if (error instanceof CognitoIdentityProviderServiceException)
    return error.$response?.statusCode || 500
  return 500
}
