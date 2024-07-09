import { skipHydrate } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userStore = useLocalStorage('user', null as string | null)

  const setUser = (newUser: UserWithGroups | null) => {
    if (!newUser) {
      userStore.value = null
      return
    }

    userStore.value = JSON.stringify({
      email: newUser.email,
      name: newUser.name,
      nickname: newUser.nickname,
      username: newUser.username,
      groups: newUser.groups,
    })
  }

  const getUser = () => {
    if (!userStore.value) return null

    return JSON.parse(userStore.value)
  }

  return { userStore: skipHydrate(userStore), setUser, getUser }
})
