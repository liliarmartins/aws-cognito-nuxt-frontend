<script lang="ts" setup>
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
})

const user = ref(props.user)
const { isLoading, save } = useSaveCurrentUser()
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
