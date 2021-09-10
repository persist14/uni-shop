<template>
  <view class="my-search-container" :style="{'background-color': bgColor}" @click="searchBoxHandler" >
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}" >
      <!-- 使用uni-app ui 渲染图标 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text>搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    props: {
      bgColor: {
        type: String,
        default: '#C00000'
      },
      radius: {
        type: Number,
        default: 18
      }
    },
    data() {
      return {
        
      };
    },
    methods: {
      searchBoxHandler() {
        // 发布自定义触发click中的函数
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // background-color: #C00000;
    padding: 0 15rpx;
    .my-search-box{
      width: 100%;
      height: 36px;
      // border-radius: 18px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items:center;
      text {
        color: #ccc;
        font-size: 14px;
      }
    }
  }
</style>
