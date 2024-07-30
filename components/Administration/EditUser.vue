<script lang="ts" setup>
const props = defineProps({
  username: {
    type: String,
    required: true,
  },
})

const { user, isLoading } = await useFetchUser(props.username)
const { save, isSaving } = useSaveUser(props.username)
</script>

<template>
  <div class="columns">
    <div v-if="user" class="column">
      <AdministrationEditUserForm :user="user" @save="save" />
    </div>
    <LoadingSpinner v-if="isLoading || isSaving" />
  </div>
</template>
