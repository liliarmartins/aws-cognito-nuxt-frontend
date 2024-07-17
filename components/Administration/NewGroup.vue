<script setup>
const isLoading = ref(false)
const toastStore = useToastStore()
const { showToast } = toastStore

const save = async (groupName) => {
  isLoading.value = true
  const { data, error } = await useFetch('/api/administration/groups', {
    method: 'POST',
    body: {
      name: groupName,
    },
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
    showToast('Group created successfully!', 'is-success')
  }

  navigateTo('/administration/groups')
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <AdministrationGroupForm @save="save" />
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
