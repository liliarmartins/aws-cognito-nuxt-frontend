<script setup>
const user = ref(null)
const getUser = async () => {
  const userAttributes = await useNuxtApp().$Amplify.Auth.fetchUserAttributes()
  console.log(userAttributes)
  user.value = {
    name: userAttributes.name,
    email: userAttributes.email,
    nickname: userAttributes.nickname,
  }
}
getUser()

const logout = async () => {
  await useNuxtApp().$Amplify.Auth.signOut()
  navigateTo('/login')
}

const hideNav = ref(true)
const hideUserDropdown = ref(true)

const hideAll = () => {
  hideNav.value = true
  hideUserDropdown.value = true
}
</script>

<template>
  <nav class="navbar is-info" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <nuxt-link class="navbar-item" to="/" @click="hideAll()">
        <img src="/l-square-logo.png" />
      </nuxt-link>

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
      </div>
      <div class="navbar-end">
        <div
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
                Welcome<br />
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
            <NuxtLink
              class="navbar-item"
              to="/currentUser/editPassword"
              @click="hideAll"
            >
              <span class="icon-text">
                <span class="icon">
                  <font-awesome-icon :icon="['fas', 'key']" />
                </span>
                <span>Edit Password</span>
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
</template>

<style scoped></style>
