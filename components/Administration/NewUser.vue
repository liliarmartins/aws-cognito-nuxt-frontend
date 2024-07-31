<script setup>
const { save, isLoading } = useSaveNewUser()
</script>

<template>
  <div class="columns">
    <div class="column">
      <AdministrationNewUserForm @save="save" />
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
