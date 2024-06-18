<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  nickname: {
    type: String,
    default: '',
  },
})

const name = ref(props.name)
const nickname = ref(props.nickname)
const nameInputError = ref(false)
const nicknameInputError = ref(false)
const emit = defineEmits(['save', 'cancel'])

const save = () => {
  nameInputError.value = !name.value
  nicknameInputError.value = !nickname.value

  if (nameInputError.value || nicknameInputError.value) {
    return
  }

  emit('save', name.value, nickname.value)
}
</script>

<template>
  <div>
    <div>
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input
            v-model.trim="name"
            class="input"
            type="text"
            placeholder="Full name"
            required
          />
        </div>
        <p v-if="nameInputError" class="help is-danger">
          This field cannot be blank
        </p>
      </div>
      <div class="field">
        <label class="label">Nickname</label>
        <div class="control">
          <input
            v-model.trim="nickname"
            class="input"
            type="text"
            placeholder="Nickname"
            required
          />
          <p v-if="nicknameInputError" class="help is-danger">
            This field cannot be blank
          </p>
        </div>
      </div>
      <div class="field is-grouped mt-5">
        <div class="control">
          <button class="button is-info" @click="save">Save</button>
        </div>
        <div class="control">
          <button
            class="button is-info is-light"
            @click="() => $emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
