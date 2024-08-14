export const useSaveNewUser = () => {
  const isLoading = ref(false)
  const toastStore = useToastStore()
  const { showToast } = toastStore

  const save = async (email: string, name: string, nickname: string) => {
    isLoading.value = true
    try {
      const data = await $fetch('/api/administration/users', {
        method: 'POST',
        body: { email, name, nickname },
      })
      showToast('User created successfully!', 'is-success')
      navigateTo('/administration/users')
      return { data }
    } catch (error) {
      isLoading.value = false
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

  return { save, isLoading }
}
