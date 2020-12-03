<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <el-card class="box-card" shadow="never">
      <div class="filter-container">
        <el-input
          v-model="listQuery.weiboId"
          clearable
          class="filter-item"
          style="width: 200px;"
          placeholder="请输入用户微博ID"
        />
        <el-button
          v-permission="['GET /weibo/sendList/list']"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >查找</el-button>
        <!-- <el-button
          v-permission="['POST /admin/admin/create']"
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >添加</el-button>
        <el-button
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >导出</el-button>-->
      </div>
    </el-card>
    <el-card class="box-card" shadow="never">
      <el-row type="flex" class="row-bg" justify="start" style="padding-bottom: 10px">
        <el-button
          v-permission="['POST /admin/admin/update']"
          type="primary"
          size="mini"
          @click="add()"
        >添加关注</el-button>
        <!-- <el-button
          v-permission="['POST /admin/admin/update']"
          type="primary"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑</el-button>
        <el-button
          v-permission="['POST /admin/admin/delete']"
          type="danger"
          size="mini"
          @click="handleDelete(scope.row)"
        >删除</el-button>-->
      </el-row>
      <!-- 查询结果 -->
      <el-table
        ref="table"
        @row-click="handleRowClick"
        v-loading="listLoading"
        :data="list"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="用户ID" prop="userId" sortable />

        <el-table-column align="center" label="用户邮箱" prop="userMail" />

        <el-table-column align="center" label="关注微博" prop="weiboId" />

        <el-table-column align="center" label="微博用户" prop="weiboName" />

        <el-table-column align="center" label="是否发送邮件">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.sendSwitch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="changeSwitch(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改对话框 -->
    <el-dialog
      title="新增关注用户"
      :visible.sync="addVisiable"
      v-if="addVisiable"
      :fullscreen="fullScreenFlag"
      width="40%">
      <sendListAdd @closeDialog="closeDialog()" @refresh="refresh()"></sendListAdd>
    </el-dialog>
  </div>
</template>

<script>
import { roleOptions } from '@/api/role'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // S
import sendListAdd from './sendListAdd'// econdary package based on el-pagination


export default {
  name: 'sendList',
  components: { Pagination ,sendListAdd},
  data() {
    return {
      fullScreenFlag:false,
      value:"0",
      addVisiable:false,
      selectedRows: [],
      uploadPath,
      list: null,
      total: 0,
      roleOptions: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userId:"",
        weiboId: undefined,
        sort: 'weibo_id',
        order: 'desc',
      },
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: [],
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
      },
      rules: {
        username: [
          { required: true, message: '管理员名称不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
      },
      downloadLoading: false,
      selectedRow: {},
    }
  },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken(),
      }
    },
  },
  created() {
    this.getList()
    // roleOptions().then((response) => {
    //   this.roleOptions = response.data.data.list
    // })
  },
  methods: {
    refresh(){
      this.getList()
    },
    closeDialog(){
      this.addVisiable = false
    },
    changeSwitch(data){
      let sendSwitch = data.sendSwitch
      let id = data.id
      let info = ''
      if(sendSwitch ==='1'){
        info = '是否开启通知?'
      }else{
        info = '是否关闭通知?'
      }
      this.$confirm(info)
        .then(()=> {
          this.$http({
            url: '/weibo/sendList/updateSendSwitch',
            method: 'post',
            data: {id:id,sendSwitch:sendSwitch},
          })
            .then((response) => {
              this.$success("更新成功!")
            })
            .catch((error) => {
                this.$error(error)
            })
        })
        .catch(()=> {
          if(sendSwitch ==='1'){
            data.sendSwitch = '0'
          }else{
            data.sendSwitch = '1'
          }
          this.$error("取消操作!")
        });
    },
    formatRole(roleId) {
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].value) {
          return this.roleOptions[i].label
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      this.listQuery.userId = this.$session.get('userId')
      this.$http({
        url: '/weibo/sendList/list',
        method: 'post',
        params: this.listQuery,
      })
        .then((response) => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.selectedRow = {}
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: [],
      }
    },
    uploadAvatar: function (response) {
      this.dataForm.avatar = response.data.url
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    add(){
      this.fullScreenFlag = this.mobileFlag()
      this.addVisiable = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createAdmin(this.dataForm)
            .then((response) => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加管理员成功',
              })
            })
            .catch((response) => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg,
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateAdmin(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新管理员成功',
              })
            })
            .catch((response) => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg,
              })
            })
        }
      })
    },
    handleDelete(row) {
      deleteAdmin(row)
        .then((response) => {
          this.$notify.success({
            title: '成功',
            message: '删除管理员成功',
          })
          this.getList()
        })
        .catch((response) => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg,
          })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['管理员ID', '管理员名称', '管理员头像']
        const filterVal = ['id', 'username', 'avatar']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '管理员信息')
        this.downloadLoading = false
      })
    },
    view() {
      let row = this.selectedRow
      let userId = row.userId
      if (!userId) {
        this.$notify.error({
          title: '失败',
          message: '请选择一行数据',
        })
      } else {
        let url = 'https://weibo.com/u/' + userId
        window.open(url)
      }
    },
    handleRowClick(row, column, event) {
      this.selectedRow = row
    },
    mobileFlag() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      if(!flag){
        return false;
      }
      return true;
    }
  },
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>
