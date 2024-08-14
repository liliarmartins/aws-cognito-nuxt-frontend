<script lang="ts" setup>
const props = defineProps({
  user: {
    type: Object as PropType<DetailedUser>,
    required: true,
  },
})

const seeMore = ref(false)

const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'Date not available'
  if (date instanceof Date) return date.toDateString()
  return new Date(date).toDateString()
}
</script>

<template>
  <div>
    <button
      v-if="seeMore"
      class="button is-small is-rounded"
      @click="() => (seeMore = false)"
    >
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'circle-chevron-down']" />
      </span>
      <span>See less</span>
    </button>
    <button
      v-else
      class="button is-small is-rounded"
      @click="() => (seeMore = true)"
    >
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'circle-chevron-right']" />
      </span>
      <span>See more</span>
    </button>
    <div v-if="seeMore" class="box">
      <p>
        <strong>Cognito user id: </strong>
        {{ props.user.username }}
        <br />
        <strong>Created date: </strong>
        {{ formatDate(props.user.createDate) }}
        <br />
        <strong>Last modified date: </strong>
        {{ formatDate(props.user.lastModifiedDate) }}
        <br />
        <strong>Email verified?: </strong>
        {{ props.user.emailVerified }}
        <br />
        <strong>Status: </strong>
        {{ props.user.status }}
      </p>
    </div>
  </div>
</template>
