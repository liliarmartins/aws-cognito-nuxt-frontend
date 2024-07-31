<script setup>
const { groups, isLoading } = await useFetchGroupsList()
</script>

<template>
  <div>
    <nav class="panel">
      <p class="panel-heading">Groups</p>
      <a v-for="(group, index) in groups" :key="index" class="panel-block">
        <div>
          <p class="has-text-weight-bold is-size-6">
            {{ group }}
          </p>
        </div>
      </a>
    </nav>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
