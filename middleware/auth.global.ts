export default defineNuxtRouteMiddleware(async (to) => {
  // skip middleware on login page
  if (to.name === 'login') {
    return
  }

  const { data } = await useFetch('/api/current-user')
  if (data && data.value) return

  return navigateTo(`/login?redirectTo=${to.path}`)
})
