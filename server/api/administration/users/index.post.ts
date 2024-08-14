export default defineEventHandler(async (event) => {
  if (!(await checkIfAuthUserIsUserAdmin(event))) {
    throw createError({
      statusCode: 403,
      message:
        'Access Denied: User Admin privileges are required to create a user.',
    })
  }

  const body = await readBody<{
    email: string
    name: string
    nickname: string
  }>(event)
  const { email, name, nickname } = body
  if (!email || !name || !nickname) {
    throw createError({
      statusCode: 400,
      message: 'Email, name and nickname are required',
    })
  }

  const data = await createUser(email, name, nickname).catch((error) => {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    })
  })

  return data.User
})
