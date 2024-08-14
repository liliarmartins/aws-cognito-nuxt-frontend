export const useResetUserPassword = (username: string) => {
  const isResetting = ref(false)
  const toastStore = useToastStore()
  const { showToast } = toastStore

  const resetPassword = async () => {
    isResetting.value = true
    try {
      const data = await $fetch(
        `/api/administration/users/password/${username}`,
        {
          method: 'PUT',
        },
      )
      showToast('User password reset successfully!', 'is-success')
      navigateTo('/administration/users')
      return { data }
    } catch (error) {
      isResetting.value = false
      const typedError = error as {
        data?: { statusCode?: number; message?: string }
      }
      throw createError({
        statusCode: typedError.data?.statusCode,
        message: typedError.data?.message,
        fatal: true,
      })
    }
  }

  return { resetPassword, isResetting }
}
