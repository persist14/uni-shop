<template>
  <view class="userInfo-container" >
    <!-- 头部区域绘制 -->
    <view class="top-box" >
      <image :src="userData.avatarUrl" class="avatar" ></image>
      <text class="mickName" >{{userData.nickName}}</text>
    </view>
    <!-- 面板区域 -->
    <view class="panel-list" >
      <!-- 第一个面板 -->
      <view class="panel" >
        <view class="panel-body" >
          <view class="panel-item" >
            <text>8</text>
            <text>收藏店铺</text>
          </view>
          <view class="panel-item" >
            <text>14</text>
            <text>收藏商品</text>
          </view>
          <view class="panel-item" >
            <text>2</text>
            <text>关注商品</text>
          </view>
          <view class="panel-item" >
            <text>19</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="panel" >
        <view class="panel-title" >
          我的订单
        </view>
        <view class="panel-body" >
          <view class="panel-item" >
            <image src="../../static/my-icons/icon1.png"  ></image>
            <text class="" >待付款</text>
          </view>
          <view class="panel-item" >
            <image src="../../static/my-icons/icon2.png" ></image>
            <text>待收货</text>
          </view>
          <view class="panel-item" >
            <image src="../../static/my-icons/icon3.png" ></image>
            <text>退款/退货</text>
          </view>
          <view class="panel-item" >
            <image src="../../static/my-icons/icon4.png" ></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <!-- 第三个面板 -->
      <view class="panel" >
        <view class="panel-list-item" >
          <text>收货地址</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
        <view class="panel-list-item" >
          <text>联系客服</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    name:"my-userInfo",
    data() {
      return {
      };
    },
    computed: {
      ...mapState('m_user', ['userData']),
      
    },
    methods:{
      // 映射出用户的所有数据进行清空
      ...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),
      // 退出登录
      async logout() {
        // 提示用户是否需要退出登录  返回一个promise对象
        const [err, succ] = await uni.showModal({
          title:'提示',
          content:'是否退出登录',
          confirmText:'确定',
          confirmColor: '#C00000',
          cancelText: '取消'
        })
        if (succ && succ.confirm) {
          // 清空用户的数据并提示用户退出成功
          this.updateAddress({})
          this.updateUserInfo({})
          this.updateToken('')
          uni.showToast({
            title: '退出成功',
            icon: 'success'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
.userInfo-container{
  background-color: #F4F4F4;
  height: 100%;
  .top-box {
    width: 100%;
    height: 400rpx;
    background-color: #C00000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 1px 5px #000;
    }
    .mickName {
      margin-top: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
  }
  .panel-list {
    padding: 0 10px;
    position: relative;
    top: -10px;
    .panel {
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 8px;
      .panel-title {
        line-height: 45px;
        padding-left: 10px;
        border-bottom: 1px solid #f4f4f4;
      }
      .panel-body {
       // margin-top: -10px;
        // height: 60px;
        display: flex;
        justify-content: space-around;
        
        .panel-item {
          font-size: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          image {
            width: 35px;
            height: 35px;
          }
        }
      }
    }
  }
  .panel-list-item {
    display: flex;
    justify-content: space-between;
    line-height: 45px;
    padding: 0 10px;
    border-bottom: 1px solid #efefef;
  }
}
</style>
