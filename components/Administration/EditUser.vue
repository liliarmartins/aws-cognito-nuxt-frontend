<script lang="ts" setup>
const isLoading = ref(false)
const user: DetailedUser = {
  email: 'test@test.com',
  name: 'User Name',
  nickname: 'nick',
  enabled: true,
  groups: ['TEST_GROUP', 'USERS_ADMIN'],
}
const save = async (email, name, nickname, enabled, groups) => {
  console.log(email)
  console.log(name)
  console.log(nickname)
  console.log(enabled)
  console.log(groups)
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <AdministrationEditUserForm :user="user" @save="save" />
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
