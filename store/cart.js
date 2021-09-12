export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    // 这里直接改成读取数据
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  // 模块的 mutations 方法
  mutations: {
    addToCart(state, goods) {
      // 判断state中是否含有这个商品数据
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // console.log(findResult)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        // 这里属性已经指向了state中的cart
        findResult.goods_count++
      }
      // 只要数据进行变化就调用m_cart下saveToStorge方法进行本地存储
      this.commit('m_cart/saveToStorge')
      // console.log(state.cart)
    },
    // 封装本地存储的方法
    saveToStorge(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新选中状态的方法
    updateGoodsState(state, goods) {
      // 根据id先判断当前数据是否存在
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult) {
        findResult.goods_state = goods.goods_state
        // 修改完之后 存储到本地存储
        this.commit('m_cart/saveToStorge')
      }
    },
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id===goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        // 修改完成存储到本地
        this.commit('m_cart/saveToStorge')
      }
    },
     // 定义删除购物车商品的方法
     removeGoods(state, goods) {
       // 让最新的数据重新保存在state的cart数组中
       state.cart = state.cart.filter(x => x.goods_id !== goods.goods_id)
       this.commit('m_cart/saveToStorge')
     },
     // 更新全选状态
     updateAllCheckState(state, newState) {
       state.cart.forEach(item => item.goods_state = newState)
       // 持续化存储到本地
       this.commit('m_cart/saveToStorge')
     }
  },

  // 模块的 getters 属性
  getters: {
    // 定义一个变量 把cart中goods_count的值 动态赋值给他
    total(state) {
      // let c = 0
      // state.cart.forEach(x => c += x.goods_count)
      // return c
      return state.cart.reduce((prev, item) =>prev += item.goods_count, 0)
    },
    // 定义一个累加方法将商品数量进行累加
    checkedCount(state) {
      // 先定义filter将存在本地化存储的状态为true数量拿出来
      // 在使用reduce进行累加
       return state.cart.filter(x => x.goods_state).reduce((prev, item) => prev +=item.goods_count, 0)
    },
    // 计算商品的总数量进行返回
    checkGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state).reduce((prev, item) => prev += item.goods_count * item.goods_price, 0).toFixed(2)
    }
  },
}