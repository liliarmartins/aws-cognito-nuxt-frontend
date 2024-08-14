export const useFetchUsersList = () => {
  const isLoading = ref(false)
  const fetchUsers = async (isActive: boolean) => {
    isLoading.value = true
    try {
      const users = await $fetch('/api/administration/users', {
        query: {
          isActive: isActive,
        },
      })
      isLoading.value = false
      return users
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

  return { fetchUsers, isLoading }
}
