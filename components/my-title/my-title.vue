<template>
  <view class="my-settle-container">
    <view  >
      <!-- 全选按钮 -->
      <label class="radio" @click="updateAll" >
        <radio :checked="isFullChecked" color="#C00000" /><text>全选</text>
      </label>
    </view>
    <!-- 合计区域 -->
    <view class="amount-box" >
      合计： <text class="amount">￥{{checkGoodsAmount}}</text>
    </view>
    <!-- 结算区域 -->
    <view class="btn-settle">
      <text>结算（{{checkedCount}}）</text>
    </view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name:"my-title",
    data() {
      return {
        
      };
    },
    computed: {
      // 将vuex中的checkCount映射到当前组件
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkGoodsAmount']),
      isFullChecked() {
        // vuex中 total的方法 是将所有本地存储的数量进行了累加 并将累加的值返回了
        // 所以 全选的状态可以使用total和选中状态的数量进行对比 并返回一个Boolean值
        return this.total === this.checkedCount
        console.log(this.total ===  this.checkedCount)
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllCheckState']),
      updateAll() {
        this.updateAllCheckState(!this.checkedCount)
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
    font-size: 14px;
    .radio {
     display: flex;
     align-items: center;
    }
    .amount-box {
      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }
    .btn-settle {
      background-color: #C00000;
      height: 50px;
      color: #fff;
      line-height: 50px;
      min-width: 100px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
