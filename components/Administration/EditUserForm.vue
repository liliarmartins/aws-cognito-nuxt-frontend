<script lang="ts" setup>
const props = defineProps({
  user: {
    type: Object as PropType<DetailedUser>,
    required: true,
  },
})

const email = ref(props.user.email)
const emailInputFormatError = ref(false)
const emailInputBlankError = ref(false)
const name = ref(props.user.name)
const nameInputError = ref(false)
const nickname = ref(props.user.nickname)
const nicknameInputError = ref(false)
const enabled = ref(props.user.enabled)
const { groups: allGroups, isLoading } = await useFetchGroupsList()
const groups = ref(props.user.groups)
// remove groups in user.groups
const availableGroups = allGroups.value.filter(
  (group) => props.user.groups!.indexOf(group) < 0,
)

const emit = defineEmits(['save', 'reset'])

const save = () => {
  const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  emailInputFormatError.value = !!email.value && !email.value.match(mailFormat)
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

  emit(
    'save',
    email.value,
    name.value,
    nickname.value,
    enabled.value,
    groups.value,
  )
}
</script>

<template>
  <div>
    <div class="field">
      <div class="control">
        <button
          class="button is-small is-rounded is-success"
          @click="() => $emit('reset')"
        >
          Reset User Password
        </button>
      </div>
    </div>
    <div class="field">
      <AdministrationUserDetails :user="user" />
    </div>
    <div class="field">
      <label class="checkbox">
        <input v-model="enabled" type="checkbox" />
        Is enabled?
      </label>
    </div>
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
    <div v-if="availableGroups" class="field">
      <label class="label">User Groups</label>
      <AdministrationSelectUserGroups
        :available-groups="availableGroups"
        :user-groups="groups"
        @change="(selectedGroups) => (groups = selectedGroups)"
      />
    </div>
    <div class="field is-grouped mt-5">
      <div class="control">
        <button class="button is-info" @click="save">Save</button>
      </div>
      <div class="control">
        <button
          class="button is-info is-light"
          @click="() => navigateTo('/administration/users')"
        >
          Cancel
        </button>
      </div>
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
