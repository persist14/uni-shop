<template>
  <view class="login-container" >
    <uni-icons type="contact-filled" size="100" color="#AFAFAF" ></uni-icons>
    <button class="btn-login" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" >一键登录</button>
    <text class="tips-text" >登录后享受更多权益</text>
  </view>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    computed: {
      // 将重定向的数据通过计算属性映射进来
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 通过内置api拿到用户的数据
      getUserInfo(e) {
        // console.log(e)
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了授权')
        // console.log(e.detail)
        this.updateUserInfo(e.detail.userInfo)
        // 调用外部方法获取token
        this.getToken(e.detail)
      },
      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
      
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
      console.log(query)
        // 换取 token
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        var loginResult2 = {
              "message": {
                "user_id": 12,
                "user_email_code": null,
                "is_active": null,
                "user_sex": "男",
                "user_qq": "",
                "user_tel": "",
                "user_xueli": "本科",
                "user_hobby": "",
                "user_introduce": null,
                "create_time": 1525402223,
                "update_time": 1525402223,
                "token":
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o"
              },
              "meta": { "msg": "登录成功", "status": 200 }
            }
        if (loginResult2.meta.status !== 200) return uni.$showMsg('登录失败！')
        
        this.updateToken(loginResult2.message.token)
        // 进行改造 调用外部定义方法重新跳转回vuex中纪录的页面
        this.navigateBack()
        uni.$showMsg('登录成功')
      },
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
          uni.switchTab({
            url: this.redirectInfo.from,
            // 这里只能用es5的写法 不然this的指向有错误
            success: () =>{
              // 成功之后 调用更新redirectInfo方法 将redirectInfo中的数据重置为null
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
     height: 750rpx;
     padding-top: 100px;
     display: flex;
     flex-direction: column;
     align-items: center;
     background-color: #f8f8f8;
     position: relative;
     overflow: hidden;
    .btn-login {
      margin-top: 10px;
      width: 90%;
      border-radius: 100px;
      background-color: #C00000;
    }
    .tips-text{
      margin-top: 10px;
      font-size: 14px;
      color: #afafaf;
      
    }
    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
      
    }
  }
</style>
