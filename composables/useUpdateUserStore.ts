export const useUpdateUserStore = async () => {
  const userStore = useUserStore()
  try {
    const user = await $fetch('/api/current-user')
    userStore.setUser(user)
  } catch (error) {
    userStore.setUser(null)
  }
}
