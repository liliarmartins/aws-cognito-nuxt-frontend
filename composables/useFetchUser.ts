export const useFetchUser = async (username: string) => {
  const user = ref<DetailedUser | null>(null)
  const { status, data, error } = await useFetch(
    `/api/administration/users/${username}`,
  )

  const isLoading = computed(() => status.value === 'pending')

  if (data && data.value) {
    user.value = data.value
  }

  if (error && error.value) {
    throw createError({
      statusCode: error.value.data?.statusCode,
      message: error.value.data?.message,
      fatal: true,
    })
  }

  return { user, isLoading }
}
