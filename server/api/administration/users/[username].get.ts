export default defineEventHandler(async (event): Promise<DetailedUser> => {
  if (!(await checkIfAuthUserIsUserAdmin(event))) {
    throw createError({
      statusCode: 403,
      message:
        "Access Denied: User Admin privileges are required to get a user's detail.",
    })
  }

  const username = getRouterParam(event, 'username')

  if (!username) {
    throw createError({
      statusCode: 400,
      message: 'Username could not be defined',
    })
  }

  try {
    const user = await getDetailedUserByUsername(username)
    return user
  } catch (error) {
    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error),
    })
  }
})
