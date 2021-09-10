<template>
  <view>
     <view class="goods-list" >
       <view class="goods-item" v-for="(item,index) in goodsList" :key="index" @click="gotoDetail(item)" >
        <my-list :item="item" ></my-list>
       </view>
     </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [] ,//存放商品数据列表
        total: 0, //存放 获取的总数据条数
        isloading: false // 控制节流
      };
    },
    onLoad(options) {
      // console.log(options)
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // console.log(this.queryObj)
      this.getGoodsList()
    },
    methods: {
      // 获取商品数据, 改造获取函数的参数接收一个回调函数
      async getGoodsList(cb) {
        this.isloading = true
        try {
          const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
          // console.log(res)
          this.goodsList = [...this.goodsList, ...res.message.goods]
          this.total = res.message.total
          this.isloading  = false
          // 当传递回调函数执行回调函数  不传递 不执行
          cb && cb()
        }catch(err) {
          uni.$showMsg('获取商品列表失败')
        }
      },
      // 跳转至详情页面
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    // 上拉加载更多处理函数
    onReachBottom() {
      // 判断数据是否加载完毕
      if (this.goodsList.length >= this.total ) {
        return uni.$showMsg('数据加载完毕！')
      }
      // 控制节流阀
      if (this.isloading) return 
      this.queryObj.pagenum + 1
      // 当剩余的数据不够加载完下一页数据时 服务器会报错
      // 解决思路： 如果总数据数量减去现在已经加载的数量小于pagesize时 将剩余的数据条数赋值给pagesize
      if (this.total - this.goodsList.length < this.queryObj.pagesize ) this.queryObj.pagesize = this.total % this.goodsList.length
      this.getGoodsList()
    },
    // 下拉刷新 重新获取数据
    onPullDownRefresh() {
      // 让关键数据重置
      this.goodsList = []
      this.total = 0
      this.queryObj.pagenum = 1
      // 重置节流选项为false
      this.isloading = false
      // 重新获取数据, 并且传递一个回调函数 停止下拉刷新
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">
  .goods-list {
    padding: 10px 5px;
  }
</style>
