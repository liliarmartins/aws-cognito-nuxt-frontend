<script setup>
const user = ref(null)
const userStore = useUserStore()
watch(
  () => userStore.getUser(),
  () => {
    user.value = userStore.getUser()
  },
  { immediate: true },
)

const isSuperAdmin = computed(
  () => user.value && user.value.groups.includes('SUPER_ADMIN'),
)

const isUserAdmin = computed(
  () => user.value && user.value.groups.includes('USERS_ADMIN'),
)

const isGroupAdmin = computed(
  () => user.value && user.value.groups.includes('USER_GROUPS_ADMIN'),
)

const logout = async () => {
  await useNuxtApp().$Amplify.Auth.signOut()
  navigateTo('/login')
}

const hideNav = ref(true)
const hideAdminDropdown = ref(true)
const hideUserDropdown = ref(true)

const hideAll = () => {
  hideNav.value = true
  hideAdminDropdown.value = true
  hideUserDropdown.value = true
}
</script>

<template>
  <div>
    <nav class="navbar is-info" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <NuxtLink class="navbar-item" to="/" @click="hideAll()">
          <img src="/l-square-logo.png" />
        </NuxtLink>

        <a
          role="button"
          class="navbar-burger"
          :class="hideNav || 'is-active'"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarDataTarget"
          @click="hideNav = !hideNav"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarDataTarget"
        class="navbar-menu"
        :class="hideNav || 'is-active'"
      >
        <div class="navbar-start">
          <NuxtLink class="navbar-item" to="/" @click="hideAll()">
            <span class="icon-text">
              <span class="icon">
                <font-awesome-icon :icon="['fas', 'home']" />
              </span>
              <span>Home</span>
            </span>
          </NuxtLink>
          <div
            v-if="isSuperAdmin || isUserAdmin"
            class="navbar-item has-dropdown"
            :class="hideAdminDropdown || 'is-active'"
            @mouseover="() => (hideAdminDropdown = false)"
            @mouseout="() => (hideAdminDropdown = true)"
          >
            <a class="navbar-link">
              <span class="icon-text">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />
                </span>
                <span>Administration</span>
              </span>
            </a>
            <div class="navbar-dropdown">
              <NuxtLink
                v-if="isSuperAdmin || isUserAdmin"
                class="navbar-item"
                to="/administration/users"
                @click="hideAll"
              >
                <span class="icon-text">
                  <span class="icon">
                    <i class="fa fa-users"></i>
                  </span>
                  <span>Users</span>
                </span>
              </NuxtLink>
              <NuxtLink
                v-if="isSuperAdmin || isGroupAdmin"
                class="navbar-item"
                to="/administration/groups"
                @click="hideAll"
              >
                <span class="icon-text">
                  <span class="icon">
                    <i class="fa fa-users"></i>
                  </span>
                  <span>Groups</span>
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div
            v-if="user"
            class="navbar-item has-dropdown"
            :class="hideUserDropdown || 'is-active'"
            @mouseover="() => (hideUserDropdown = false)"
            @mouseout="() => (hideUserDropdown = true)"
          >
            <a class="navbar-link">
              <span class="icon-text">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'user']" />
                </span>
                <span v-if="user && user.nickname">
                  {{ user.nickname }}
                </span>
              </span>
            </a>

            <div class="navbar-dropdown is-right">
              <div class="navbar-item has-background-info-light">
                <p>
                  Welcome
                  <br />
                  <span v-if="user && user.name">{{ user.name }}</span>
                  <br />
                  <span v-if="user && user.email">{{ user.email }}</span>
                </p>
              </div>

              <hr class="navbar-divider" />
              <NuxtLink
                class="navbar-item"
                to="/currentUser/editProfile"
                @click="hideAll"
              >
                <span class="icon-text">
                  <span class="icon">
                    <font-awesome-icon :icon="['fas', 'user']" />
                  </span>
                  <span>Edit Profile</span>
                </span>
              </NuxtLink>
              <a class="navbar-item" @click="logout()">
                <span class="icon-text">
                  <span class="icon">
                    <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
                  </span>
                  <span>Logout</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped></style>
