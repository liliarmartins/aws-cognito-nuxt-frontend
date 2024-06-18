export const useUpdateUserStore = async () => {
  const user = await useNuxtApp().$Amplify.Auth.fetchUserAttributes()
  const userStore = useUserStore()
  userStore.setUser(user)
}
