<script setup>
const { status, data: groups, error } = await useFetch('/api/list-groups')
const isLoading = computed(() => status.value === 'pending')

if (error && error.value) {
  throw createError({
    statusCode: error.value.data?.statusCode,
    message: error.value.data?.message,
    fatal: true,
  })
}
</script>

<template>
  <div>
    <nav class="panel">
      <p class="panel-heading">Groups</p>
      <a v-for="group in groups" :key="group.GroupName" class="panel-block">
        <div>
          <p class="has-text-weight-bold is-size-6">
            {{ group.GroupName }}
          </p>
        </div>
      </a>
    </nav>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
