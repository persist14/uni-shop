<template>
	<view>
    <!-- 由于当前自定义组件没有click事件 所以需要通过冒泡＋子传父进行封装 -->
    <my-search @click="gotoSearch" ></my-search>
		<view class="scroll-view-container" >
      <!-- 分类左侧导航栏 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" class="left-scroll-view" >
        <block v-for="(item, index) in cateList" :key="index" >
          <view :class="['left-scroll-view-item', active === index ? 'active': '']" @click="activeChange(index)" >{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 分类右侧内容区域 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop" >
        <view v-for="(item2,index2) in cateLevel2" :key="index2"  >
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 三级分类 -->
          <view class="cate-lv3-list" >
            <view v-for="(item3,index3) in item2.children" :key="index3"  class="cate-lv3-list-item" @click="gotoGoodsList(item3)" >
              <!-- 三级分类图片 -->
              <image src="/static/tab_icons/cart-active.png" ></image>
              <!-- 三级分类名称-->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				wh: 0,
        cateList: [], //存放左侧菜单栏数据
        active: 0, // 用来判断当前点击索引的值是否等于active的值 等于 展示css特效
        cateLevel2: [], //存放二级分类数据
        scrollTop: 0 //定义滚动条的位置
			}
		},
		methods: {
			async getCateList() {
        try {
         const {data: res} = await uni.$http.get('/api/public/v1/categories')
         this.cateList = res.message
         // 为二级分类赋值
         this.cateLevel2 = this.cateList[0].children
        }catch(err) {
          uni.$showMsg('获取分类左侧菜单栏数据失败')
        }
      },
      activeChange(index) {
        this.active = index
        // 当切换一级分类之后 重新给二级分类赋值
        this.cateLevel2 = this.cateList[index].children
        // 每次切换之后 让它的滚动条位置回到最顶部
        // 由于给scroll-top 这个属性赋值一样的值 不会发生变化 所以可以如下操作
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 跳转至goods_list页面
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '../../subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      gotoSearch() {
        uni.navigateTo({
           url:'../../subpkg/Search/Search'
        })
      }
		},
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      // console.log(sysInfo)
      this.wh = sysInfo.windowHeight - 50
      this.getCateList()
    }
	}
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;
    .left-scroll-view {
      width: 120px;
      .left-scroll-view-item {
        line-height: 60px;
        text-align: center;
        background-color: #f7f7f7;
        font-size: 12px;
        &.active {
          background-color: #fff;
          position: relative;
          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background: #C00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
    .cate-lv2-title {
      font-weight: bold;
      text-align: center;
      margin: 15px 0;
      font-size: 12px;
    }
    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;
      .cate-lv3-list-item {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
        image{
          width: 60px;
          height: 60px;
        }
        text{
          font-size: 12px;
        }
      }
    }
  }
</style>
