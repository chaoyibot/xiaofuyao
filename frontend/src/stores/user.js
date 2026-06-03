import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref('')
  const familyMembers = ref([])

  const isLoggedIn = computed(() => !!token.value)
  const displayName = computed(() => userInfo.value?.nickname || '游客')

  function initFromStorage() {
    try {
      const stored = uni.getStorageSync('user_info')
      if (stored) {
        userInfo.value = stored
        token.value = stored.token || ''
      }
      const family = uni.getStorageSync('family_members')
      if (family) familyMembers.value = family
    } catch (e) {
      // 静默失败：本地存储不可用
    }
  }

  async function login(code) {
    try {
      // 优先使用传入的 code，否则调用 wx.login
      const loginCode = code || (await uni.login({ provider: 'weixin' })).code
      const data = await apiLogin(loginCode)
      token.value = data.token
      userInfo.value = data.userInfo
      uni.setStorageSync('user_info', data)
      return data
    } catch (e) {
      // 登录失败抛出，让调用方处理
      throw e
    }
  }

  function logout() {
    userInfo.value = null
    token.value = ''
    familyMembers.value = []
    uni.removeStorageSync('user_info')
    uni.removeStorageSync('family_members')
  }

  function addFamilyMember(member) {
    familyMembers.value.push(member)
    uni.setStorageSync('family_members', familyMembers.value)
  }

  return {
    userInfo, token, familyMembers,
    isLoggedIn, displayName,
    initFromStorage, login, logout, addFamilyMember
  }
})
