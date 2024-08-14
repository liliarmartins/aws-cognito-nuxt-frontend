<script lang="ts" setup></script>

<template>
  <div>
    <div class="container">
      <nav class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <p class="level-item">
            <NuxtLink
              to="/administration/groups/new"
              class="button is-small is-success"
            >
              New Group
            </NuxtLink>
          </p>
        </div>
      </nav>
      <div class="box">
        <div class="columns is-centered">
          <div class="column">
            <AdministrationGroupsList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
