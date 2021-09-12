<template>
  <view v-if="detailList.goods_price" class="goods-detail-container" >
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" indicator-active-color="#efefef" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in detailList.pics" :key="index" @click="previewImg(index)" >
        <image :src="item.pics_big" ></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box" >
      <!-- 商品价格 -->
      <view class="goods-price" >{{'$' + detailList.goods_price.toFixed(2)}}</view>
      <view class="goods-info-body" >
        <!-- 商品名称 -->
        <view class="goods-name" >{{detailList.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi" >
          <uni-icons type="star" size="18" color="gray" ></uni-icons>
          <text> 收藏 </text>
        </view>
      </view>
      <!-- 运费区域 -->
      <view class="yf" >
        快递: 免运费 
      </view>
    </view>
    <!-- 渲染商品介绍组件 -->
    <rich-text :nodes="detailList.goods_introduce"></rich-text>
    <!-- 渲染底部导航栏 -->
    <view class="goods-nav-bar">
      <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    computed: {
      // ...mapState('m_cart')
      ...mapGetters('m_cart', ['total'])
    },
    // 定义计算属性监听total的变化并将最新的值赋值给页面中的info属性
    watch: {
      total:{
       handler: function(newVal) {
         const findResult = this.options.find(x => x.text == '购物车')
         if (findResult) {
           findResult.info = newVal
         }
       },
        immediate: true
      }
    },
    data() {
      return {
        detailList: {},
        goodsId: '',
        options: [{
          icon: 'shop',
          text: '店铺',
        },
         {
          icon: 'cart',
          text: '购物车',
          info: 0,
          infoBackgroundColor: '#C00000',
          infoColor: 'white'
         }
        ],
        buttonGroup: [{
                  text: '加入购物车',
                  backgroundColor: '#ff0000',
                  color: '#fff'
                },
                {
                  text: '立即购买',
                  backgroundColor: '#ffa200',
                  color: '#fff'
                }]
      };
    },
    onLoad(options) {
      // console.log(options)
      this.goodsId = options.goods_id
      this.getDetailData()
    },
    methods: {
      ...mapMutations('m_cart', ['addToCart']),
      // 将数据放在vuex中的cart数组中
      buttonClick(e) {
        // console.log(e)
        
        if (e.content.text === '加入购物车') {
          // 定义要传递的数据 调用映射过来的方法进行传递数据
           // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
          const goods = {
            goods_id: this.detailList.goods_id,
            goods_name: this.detailList.goods_name,
            goods_price: this.detailList.goods_price,
            goods_count: 1,
            goods_small_logo: this.detailList.goods_small_logo,
            goods_state: true
          }
          this.addToCart(goods)
        }
      },
      async getDetailData() {
        try {
          const { data: res } = await uni.$http.get('/api/public/v1/goods/detail?goods_id=' + this.goodsId)
          // console.log(res)
          this.detailList = res.message
          //  由于渲染出来的图片上下之间有空白间隙 所以要使用replace改造服务器返回的数据进行替换
          // 由于在ios上 webp格式后缀名的图片兼容性不是很好 ,所以可以使用链式编程再次对数据进行改造
          this.detailList.goods_introduce = this.detailList.goods_introduce.replace(/<img /g, "<img style='display: block;' ").replace(/webp/g, 'jpg')
        }catch(err) {
          uni.$showMsg('获取详情页面失败')
        }
      },
      // 点击图片进行预览
      previewImg(index) {
        uni.previewImage({
          current: index,
          // map会遍历出所有的参数项然后返回新的数组
          urls: this.detailList.pics.map(x => x.pics_big)
        })
      },
      // 点击购物车切换到购物车标签栏
      onClick(e) {
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/Cart/Cart'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
 swiper {
   height: 750rpx;
   image {
     width: 100%;
     height: 100%;
   }
 }
 .goods-info-box {
   padding: 10px;
   padding-right: 0;
   .goods-price {
     font-size: 18px;
     color: #C00000;
     margin: 5px 0;
   }
   .goods-info-body {
     display: flex;
     .goods-name {
       margin-right: 5px;
       font-size: 15px;
     }
     .favi {
       width: 120px;
       font-size: 12px;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       color: gray;
       border-left: 1px solid #efefef;
     }
   }
   .yf {
     margin-top: 15px;
     font-size: 12px;
     color: gray;
   }
 }
 .goods-nav-bar {
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100%;
 }
 .goods-detail-container {
   margin-bottom: 50px;
 }
</style>
