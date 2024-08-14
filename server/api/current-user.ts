export default defineEventHandler(async (event) => {
  return await getAuthUserWithGroups(event)
})
