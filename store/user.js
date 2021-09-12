export default {
  // 开启命名空间
  namespaced: true,
  // 定义一个state保存数据
  state: () => ({
    // 获取本地存储地址的数据
    address: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    token: uni.getStorageSync('token')|| '',
    // 用户数据对象
    userData: JSON.parse(uni.getStorageSync('userData') || '{}'),
    // 登录成功后跳转至原来页面的数据 默认值为null
    redirectInfo: null
  }),
  // 修改state中数据的属性
  mutations: {
    // 修改地址方法
    updateAddress(state, address) {
      state.address = address
      // 调用本地存储持久化方法
      this.commit('m_user/saveAddressStorage')
    },
    // 进行持久化存储地址
    saveAddressStorage(state) {
      uni.setStorageSync('userInfo', JSON.stringify(state.address))
    },
    // 修改用户信息方法
    updateUserInfo(state, userData) {
      state.userData = userData
      // 调用本地化存储方法
      this.commit('m_user/saveUserInfoStorage')
    },
    // 定义一个持续化存储用户数据的方法
    saveUserInfoStorage(state) {
      uni.setStorageSync('userData', JSON.stringify(state.userData))
    },
    // 定义存储token方法
    updateToken(state, token) {
      state.token = token
      // 调用本地存储的方法
      this.commit('m_user/saveToken')
    },
    // 创建token本地存储
    saveToken(state) {
      uni.setStorageSync('token', JSON.stringify(state.token))
    },
    // 更新跳转至原来页面的数据保存
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
      console.log(state.redirectInfo)
    }
  },
  // 数据包装器
  getters: {
    addStr (state) {
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.detailInfo
    }
  }
}