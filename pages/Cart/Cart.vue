<template>
	<view class="cart-container" v-if="cart.length" >
    <!-- 收获地址区域 -->
    <my-address></my-address>
		<!-- 标题栏区域 -->
    <view class="cart-title" > 
      <uni-icons type="shop" size="18"></uni-icons>
      <text class="cart-title-text" >购物车</text>
    </view>
    <!-- 商品信息区域 -->
    <uni-swipe-action>
       <block v-for="(item,index) in cart" :key="index" >
      <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(item)" >
        <my-list :showNum="true" :item="item" :showRadio="true" @radio-change="radioClickHandler" @number-change="numberChangeHandler" ></my-list>
      </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 结算区域 -->
    <my-title></my-title>
	</view>
  <view class="empty-box" v-else >
      <image class="empty-img" src="/static/cart_empty@2x.png" ></image>
      <text class="empty-title" >空空如也~</text>
  </view>
</template>

<script>
  import badgeMix from 'mixin/tabBar-badge.js'
  import { mapState, mapMutations } from 'vuex'
	export default {
    mixins: [badgeMix],
    computed: {
      ...mapState('m_cart', ['cart'])
    },
		data() {
			return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#C00000'
          }
        }]
			};
		},
    // 获取点击之后的id和选中状态
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoods']),
      radioClickHandler(e) {
        this.updateGoodsState(e)
      },
      // 接收子组件返回的数据
      numberChangeHandler(e) {
        console.log(e)
        this.updateGoodsCount(e)
      },
      // 删除对应的商品
       swipeActionClickHandler(item) {
         this.removeGoods(item)
       }
    }
   
	}
</script>

<style lang="scss">
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;
    .cart-title-text {
      font-size: 14px;
      margin-left: 3px;
    }
  }
  .cart-container {
    padding: 0 5px;
    padding-bottom: 50px;
  }
  .empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 250rpx;
    .empty-img {
      width: 90px;
      height: 90px;
    }
    .empty-title {
      margin-top: 10px;
      color: gray;
    }
  }
</style>
