<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div class="container">
    <div class="box">
      <div class="columns">
        <div class="column is-5-tablet is-6-desktop is-6-widescreen">
          <h4 class="title is-4">Edit User</h4>
          <h6 class="subtitle is-6">
            Cognito user id: {{ route.params.username }}
          </h6>
          <AdministrationEditUser :username="route.params.username as string" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
