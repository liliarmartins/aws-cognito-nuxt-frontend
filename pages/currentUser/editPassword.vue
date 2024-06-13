<script setup>
const id = ref(null)
const success = ref(false)
const isloading = ref(false)

const userStore = useUserStore()
const user = userStore.getUser()
if (user) {
  id.value = user.id
}

const save = async (password) => {
  isloading.value = true
  const { data, error } = await useFetch('/api/currentUser/password', {
    method: 'POST',
    body: { id: id.value, password },
  })

  if (error && error.value) {
    throw createError({
      statusCode: error.value.statusCode,
      message: error.value.message,
      fatal: true,
    })
  }

  if (data && data.value) {
    isloading.value = false
    success.value = true
    setTimeout(() => navigateTo('/'), 1000)
  }
}
</script>

<template>
  <div>
    <nav class="breadcrumb is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/">
            <span class="icon is-small">
              <i class="fa fa-home" aria-hidden="true"></i>
            </span>
            <span>Home</span>
          </nuxt-link>
        </li>
        <li class="is-active">
          <a href="#" aria-current="page">
            <span class="icon is-small">
              <i class="fa fa-key" aria-hidden="true"></i>
            </span>
            <span>Edit Password</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="container">
      <div v-if="!success" class="box">
        <div class="columns">
          <div class="column is-5-tablet is-6-desktop is-6-widescreen">
            <CurrentUserEditPassword
              @save="save"
              @cancel="() => navigateTo('/')"
            />
          </div>
        </div>
      </div>
      <div>
        <SuccessMessageModal :success="success" />
        <div v-if="isloading" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
      </div>
    </div>
  </div>
</template>
