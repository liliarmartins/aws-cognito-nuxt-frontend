<script lang="ts" setup>
const activeUsers = ref(true)
</script>

<template>
  <div>
    <div class="container">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="tabs">
              <ul>
                <li
                  :class="!activeUsers || 'is-active'"
                  @click="activeUsers = true"
                >
                  <a>Active</a>
                </li>
                <li
                  :class="activeUsers || 'is-active'"
                  @click="activeUsers = false"
                >
                  <a>All</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="level-right">
          <p class="level-item">
            <NuxtLink
              to="/administration/users/new"
              class="button is-small is-success"
            >
              New User
            </NuxtLink>
          </p>
        </div>
      </nav>
      <div class="box">
        <div class="columns is-centered">
          <div class="column">
            <AdministrationUsersList :active-users="activeUsers" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
