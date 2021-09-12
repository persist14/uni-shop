<template>
  <view>
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'" >
      <button class="btnChooseAddress" size="mini" type="primary" @click="chooseAddress" >请选择收获地址+</button>
    </view>
    
    <!-- 收货人信息 -->
    <view class="address-info-box" v-else @click="chooseAddress" >
      <!-- 第一行信息 -->
      <view class="row1" >
        <view class="row1-left" >收货人：{{address.userName}}</view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <!-- 第二行信息 -->
      <view class="row2" >
        <view class="row2-left" >
          收获地址:
        </view>
        <view class="row2-right" >
         {{addStr}}
        </view>
      </view>
    </view>
    <!-- 底部边框线 -->
    <image src="../../static/cart_border@2x.png" class="address-bottom" ></image>
  </view>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {
      };
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress']),
      async chooseAddress() {
        try {
          const [err, succ] = await uni.chooseAddress()
          // 不在组件中存储数据了 存储在vuex
          // this.address = succ
          // console.log( this.address )
          // 调用vuex中修改地址的方法 进行修改数据
          this.updateAddress(succ)
          // console.log(err)
          // 让用户重新授权 //ios设备上err.errMsg的判断条件和安卓不一样 所以这里要进行修改
          if (err && (err.errMsg === 'chooseAddress: fail auth deny' || err.errMsg === 'chooseAddress: fail authorize no response')) {
            // 调用重新授权的方法
            this.reAuth()
          }
        } catch(err) {
          console.log('获取地址信息失败,请稍后再试')
        }
      },
      // 重新授权方法 
      reAuth() {
        const [err2, confirmResult] = uni.showModal({
          content: '检测到您没有开启地址权限,是否去设置打开?',
          cancelText: '取消',
          confirmText: '确定',
          confirmColor: '#C00000'
        })
        // 判断是否出错
        if (err2) return 
        // 判断用户是否要去授权
        if (confirmResult.cancel) return uni.$showMsg('您取消了授权!')
        if (confirmResult.confirm) return uni.openSetting({
          success: (settingResult) => {
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了授权')
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功, 请选择收获地址')
          }
        })
      }
    },
    computed: {
      // 引入vuex中定义的address对象数据
      ...mapState('m_user', ['address']),
      // 引入vuex中的getters
      ...mapGetters('m_user', ['addStr'])
    }
  }
</script>

<style lang="scss" >
  .address-bottom {
    display: block;
    width: 100%;
    height: 5px;
  }
  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .address-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;
    .row1 {
      display: flex;
      justify-content: space-between;
      .row1-left {}
      .row1-right{
        display: flex;
        .phone {
          
        }
      }
    }
    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .row2-left {
        white-space: nowrap;
      }
      .row2-right {
        padding-left: 8px;
      }
    }
  }
</style>
