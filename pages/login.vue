<script lang="ts" setup>
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'

definePageMeta({
  layout: false,
})

const { query } = useRoute()
const auth = useAuthenticator()

watch(
  () => auth.user,
  async (newUser) => {
    if (newUser) {
      useUpdateUserStore()
      const redirectTo = Array.isArray(query.redirectTo)
        ? query.redirectTo[0]
        : query.redirectTo
      await navigateTo(redirectTo, {
        replace: true,
      })
    }
  },
  { immediate: true },
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
