export const useSaveGroup = () => {
  const isLoading = ref(false)
  const toastStore = useToastStore()
  const { showToast } = toastStore

  const save = async (groupName: string) => {
    isLoading.value = true
    try {
      const { data, error } = await useFetch('/api/administration/groups', {
        method: 'POST',
        body: {
          name: groupName,
        },
      })

      if (error && error.value) {
        throw createError({
          statusCode: error.value.data?.statusCode,
          message: error.value.data?.message,
          fatal: true,
        })
      }

      if (data && data.value) {
        showToast('Group created successfully!', 'is-success')
      }

      navigateTo('/administration/groups')
    } catch (err) {
      isLoading.value = false
      showToast('Failed to create group', 'is-danger')
      throw err
    }
  }

  return {
    isLoading,
    save,
  }
}
