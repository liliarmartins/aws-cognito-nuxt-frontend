export default defineNuxtRouteMiddleware(async (to) => {
  // skip middleware on login page
  if (to.name === 'login') return

  try {
    const data = await $fetch('/api/current-user')
    if (data) return
  } catch (error) {
    return navigateTo(`/login?redirectTo=${to.path}`)
  }
})
