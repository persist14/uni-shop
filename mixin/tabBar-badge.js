  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters('m_cart', ['total'])
    },
    // 开启监视器当数字发生变化的时候触发setBadge() 进行徽章的修改
    watch: {
     total() {
       this.setBadge()
     }
    },
    // 页面显示就加载
    onShow() {
      this.setBadge()
    },
    methods: {
      setBadge() {
        uni.setTabBarBadge({
          index: 2,
          text: this.total + '' //注意 text的值只能是字符串
        })
      }
    }
  }