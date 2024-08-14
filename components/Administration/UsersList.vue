<script setup>
const props = defineProps({
  activeUsers: {
    type: Boolean,
    default: true,
  },
})

const users = ref([])

const { fetchUsers, isLoading } = useFetchUsersList()

users.value = await fetchUsers(props.activeUsers)

watch(
  () => props.activeUsers,
  async () => {
    users.value = await fetchUsers(props.activeUsers)
  },
)
</script>

<template>
  <div>
    <nav class="panel">
      <p class="panel-heading">
        {{ props.activeUsers ? 'Active' : 'All' }} Users
      </p>
      <NuxtLink
        v-for="user in users"
        :key="user.username"
        class="panel-block"
        :to="'/administration/users/' + user.username"
      >
        <div>
          <p class="has-text-weight-bold is-size-6">
            {{ user.name }}
          </p>
          <p class="is-size-7">{{ user.email }}</p>
          <p class="is-size-7">
            <span v-for="(group, index) in user.groups" :key="index">
              <span v-if="index"> &bull; </span>{{ group }}
            </span>
          </p>
        </div>
      </NuxtLink>
    </nav>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
