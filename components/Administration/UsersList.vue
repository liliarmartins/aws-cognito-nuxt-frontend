<script setup>
const props = defineProps({
  activeUsers: {
    type: Boolean,
    default: true,
  },
})

const isLoading = ref(false)
const users = ref([])

const getUsers = async () => {
  users.value = []
  isLoading.value = true
  const url = '/api/list-users' + (props.activeUsers ? '?isActive=true' : '')

  const { data, error } = await useFetch(url)

  if (error && error.value) {
    isLoading.value = false
    throw createError({
      statusCode: error.value.statusCode,
      message: error.value.message,
      fatal: true,
    })
  }

  if (data && data.value) {
    users.value = data.value.content
    isLoading.value = false
  }
}

watch(
  () => props.activeUsers,
  () => getUsers(),
  { immediate: true },
)
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
