import { skipHydrate } from 'pinia'

type User = {
  email: string
  name: string
  nickname: string
}

export const useUserStore = defineStore('user', () => {
  const userStore = useLocalStorage('user', null as string | null)

  const setUser = (newUser: User | null) => {
    if (!newUser) {
      userStore.value = null
      return
    }

    userStore.value = JSON.stringify({
      email: newUser.email,
      name: newUser.name,
      nickname: newUser.nickname,
    })
  }

  const getUser = () => {
    if (!userStore.value) return null

    return JSON.parse(userStore.value)
  }

  return { userStore: skipHydrate(userStore), setUser, getUser }
})
