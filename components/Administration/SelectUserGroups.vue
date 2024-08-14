<script lang="ts" setup>
const props = defineProps({
  availableGroups: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  userGroups: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const unselectedGroups = ref(props.availableGroups)
unselectedGroups.value.sort()
const selectedGroups = ref(props.userGroups)
selectedGroups.value.sort()
const isActiveDropdown = ref(false)
const emit = defineEmits(['change'])

const selectGroup = (targetGroup: string) => {
  selectedGroups.value.push(targetGroup)
  selectedGroups.value.sort()

  unselectedGroups.value = unselectedGroups.value.filter(
    (group) => group !== targetGroup,
  )

  isActiveDropdown.value = false

  emit('change', selectedGroups.value)
}

const unselectGroup = (targetGroup: string) => {
  unselectedGroups.value.push(targetGroup)
  unselectedGroups.value.sort()

  selectedGroups.value = selectedGroups.value.filter(
    (group) => group !== targetGroup,
  )

  emit('change', selectedGroups.value)
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="tags">
        <span v-if="!selectedGroups.length"> -- no groups selected</span>
        <span
          v-for="(group, index) in selectedGroups"
          :key="index"
          class="tag is-info is-light is-medium"
        >
          {{ group }}
          <button
            class="delete is-small"
            @click="unselectGroup(group)"
          ></button>
        </span>
      </div>
      <div
        class="dropdown"
        :class="isActiveDropdown ? 'is-active' : ''"
        @mouseleave="() => (isActiveDropdown = false)"
      >
        <div
          class="dropdown-trigger"
          @click="() => (isActiveDropdown = !isActiveDropdown)"
        >
          <button
            class="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>Select User Groups</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div id="dropdown-menu" class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a
              v-for="(group, index) in unselectedGroups"
              :key="index"
              class="dropdown-item"
              @click="selectGroup(group)"
            >
              {{ group }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tags {
  min-height: 2.5em;
}
.dropdown-content {
  max-height: 15em;
  overflow: auto;
}
</style>
