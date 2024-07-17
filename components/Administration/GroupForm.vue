<script setup>
const groupName = ref('')
const nameInputError = ref(false)

const emit = defineEmits(['save'])

const save = () => {
  nameInputError.value = !groupName.value

  if (nameInputError.value) return

  emit('save', groupName.value)
}
</script>

<template>
  <div>
    <div class="field">
      <label class="label">Group name</label>
      <div class="control">
        <input
          v-model.trim="groupName"
          class="input"
          type="text"
          placeholder="Group name"
          required
        />
      </div>
      <p v-if="nameInputError" class="help is-danger">
        This field cannot be blank
      </p>
    </div>
    <div class="field is-grouped mt-5">
      <div class="control">
        <button class="button is-info" @click="save">Save</button>
      </div>
      <div class="control">
        <button class="button is-info is-light" @click="() => navigateTo('/')">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
