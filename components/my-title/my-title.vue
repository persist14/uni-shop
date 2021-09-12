<template>
  <view class="my-settle-container">
    <view  >
      <!-- 全选按钮 -->
      <label class="radio" @click="updateAll" >
        <radio :checked="isFullChecked" color="#C00000" /><text>全选</text>
      </label>
    </view>
    <!-- 合计区域 -->
    <view class="amount-box" >
      合计： <text class="amount">￥{{checkGoodsAmount}}</text>
    </view>
    <!-- 结算区域 -->
    <view class="btn-settle" @click="settlement" >
      <text>结算（{{checkedCount}}）</text>
    </view>
  </view>
</template>

<script>
  import {mapState, mapGetters, mapMutations } from 'vuex'
  export default {
    name:"my-title",
    data() {
      return {
        count: 3, //默认跳转延时秒数为3秒
        timer: null //定时器的id
      };
    },
    computed: {
      // 将vuex中的checkCount映射到当前组件
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkGoodsAmount']),
      ...mapGetters('m_user', ['addStr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      isFullChecked() {
        // vuex中 total的方法 是将所有本地存储的数量进行了累加 并将累加的值返回了
        // 所以 全选的状态可以使用total和选中状态的数量进行对比 并返回一个Boolean值
        return this.total === this.checkedCount
        // console.log(this.total ===  this.checkedCount)
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllCheckState']),
      // 映射进来重定向数据
      ...mapMutations('m_user', ['updateRedirectInfo']),
      updateAll() {
        this.updateAllCheckState(!this.checkedCount)
      },
      settlement() {
        // 判断用户有没有选中商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
        // 判断用户有没有选择收获地址
        if (!this.addStr) return uni.$showMsg('请选择收货地址')
        // 判断用户有无登录 vuex中声明一个token
        // if (!this.token) return uni.$showMsg('请先登录')
        if (!this.token)  {
          this.delayNavigator()
        }
        // 调用外部的订单方法
        this.payOrder()
      },
      async payOrder() {
        // 1. 创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // order_price: this.checkGoodsAmoun,
          order_price: 0.01,
          consignee_addr: this.addStr,
          order_detail: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        // 发起获取订单编号的接口
        const {data: res} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        // 由于接口问题 这里 先模拟出订单编号
        const orderName = 'HDMD2201928376494'
        // 2. 订单预支付
        // 发起请求获取订单的支付信息
        const {data: res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number: orderName})
        // 模拟获取到订单信息
        const payInfo = {
              message: {
                pay: {
                  timeStamp: "1525681145",
                  nonceStr: "BkPggorBXZwPGXe3",
                  package: "prepay_id=wx071619042918087bb4c1d3d72999385683",
                  signType: "MD5",
                  paySign: "D1642DEEF1663C8012EDEB9297E1D516"
                },
                order_number: "GD20180507000000000110"
              },
              meta: { "msg": "预付订单生成成功", "status": 200 }
            }
        // 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo.message.pay)
        console.log(err)
        // 完成支付 进一步查询支付结果
        // const {data: res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number: orderName})
        // 由于这里接口问题不能进行判断成功失败 所以直接打印成功的消息
        uni.showToast({
          title: '订单支付完成!',
          icon: 'success',
          duration: 1500
        })
      },
      // 执行延时操作方法
      delayNavigator() {
        // 防止用户切换到登录页面没有登录再次点击结算出现bug
        // 一上来让倒退的秒数重置为3
        this.count = 3
        this.showTips(this.count)
        // 定义延时器 显示动态变化的提示框
        this.timer = setInterval(() => {
          this.count--
          //当 count为0的时候 清除定时器同时跳转至登录页面
          if (this.count <= -1) {
            clearInterval(this.timer);
            // 跳转至登录导航页
            uni.switchTab({
              url: '/pages/My/My',
              success:() => {
                this.updateRedirectInfo({
                  openType: 'switchTab', 
                  from: '/pages/Cart/Cart'
                })
              }
            })
            
            // 同时return 防止执行最后一个this.showTips(this.count)
            return 
          }
          this.showTips(this.count)
        }, 1000)
      },
      // 提示用户没有登录
      showTips(n) {
        uni.showToast({
          title: `请登录后再进行结算！${n}秒后跳转至登录页面 `,
          icon: 'none',
          mask: true, //防止显示弹框用户点击穿透
          duration: 1500
        })
      }
    }
    
  }
</script>

<style lang="scss">
  .my-settle-container {
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
    font-size: 14px;
    .radio {
     display: flex;
     align-items: center;
    }
    .amount-box {
      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }
    .btn-settle {
      background-color: #C00000;
      height: 50px;
      color: #fff;
      line-height: 50px;
      min-width: 100px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
