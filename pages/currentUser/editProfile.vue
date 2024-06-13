<script lang="ts" setup>
import {
  fetchUserAttributes,
  updateUserAttributes,
  type FetchUserAttributesOutput,
} from 'aws-amplify/auth'

const success = ref(false)
const isLoading = ref(false)
const user = ref<FetchUserAttributesOutput | null>(null)
const getUser = async () => {
  user.value = await fetchUserAttributes()
}
getUser()

const save = async (name: string, nickname: string) => {
  if (!user.value) {
    throw createError({
      statusCode: 401,
      message: 'Could not find current user information',
      fatal: true,
    })
  }

  isLoading.value = true
  const updateOutput = await updateUserAttributes({
    userAttributes: {
      email: user.value.email,
      name,
      nickname,
    },
  })

  if (!updateOutput.isUpdated) {
    throw createError({
      statusCode: 500,
      message: 'Could not update current user profile',
      fatal: true,
    })
  }

  isLoading.value = false
  success.value = true
}
</script>

<template>
  <div v-if="user">
    <div>Edit Profile</div>
    <div class="container">
      <div v-if="!success" class="box">
        <div class="columns">
          <div class="column is-5-tablet is-6-desktop is-6-widescreen">
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
