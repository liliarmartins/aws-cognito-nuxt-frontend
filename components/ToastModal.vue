<script lang="ts" setup>
const toastStore = useToastStore()
watch(
  () => toastStore.isVisible,
  () => {
    console.log(toastStore.isVisible)
    if (toastStore.isVisible) {
      setTimeout(() => toastStore.hideToast(), toastStore.toastDuration)
    }
  },
)
</script>

<template>
  <div
    v-if="toastStore.isVisible"
    :class="['notification', toastStore.toastType]"
  >
    {{ toastStore.toastMessage }}
    <button class="delete" @click="toastStore.hideToast()"></button>
  </div>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
