<script lang="ts" setup>
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
})

const user = ref(props.user)
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
  } finally {
    isLoading.value = false
    navigateTo('/')
  }
}
</script>

<template>
  <div v-if="user">
    <CurrentUserProfileForm
      :name="user.name"
      :nickname="user.nickname"
      @save="save"
      @cancel="() => navigateTo('/')"
    />
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>

<style scoped></style>
