<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div class="container">
    <div class="box">
      <div class="columns">
        <div class="column is-5-tablet is-6-desktop is-6-widescreen">
          <h4 class="title is-4">Edit User</h4>
          <AdministrationEditUser :username="route.params.username as string" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
