<template>
  <view>
    <!-- 搜索区域 -->
   <view class="search-box">
      <uni-search-bar  @input="input" class="" :radius="18"  cancelButton="none" clearButton="always"></uni-search-bar>
   </view>
   <!-- 搜索建议列表 -->
   <view class="suggest-list" v-if="searchResultList.length !== 0" >
     <view class="suggest-list-item" v-for="(item,index) in searchResultList" :key="index" >
       <view class="goods-name" >{{item.goods_name}}</view>
       <uni-icons type="arrowright" ></uni-icons>
     </view>
   </view>
   <!-- 搜索历史 -->
   <view class="history-box" v-else >
     <!-- 标题区域 -->
     <view class="history-title" >
       <text>搜索历史</text>
       <uni-icons type="trash" size="17" @click="clean" ></uni-icons>
     </view>
     <!-- 历史纪录展示区域 -->
    <view class="history-list" >
       <uni-tag :text="item" v-for="(item, index) of histories" :key="index" @click="gotoGoodsList(item)" ></uni-tag>
    </view>
   </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        kw: '',
        searchResultList: [], //搜索结果存放列表
        historyList: [], // 搜索历史纪录存放列表
      };
    },
    onLoad() {
      // 当数据刚开始加载的时候获取本地存储的历史关键词 赋值给historyList
      // 当没有数据是 给他一个空字符串数组
      this.historyList = JSON.parse(uni.getStorageSync('kw')||'[]')
    },
    methods:{
      input(e) {
        // 防抖处理
        // 在没有间隔500ms的情况下 用户一直收入 让清理定时器一直执行
        clearTimeout(this.timer)
        // 用户间隔500ms 将值赋给kw
        this.timer = setTimeout(() =>{
          this.kw = e
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        // 先判断用户输入的内容和是否为空
        if (this.kw === '') {
          // 等于空的情况下 清空searchList内容 并返回不做处理
          this.searchResultList = []
          return
        }
        // 发起网络请求
        try {
          const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
          this.searchResultList = res.message 
          // 访问成功后 将搜索框中的内容加入到历史记录中
          this.saveSearchHistory()
        }catch(err) {
          uni.$showMsg('获取搜索内容失败')
        }
      },
      saveSearchHistory() {
        // this.historyList.push(this.kw)
        // 使用set对象去重
        const set = new Set(this.historyList)
        // 先删除数set中对应的元素
        set.delete(this.kw)
        // 再将删除的元素添加进去
        set.add(this.kw)
        // console.log(set)
        // 再将set对象转化数组
        this.historyList = Array.from(set)
        // 将historyList 进行持久化处理
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      clean() {
        // 点击垃圾桶图标清空data中存放历史数据的列表
        this.historyList = []
        // 再清空本地存储的数据
        uni.setStorageSync('kw', '[]')
        uni.showToast({
          title: '清空历史纪录成功',
          icon:"success"
        })
      },
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + item
        })
      }
    },
    computed: {
      // 计算属性监听渲染出来的历史纪录数组是否发生变化
      // 有新的变动 基于原来historyList数据重新翻转数组
      histories() {
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.suggest-list {
  padding: 0 5px;
  .suggest-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    .goods-name {
      // 不换行显示
      white-space: nowrap;
      overflow: hidden;
      // 超出部分...显示
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 6px;
  .history-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #efefef
  }
  .history-list{
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
