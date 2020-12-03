<template>
  <div class="login-container">
    <el-form
      ref="activateForm"
      :model="activateForm"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{this.reslutInfo}}</h3>
      </div>
      <div class="title-container">
        <h4 class="title">{{this.countdown}}秒后跳转到登录页面</h4>
      </div>
    </el-form>

    <div class="copyright">
      Copyright © 2020 <a href="https://weibo.com/u/5629544112">木有感情的机器人X</a> 版权所有 冀ICP备20017156号
    </div>
  </div>
</template>

<script>
  export default {
    name: 'activate',
    data() {
      return {
        reslutInfo:'',
        activateForm: {
        },
        loadingFlag:false,
        countdown:'5',
        timer: null,
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true,
      },
    },
    created() {

      let param = {}
      param.code = window.location.href.split("?")[1].split("=")[1]

      this.$store
        .dispatch('ActivateByCheckCode',param)
        .then(() => {
          this.reslutInfo = '账号激活成功'
          this.sendCode()
        })
        .catch((response) => {
          this.$notify.error({
            title: '账号激活失败',
            message: response.data.errmsg
          })
          this.reslutInfo = '账号激活失败'
          this.sendCode()
        })
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {

      sendCode(){
        this.loading();  //启动定时器
        this.timer = setInterval(() =>{
          //创建定时器
          if(this.countdown === 1){
            this.clearTimer();  //关闭定时器
            this.$router.push({ path: '/login' })
          }else{
            this.loading();
          }
        },1000);
      },
      loading(){
        //启动定时器
        this.countdown--;  //定时器减1
      },
      clearTimer(){
        //清除定时器
        clearInterval(this.timer);
        this.timer = null;
      },

    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
    .copyright {
      font-size: 12px;
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-bottom: 20px;
      letter-spacing: 0.6px;
      a {
        font-weight: bold;
        border-bottom: 1px solid #fff;
        font-family: 'PingFangSC-Semibold', sans-serif;
      }
    }
  }
</style>

