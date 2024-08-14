export default defineEventHandler(async (event) => {
  if (!(await checkIfAuthUserIsGroupAdmin(event))) {
    throw createError({
      statusCode: 403,
      message:
        'Access Denied: Group Admin privileges are required to create group.',
    })
  }

  const body = await readBody<{ name: string }>(event)
  const { name } = body
  if (!name) {
    throw createError({
      statusCode: 400,
      message: 'Group name is required',
    })
  }

  const data = await createGroup(name).catch((error) => {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    })
  })

  return data.Group
})
