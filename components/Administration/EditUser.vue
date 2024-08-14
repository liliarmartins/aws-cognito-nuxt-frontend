<script lang="ts" setup>
const props = defineProps({
  username: {
    type: String,
    required: true,
  },
})

const { user, isLoading } = await useFetchUser(props.username)
const { save, isSaving } = useSaveUser(props.username)
const { resetPassword, isResetting } = useResetUserPassword(props.username)
</script>

<template>
  <div class="columns">
    <div v-if="user" class="column">
      <AdministrationEditUserForm
        :user="user"
        @save="save"
        @reset="resetPassword"
      />
    </div>
    <LoadingSpinner v-if="isLoading || isSaving || isResetting" />
  </div>
</template>
