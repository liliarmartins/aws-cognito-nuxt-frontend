<script lang="ts" setup>
const props = defineProps({
  message: {
    type: String,
    default: 'Success',
  },
  isSuccess: {
    type: Boolean,
    default: true,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:isVisible'])

watch(
  () => props.isVisible,
  () => {
    if (props.isVisible && props.isSuccess) {
      setTimeout(() => {
        emits('update:isVisible', false)
      }, 1500)
    }
  },
)
</script>

<template>
  <div class="modal" :class="{ 'is-active': props.isVisible }">
    <div
      class="modal-background"
      @click="$emit('update:isVisible', false)"
    ></div>
    <div class="modal-content">
      <article
        class="message"
        :class="{
          'is-success': props.isSuccess,
          'is-danger': !props.isSuccess,
        }"
      >
        <div class="message-header">
          <p>{{ props.isSuccess ? 'Success' : 'Error' }}</p>
          <button
            class="delete"
            aria-label="delete"
            @click="$emit('update:isVisible', false)"
          ></button>
        </div>
        <div class="message-body">
          {{ props.message }}
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  width: 400px;
}
</style>
