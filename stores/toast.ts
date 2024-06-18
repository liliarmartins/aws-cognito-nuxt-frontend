export const useToastStore = defineStore('toast', () => {
  const isVisible = ref(false)
  const toastMessage = ref('')
  const toastType = ref('is-info')
  const toastDuration = ref(2500)

  const showToast = (
    message: string,
    type: string = 'is-info',
    duration: number = 2500,
  ) => {
    toastMessage.value = message
    toastType.value = type
    toastDuration.value = duration
    isVisible.value = true
  }

  const hideToast = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    toastMessage,
    toastType,
    toastDuration,
    showToast,
    hideToast,
  }
})
