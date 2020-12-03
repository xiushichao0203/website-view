<template>
  <div>
    <el-form ref="addForm" :rules="rules" :model="addForm" label-width="100px">
      <el-card class="box-card" shadow="never">
        <el-row type="flex" class="row-bg" justify="start">
          <el-col :span="18">
            <el-form-item label="微博ID" prop="weiboId">
              <el-input v-model="addForm.weiboId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" shadow="never">
        <el-row type="flex" class="row-bg" justify="start">
          <el-col :span="18">
            <el-form-item label="微博昵称" prop="nickName">
              <el-input v-model="addForm.nickName">
                <template slot="append"><img :src="addForm.avatarHd" width="30"/>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="start">
          <el-col :span="18">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="addForm.weiboName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="start">
          <el-col :span="18">
            <el-form-item label="微博简介" prop="description">
              <el-input v-model="addForm.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="start">
          <el-col :span="18">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="addForm.userId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="start">
          <el-col :span="18">
            <el-form-item label="通知邮箱" prop="userMail">
              <el-input v-model="addForm.userMail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="start">
          <el-col :span="18">
            <el-form-item label="是否通知" prop="sendSwitch">
              <el-switch
                v-model="sendSwitch"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
                active-text="是"
                inactive-text="否"
                :width="50"
                @change="changeSwitch(sendSwitch)">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" shadow="never">
        <div align="center">
          <el-button type="primary"  @click="add()">提交</el-button>
          <el-button type="primary"  @click="close()">关闭</el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>
<script>

  export default {
    name: 'sendListAdd',
    components: {},
    data() {
      return {
        addForm: {},
        rules: {},
        sendSwitch:"0"
      }
    },
    created() {
    },
    methods: {
      changeSwitch(sendSwitch){
        this.sendSwitch = sendSwitch
        this.addForm.sendSwitch = sendSwitch
      },
      search() {
        this.$http({
          url: '/weibo/sendList/queryWeiboUser',
          method: 'post',
          data: this.addForm
        })
          .then((response) => {
            this.addForm = response.data.data
            this.addForm.userId = this.$session.get("userId")
            this.$success('查询成功!')
          })
          .catch((error) => {
            this.$error(error.data.errmsg)
            return;
          })
      },
      add(){
        this.addForm.sendSwitch = this.sendSwitch
        this.$http({
          url: '/weibo/sendList/add',
          method: 'post',
          data: this.addForm
        })
          .then((response) => {
            console.log(response)
            let addData = response.data.data
            if(addData.id === '9999999999'){
              this.$error('您已关注该微博用户!')
            }else{
              this.$success('添加关注成功!')
              this.close()
            }
          })
          .catch((error) => {
            this.$error(error)
          })
      },
      close() {
        this.$emit('closeDialog')
      },
      refresh(){
        this.$emit('refresh')
      }
    }
  }
</script>
