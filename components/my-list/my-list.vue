<template>
  <view class="goods-item" >
   <!-- 左侧盒子 -->
   <view class="goods-item-left" >
     <image :src="item.goods_small_logo || defaultImg" class="imagePic" ></image>
   </view>
   <!-- 右侧盒子 -->
   <view class="goods-item-right" >
     <view class="goods-name" > {{item.goods_name}} </view>
     <view class="goods-info-box" >
       <view class="goods-price"> ￥{{item.goods_price | toFixed}} </view>
     </view>
   </view>
  </view>
</template>

<script>
  export default {
    name:"my-list",
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        defaultImg: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png' // 当图片加载不出来的时候使用后这个图片
      };
    },
    // 过滤器处理价格后两位小数点
    filters: {
      toFixed(num) {
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    border-bottom: 1px solid #efefef;
    .goods-item-left {
      .imagePic {
        width: 100px;
        height: 100px;
        display: block;
        margin-right: 10px;
      }
    }
    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .goods-name {
        font-size: 14px;
      }
      .goods-info-box {
        .goods-price{
          color: #C00000;
          font-size: 16px;
        }
      }
      
    }
  }
</style>
