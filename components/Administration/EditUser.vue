<script lang="ts" setup>
const props = defineProps({
  username: {
    type: String,
    required: true,
  },
})

const user = ref<DetailedUser>({})

const { status, data, error } = await useFetch(
  '/api/administration/users/' + props.username,
)
const isLoading = computed(() => status.value === 'pending')

if (data && data.value) user.value = data.value

if (error && error.value) {
  throw createError({
    statusCode: error.value.data?.statusCode,
    message: error.value.data?.message,
    fatal: true,
  })
}

const save = async (
  email: string,
  name: string,
  nickname: string,
  enabled: boolean,
  groups: string[],
) => {
  console.log(email)
  console.log(name)
  console.log(nickname)
  console.log(enabled)
  console.log(groups)
}
</script>

<template>
  <div class="columns">
    <div v-if="data" class="column">
      <AdministrationEditUserForm :user="user" @save="save" />
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
