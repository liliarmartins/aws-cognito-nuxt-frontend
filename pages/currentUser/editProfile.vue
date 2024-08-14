<script lang="ts" setup>
const userStore = useUserStore()
const user = userStore.getUser()
</script>

<template>
  <div v-if="user">
    <div class="container">
      <div class="box">
        <div class="columns">
          <div class="column is-5-tablet is-6-desktop is-6-widescreen">
            <h4 class="title is-4">Edit Profile</h4>
            <CurrentUserEditProfile :user="user" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
