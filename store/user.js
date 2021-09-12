export default {
  // 开启命名空间
  namespaced: true,
  // 定义一个state保存数据
  state: () => ({
    // 获取本地存储地址的数据
    address: JSON.parse(uni.getStorageSync('userInfo') || '{}')
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