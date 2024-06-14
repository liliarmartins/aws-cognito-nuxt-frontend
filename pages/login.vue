<script lang="ts" setup>
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'

definePageMeta({
  layout: false,
})

const auth = useAuthenticator()

watch(
  () => auth.user,
  (newUser) => {
    if (newUser) {
      useUpdateUserStore()
      navigateTo('/')
    }
  },
)
</script>

<template>
  <section class="hero is-info is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <Authenticator :hide-sign-up="true" />
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(.amplify-button--primary) {
  background: #1a7cb8;
  color: #fff;
}
:deep(.amplify-button--primary:hover) {
  background: #145a8a;
  color: #fff;
}
:deep(.amplify-button--link) {
  color: #1a7cb8;
}
:deep(.amplify-button--link:hover) {
  background: transparent;
  color: #1a7cb8;
}
</style>
