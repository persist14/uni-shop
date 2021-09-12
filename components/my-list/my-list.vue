<template>
  <view class="goods-item" >
   <!-- 左侧盒子 -->
   <view class="goods-item-left" >
     <radio @click="radioClickHandler" :checked="item.goods_state" color="#C00000" v-if="showRadio" ></radio>
     <image :src="item.goods_small_logo || defaultImg" class="imagePic" ></image>
   </view>
   <!-- 右侧盒子 -->
   <view class="goods-item-right" >
     <view class="goods-name" > {{item.goods_name}} </view>
     <view class="goods-info-box" >
       <view class="goods-price"> ￥{{item.goods_price | toFixed}} </view>
       <uni-number-box @change="numberChangeHandler" v-if="showNum" :min="1" :value="item.goods_count" ></uni-number-box>
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
      },
      showRadio: {
        type: Boolean,
        default: false
      },
      showNum: {
        type: Boolean,
        // 默认不显示
        default:  false
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
    },
    methods:{
      radioClickHandler() {
        this.$emit('radio-change', {
          goods_id: this.item.goods_id,
          goods_state: !this.item.goods_state
        })
      },
      // 监听商品数量的变化 当数量发生变化的时候 将数据转递给外界组件
      numberChangeHandler(newVal) {
        this.$emit('number-change', {
          goods_id: this.item.goods_id,
          goods_count: newVal - 0 // 数字格式
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    border-bottom: 1px solid #efefef;
    .goods-item-left {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      justify-content: space-between;
      .goods-name {
        height: 50px;
        font-size: 14px;
      }
      .goods-info-box {
        
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        .goods-price{
          color: #C00000;
          font-size: 16px;
        }
      }
      
    }
  }
</style>
