<script lang="ts" setup>
const isLoading = ref(false)
const userStore = useUserStore()
const user = userStore.getUser()
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
    <div class="container">
      <div class="box">
        <div class="columns">
          <div class="column is-5-tablet is-6-desktop is-6-widescreen">
            <h4 class="title is-4">Edit Profile</h4>
            <CurrentUserEditProfile
              :name="user.name"
              :nickname="user.nickname"
              @save="save"
              @cancel="() => navigateTo('/')"
            />
            <LoadingSpinner v-if="isLoading" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
