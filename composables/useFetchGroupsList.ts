export const useFetchGroupsList = async () => {
  const groups = ref<string[]>([])
  const { status, data, error } = await useFetch('/api/administration/groups')
  const isLoading = computed(() => status.value === 'pending')

  if (data && data.value) {
    groups.value = data.value
  }

  if (error && error.value) {
    throw createError({
      statusCode: error.value.data?.statusCode,
      message: error.value.data?.message,
      fatal: true,
    })
  }

  return { groups, isLoading }
}
