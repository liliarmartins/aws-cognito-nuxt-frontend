<script setup>
const email = ref('')
const emailInputFormatError = ref(false)
const emailInputBlankError = ref(false)
const name = ref('')
const nameInputError = ref(false)
const nickname = ref('')
const nicknameInputError = ref(false)

const emit = defineEmits(['save'])

const save = () => {
  const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  emailInputFormatError.value = email.value && !email.value.match(mailFormat)
  emailInputBlankError.value = !email.value
  nameInputError.value = !name.value
  nicknameInputError.value = !nickname.value

  if (
    emailInputFormatError.value ||
    emailInputBlankError.value ||
    nameInputError.value ||
    nicknameInputError.value
  ) {
    return
  }

  emit('save', email.value, name.value, nickname.value)
}
</script>

<template>
  <div>
    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input
          v-model.trim="email"
          class="input"
          type="email"
          placeholder="Email"
          required
        />
      </div>
      <p v-if="emailInputBlankError" class="help is-danger">
        This field cannot be blank
      </p>
      <p v-if="emailInputFormatError" class="help is-danger">
        Invalid email address
      </p>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          v-model.trim="name"
          class="input"
          type="text"
          placeholder="Name"
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
      </div>
      <p v-if="nicknameInputError" class="help is-danger">
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
