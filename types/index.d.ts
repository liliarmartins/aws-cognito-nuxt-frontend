import type { UserStatusType } from '@aws-sdk/client-cognito-identity-provider'

declare global {
  interface TinyUser {
    email?: string
    name?: string
    nickname?: string
    username?: string
  }

  interface UserWithGroups extends TinyUser {
    groups?: string[]
  }

  interface DetailedUser extends UserWithGroups {
    emailVerified?: boolean
    enabled?: boolean
    createDate?: Date
    lastModifiedDate?: Date
    status?: UserStatusType
  }
}

export {}
