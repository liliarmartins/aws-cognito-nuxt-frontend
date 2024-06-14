import { skipHydrate } from 'pinia'
import { type FetchUserAttributesOutput } from 'aws-amplify/auth'

export const useUserStore = defineStore('user', () => {
  const userStore = useLocalStorage('user', null as string | null)

  const setUser = (newUser: FetchUserAttributesOutput | null) => {
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
