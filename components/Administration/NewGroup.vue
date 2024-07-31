<script setup>
const { isLoading, save } = useSaveGroup()
</script>

<template>
  <div class="columns">
    <div class="column">
      <AdministrationGroupForm @save="save" />
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
