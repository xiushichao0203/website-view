<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      v-if="type === 'login'"
    >
      <div class="title-container">
        <h3 class="title">用户登录</h3>
      </div>
      <el-row>
        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>

          <el-input
            v-model="loginForm.username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            placeholder="账户"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
          <el-input
            v-model="loginForm.password"
            :type="passwordType"
            name="password"
            auto-complete="on"
            tabindex="2"
            show-password
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >登录
        </el-button>
      </el-row>
      <el-row>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="registerType"
        >尚未拥有账号，点击注册
        </el-button>
      </el-row>
    </el-form>
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
      label-position="left"
      v-if="type === 'register'"
    >
      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>
      <el-row>
        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
          <el-input
            v-model="registerForm.username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            placeholder="账户"
          />
        </el-form-item>
      </el-row>
      <el-row>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          v-model="registerForm.password"
          :type="passwordType"
          name="password"
          auto-complete="on"
          tabindex="2"
          show-password
          placeholder="密码"
        />
      </el-form-item>
    </el-row>
      <el-row>
        <el-form-item prop="rePassword">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
          <el-input
            v-model="registerForm.rePassword"
            :type="passwordType"
            name="password"
            auto-complete="on"
            tabindex="2"
            show-password
            placeholder="确认密码"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="userMail">
        <span class="svg-container">
          <svg-icon icon-class="email"/>
        </span>
          <el-input
            v-model="registerForm.userMail"
            name="userMail"
            type="text"
            tabindex="1"
            auto-complete="on"
            placeholder="邮箱"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="17">
        <el-form-item prop="checkCode">

        <span class="svg-container">
          <svg-icon icon-class="check"/>
        </span>
          <el-input
            v-model="registerForm.checkCode"
            name="checkCode"
            type="text"
            tabindex="1"
            auto-complete="on"
            placeholder="验证码"
          />

        </el-form-item>

        </el-col>
        <el-col :span="5" :offset="1">
          <div class="ValidCode disabled-select" :style="`width:80px; height:50px`"
               @click="refreshCode">
            <span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{item.code}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleRegister"
        >注册
        </el-button>
      </el-row>
      <el-row>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="loginType()"
        >已经拥有账号，点击登录
        </el-button>
      </el-row>
    </el-form>
    <div class="copyright">
      Copyright © 2020 <a href="https://weibo.com/u/5629544112">木有感情的机器人X</a> 版权所有 冀ICP备20017156号
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {

      const validateUsername = (rule,value,callback) =>{
        if(value){
          let reg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
          if(!reg.test(value) && this.type !== 'login'){
            callback(new Error('账号必须以字母开头，长度在5~16之间，只能包含字母、数字和下划线'))
          }else{
            callback()
          }
        }else{
          callback()
        }
      }

      const validatePassword = (rule, value, callback) => {
        if (value) {
          let reg = /^[a-zA-Z]\w{5,17}$/
          if(!reg.test(value) && this.type !== 'login'){
            callback(new Error('密码必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线'))
          }else{
            callback()
          }
        }else {
          callback()
        }
      }

      const validateRePassword = (rule, value, callback) => {
        if(value !== this.registerForm.password){
          callback(new Error('请确认两次密码是否一致'))
        }else {
          callback()
        }
      }

      const validateCheckCode = (rule, value, callback) => {
        if (value) {
          let checkCode = ''
          for(let i=0;i<this.codeList.length;i++){
            checkCode += this.codeList[i].code
          }

          if(value.toUpperCase() !== checkCode.toUpperCase()){
            callback(new Error('验证码不正确'))
          }else{
            callback()
          }
        }else {
          callback()
        }
      }


      return {
        length:4,
        type:"login",
        registerForm:{
          username:'',
          password:'',
          rePassword:'',
          userMail:''
        },
        loginForm: {
          username: '',
          password: ''
        },
        registerRules:{
          username: [
            { required: true, message: '账户不允许为空', trigger: 'blur' },
            {validator: validateUsername,trigger: 'blur'}
          ],
          password: [
            { required: true, message: '密码不允许为空', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
          ],
          rePassword:[
            { required: true, message: '密码不允许为空', trigger: 'blur' },
            { validator: validateRePassword, trigger: 'blur' }
          ],
          checkCode:[
            { required: true, message: '验证码不允许为空', trigger: 'blur' },
            { validator: validateCheckCode, trigger: 'blur' }
          ],
          userMail:[
            { required: true, message: '邮箱不允许为空', trigger: 'blur' },
            { type: 'string',
              message: '邮箱格式不正确',
              trigger: 'blur',
              transform (value) {
                if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)) {
                  return true
                }else{
                }
              }
            },
            { type: 'string', message: '长度不能超过30位', trigger: 'blur', max: 30 }
          ]
        },
        loginRules: {
          username: [
            { required: true, message: '账户不允许为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不允许为空', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
          ]
        },
        passwordType: 'password',
        loading: false,
        codeList: []
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      loginType() {
        this.registerForm = {}
        this.type = 'login'
      },
      registerType() {
        this.loginForm = {}
        this.createdCode()
        this.type = 'register'
      },
      handleRegister(){
        this.$refs.registerForm.validate((valid) => {
          if (valid && !this.loading) {
            this.loading = true
            this.$store
              .dispatch('RegisterByUserMail', this.registerForm)
              .then(() => {
                 this.createdCode()
                 this.registerForm = {}
                 this.loading = false
                 this.$success("账号注册成功,激活链接已经发送至注册邮箱，请确认相关邮件")
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.errmsg
                })
                this.createdCode()
                this.loading = false
              })
          } else {
            return false
          }
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid && !this.loading) {
            this.loading = true
            this.$store
              .dispatch('LoginByUsername', this.loginForm)
              .then(() => {
                this.$session.set('userId', this.loginForm.username)
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.errmsg
                })
                this.loading = false
              })
          } else {
            return false
          }
        })
      },
      refreshCode(){
        this.createdCode()
      },
      createdCode () {
        let len = this.length,
          codeList = [],
          chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789',
          charsLen = chars.length
        // 生成
        for (let i = 0; i < len; i++) {
          let rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240),
            Math.round(Math.random() * 200)]
          codeList.push({
            code: chars.charAt(Math.floor(Math.random() * charsLen)),
            color: `rgb(${rgb})`,
            fontSize: `30px`,
            padding: `${[Math.floor(Math.random() * 10)]}px`,
            transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random()
              * 90)}deg)`
          })
        }
        // 指向
        this.codeList = codeList
        // 将当前数据派发出去
        this.$emit('update:value', codeList.map(item => item.code).join(''))
      },
      getStyle (data) {
        return `color: ${data.color}; font-size: ${data.fontSize}; padding:
      ${data.padding}; transform: ${data.transform}`
      }

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
    .register-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 50px 20px 0;
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
<style scoped lang="scss">
  .ValidCode{
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    span{
      display: inline-block;
    }
  }
</style>

