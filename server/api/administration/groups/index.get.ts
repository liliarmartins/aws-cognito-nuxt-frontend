export default defineEventHandler(async (event) => {
  if (!(await checkIfAuthUserIsGroupAdmin(event))) {
    throw createError({
      statusCode: 403,
      message:
        'Access Denied: Group Admin privileges are required to list groups.',
    })
  }

  return await listGroups()
})
