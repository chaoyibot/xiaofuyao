import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
      console.error('恢复用户信息失败:', e)
    }
  }

  async function login(code) {
    // 调用云函数 wx.login
    try {
      const res = await uni.login({ provider: 'weixin' })
      // TODO: 调用后端登录 API
      // const data = await apiLogin(res.code)
      // token.value = data.token
      // userInfo.value = data.userInfo
      // uni.setStorageSync('user_info', data)
      console.log('登录 code:', res.code)
    } catch (e) {
      console.error('登录失败:', e)
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
