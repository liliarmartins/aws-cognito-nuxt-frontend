<script setup>
const props = defineProps({
  activeUsers: {
    type: Boolean,
    default: true,
  },
})

const isActive = computed(() => props.activeUsers)

const {
  status,
  data: users,
  error,
} = await useFetch('/api/list-users', {
  query: {
    isActive: isActive,
  },
})
const isLoading = computed(() => status.value === 'pending')
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.message,
    fatal: true,
  })
}
</script>

<template>
  <div>
    <nav class="panel">
      <p class="panel-heading">
        {{ props.activeUsers ? 'Active' : 'All' }} Users
      </p>
      <a v-for="user in users" :key="user.Username" class="panel-block">
        <div>
          <p class="has-text-weight-bold is-size-6">
            {{ user.Name }}
          </p>
          <p class="is-size-7">{{ user.Email }}</p>
          <p class="is-size-7">
            <span v-for="(group, index) in user.Groups" :key="index">
              <span v-if="index"> &bull; </span>{{ group }}
            </span>
          </p>
        </div>
      </a>
    </nav>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
