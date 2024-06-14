<script lang="ts" setup>
import { type FetchUserAttributesOutput } from 'aws-amplify/auth'

const success = ref(false)
const isLoading = ref(false)
const user = ref<FetchUserAttributesOutput | null>(null)
const getUser = async () => {
  user.value = await useNuxtApp().$Amplify.Auth.fetchUserAttributes()
}
getUser()

const save = async (name: string, nickname: string) => {
  isLoading.value = true
  const updateOutput = await useNuxtApp().$Amplify.Auth.updateUserAttributes({
    userAttributes: {
      name,
      nickname,
    },
  })

  console.log(updateOutput)

  if (!updateOutput.name.isUpdated) {
    throw createError({
      statusCode: 500,
      message: 'Could not update current user profile',
      fatal: true,
    })
  }

  isLoading.value = false
  success.value = true
  setTimeout(() => navigateTo('/'), 1000)
}
</script>

<template>
  <div v-if="user">
    <div class="container">
      <div v-if="!success" class="box">
        <div class="columns">
          <div class="column is-5-tablet is-6-desktop is-6-widescreen">
            <h4 class="title is-4">Edit Profile</h4>
            <CurrentUserEditProfile
              :name="user.name"
              :nickname="user.nickname"
              @save="save"
              @cancel="() => navigateTo('/')"
            />
          </div>
        </div>
      </div>
    </div>
    <ToastModal
      v-model:is-visible="success"
      message="User profile updated!"
      :is-success="true"
    />
  </div>
</template>
