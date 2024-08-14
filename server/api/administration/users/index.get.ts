export default defineEventHandler(async (event) => {
  if (!(await checkIfAuthUserIsUserAdmin(event))) {
    throw createError({
      statusCode: 403,
      message:
        'Access Denied: User Admin privileges are required to list users.',
    })
  }

  const users = await listUsers()

  const isActive = getQuery(event).isActive === 'true'
  if (isActive) {
    return users.filter((user) => user.enabled)
  }

  return users
})
