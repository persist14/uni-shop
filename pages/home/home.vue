<template>
	<view>
    <!-- 搜索区域 -->
    <view class="search-box" >
      <my-search @click="gotoSearch" ></my-search>
    </view>
    <!-- 轮播图区域 -->
		<swiper :indicator-dots="true"  indicator-active-color="#efefef" :autoplay="true" :circular="true" >
      <swiper-item v-for="(item,index) in swiperList" :key="index" >
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id" >
          <image :src="item.image_src" ></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类商品区域 -->
    <view class="nav-list" >
      <view v-for="(item,index) in navLsit" :key="index" @click="navClickHandler(item)"  >
        <image class="nav-img" :src="item.image_src"></image>
      </view>
    </view>
    <!-- 楼层区域渲染 -->
    <view class="floor-list" >
      <view class="floor-item" v-for="(item,index) in floorLsit" :key="index" >
        <!-- 楼层标题 -->
        <image class="floor-title" :src="item.floor_title.image_src" ></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box" >
          <!-- 左侧大图渲染 -->
          <navigator class="left-img-box" :url="item.floor_title[0].url" >
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix" ></image>
          </navigator>
          <!-- 右侧图片渲染 -->
         <view class="right-img-box" >
           <navigator v-for="(item2, index2) in item.product_list" :key="index2" :url="item2.url">
             <image :src="item2.image_src" v-if="index2 !== 0" :style="{width: item2.image_width + 'rpx'}" mode="widthFix" ></image>
           </navigator>
         </view>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        // 存放轮播图数据
        swiperList: [],
        // 存放分类导航数据
        navLsit: [],
        // 存放楼层列表数据
        floorLsit: []
			};
		},
    onLoad() {
      this.loadSwiperData()
      this.getNavData()
      this.getFloorData()
    },
    methods: {
      // 获取轮播图数据
      async loadSwiperData() {
        try {
          const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
          // console.log(res)
          this.swiperList = res.message
          // uni.$showMsg('数据加载成功')
        }catch(err) {
         uni.$showMsg('数据加载失败,请稍后再试')
        }
      },
      // 获取分类导航数据
      async getNavData() {
        try {
          const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
          this.navLsit = res.message
        }catch(err) {
          uni.$showMsg('分类数据加载失败')
        }
      },
      // 点击分类跳转到分类页面
      navClickHandler(item) {
       if (item.name === '分类') {
         uni.switchTab({
           url:'../Cate/Cate'
         })
        }
      },
      // 发起网络请求获取楼层数据
      async getFloorData() {
        try {
          const {data: res} = await uni.$http.get('/api/public/v1/home/floordata')
          // 再赋值之前先做一些处理 由于图片点击的路径和不是本地路径 所以要进行改造
           res.message.forEach(floor => {
             //第一次循环获取的是楼层所有的数据 第二次获取的是每个楼层中的标题和内容数据
             floor.product_list.forEach(item => {
               item.url = '/subpkg/goods_list/goods_list?' + item.navigator_url.split('?')[1]
             })
           })
          this.floorLsit = res.message
        }catch(err) {
          uni.$showMsg('获取楼层数据失败')
        }
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/Search/Search'
        })
      }
    }
	}
</script>

<style lang="scss">
  swiper {
    height: 330rpx;
    .swiper-item, image {
      width: 100%;
      height: 100%;
    }
  }
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15rpx;
    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }
  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }
  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .floor-img-box {
    display: flex;
    padding-left: 15rpx;
  }
  .search-box {
    // 吸顶设置
    position: sticky;
    top: 0;
    z-index: 999;
  }
</style>
