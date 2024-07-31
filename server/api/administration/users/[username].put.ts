import { getErrorStatusCode } from '~/server/utils/handleErrorUtils'

export default defineEventHandler(async (event): Promise<DetailedUser> => {
  if (!(await checkIfAuthUserIsUserAdmin(event))) {
    throw createError({
      statusCode: 403,
      message:
        'Access Denied: User Admin privileges are required to edit a user.',
    })
  }

  const username = getRouterParam(event, 'username')

  if (!username) {
    throw createError({
      statusCode: 400,
      message: 'Username could not be defined',
    })
  }

  const body = await readBody<{
    email: string
    name: string
    nickname: string
    enabled: boolean
    groups: string[]
  }>(event)
  const { email, name, nickname, enabled, groups } = body
  if (!email || !name || !nickname) {
    throw createError({
      statusCode: 400,
      message: 'Email, name and nickname are required',
    })
  }

  try {
    return updateUser(username, email, name, nickname, enabled, groups)
  } catch (error) {
    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error),
    })
  }
})
