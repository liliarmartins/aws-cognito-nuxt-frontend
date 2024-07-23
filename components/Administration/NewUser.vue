<script setup>
const isLoading = ref(false)
const toastStore = useToastStore()
const { showToast } = toastStore

const save = async (email, name, nickname) => {
  isLoading.value = true
  const { data, error } = await useFetch('/api/administration/users', {
    method: 'POST',
    body: { email, name, nickname },
  })
  isLoading.value = false

  if (error && error.value) {
    throw createError({
      statusCode: error.value.data?.statusCode,
      message: error.value.data?.message,
      fatal: true,
    })
  }

  if (data && data.value) {
    showToast('User created successfully!', 'is-success')
  }

  navigateTo('/administration/users')
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <AdministrationNewUserForm @save="save" />
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
