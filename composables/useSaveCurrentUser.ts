export const useSaveCurrentUser = () => {
  const isLoading = ref(false)
  const toastStore = useToastStore()
  const { showToast } = toastStore

  const save = async (name: string, nickname: string) => {
    isLoading.value = true
    try {
      await useNuxtApp().$Amplify.Auth.updateUserAttributes({
        userAttributes: {
          name,
          nickname,
        },
      })

      useUpdateUserStore()
      showToast('Profile updated successfully!', 'is-success')
    } catch (error) {
      showToast('Failed to update profile', 'is-danger')
      isLoading.value = false
    } finally {
      navigateTo('/')
    }
  }

  return {
    isLoading,
    save,
  }
}
