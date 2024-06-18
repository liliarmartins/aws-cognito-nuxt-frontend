<script lang="ts" setup>
const toastStore = useToastStore()
watch(
  () => toastStore.isVisible,
  () => {
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
    <div class="message-content">
      {{ toastStore.toastMessage }}
      <button class="delete" @click="toastStore.hideToast()"></button>
    </div>
  </div>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 55px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  max-width: 400px;
  min-width: 200px;
  padding: 10px 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.message-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.message-content .delete {
  margin-left: 20px;
}
</style>
