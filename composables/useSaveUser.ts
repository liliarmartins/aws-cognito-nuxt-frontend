export const useSaveUser = (username: string) => {
  const isSaving = ref(false)
  const toastStore = useToastStore()
  const { showToast } = toastStore

  const save = async (
    email: string,
    name: string,
    nickname: string,
    enabled: boolean,
    groups: string[],
  ) => {
    isSaving.value = true
    try {
      const data = await $fetch(`/api/administration/users/${username}`, {
        method: 'PUT',
        body: { email, name, nickname, enabled, groups },
      })
      showToast('User saved successfully!', 'is-success')
      useUpdateUserStore()
      navigateTo('/administration/users')
      return { data }
    } catch (error) {
      isSaving.value = false
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

  return { save, isSaving }
}
