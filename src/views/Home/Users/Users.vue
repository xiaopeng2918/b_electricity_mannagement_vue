<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 输入框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryParams.query"
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
          >
            <el-button
              @click="handleQuery"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true" type="primary"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" style="width: 100%" border :stripe="true">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="handleStateChange(scope.row.mg_state, scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleEditUser(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
            <el-button
              @click="handleDeleteUser(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="small"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 新增弹窗 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetFields(`addFormRef`)"
    >
      <el-form
        ref="addFormRef"
        label-position="right"
        label-width="80px"
        :model="addFormData"
        :rules="addFormDataRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetFields(`editFormRef`)"
    >
      <el-form
        ref="editFormRef"
        label-position="right"
        label-width="80px"
        :model="editFormData"
        :rules="editFormDataRules"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit(id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义表单邮箱验证规则
    var regEmail = (rule, value, callback) => {
      const result = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)
      if (!result) {
        callback(new Error('请输入合法邮箱'))
      } else {
        callback()
      }
    }
    // 自定义表单手机号验证规则
    var regMobile = (rule, value, callback) => {
      const result =
        /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
          value
        )
      if (!result) {
        callback(new Error('请输入合法手机号'))
      } else {
        callback()
      }
    }
    return {
      // 用户列表查询参数
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      // 保存用户列表数据
      userList: [],
      // 保存页数
      total: 1,
      // 新增弹窗是否显示
      addDialogVisible: false,
      editDialogVisible: false,
      // 新增弹窗表单数据
      addFormData: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 编辑弹窗表单数据
      editFormData: '',
      // 编辑表单收取用户id，用于表单发出修改用户的id
      id: '',
      // 新增弹窗表单数据验证规则
      addFormDataRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: regEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: regMobile, trigger: 'blur' },
        ],
      },
      // 编辑弹窗表单数据验证规则
      editFormDataRules: {
        username: [
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: regEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: regMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 删除用户
    async handleDeleteUser(id) {
      const option = await this.$Confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      /* 取消则option为cancel
        确定则option为confirm
       */
      if (option === 'cancel') {
        this.$Message.info('已取消删除')
      } else if (option === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$Message.error('删除失败')
        } else {
          this.$Message.success('删除成功')
          this.getUserList()
        }
      }
    },
    // 编辑用户信息
    async handleEditUser(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$Message.error('获取用户信息失败')
      }
      this.editFormData = res.data
      this.editDialogVisible = true
    },
    // 修改用户预验证，并且发送请求
    editUserSubmit() {
      this.$refs.editFormRef.validate(async (result) => {
        if (!result) return
        const { data: res } = await this.$http.put(
          `users/${this.editFormData.id}`,
          {
            email: this.editFormData.email,
            mobile: this.editFormData.mobile,
          }
        )
        if (res.meta.status !== 200) return this.$Message.error('修改错误')
        this.$Message.success(res.meta.msg)
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新列表
        this.getUserList()
      })
    },
    // 添加用户预验证，并且发起请求
    addUserSubmit() {
      this.$refs.addFormRef.validate(async (result) => {
        // result 表单预验证通过为true 未通过为false
        if (!result) return
        const { data: res } = await this.$http.post('users', this.addFormData)
        if (res.meta.status !== 201) {
          return this.$Message.error('用户创建失败，server')
        }
        // 打印添加成功信息
        this.$Message.success(res.meta.msg)
        // 关闭添加弹窗
        this.addDialogVisible = false
        // 重新获取数据
        this.getUserList()
      })
    },
    // 当添加弹窗关闭时的回调函数，重置表单数据
    /*  参数为重置表单的ref
     */
    resetFields(ref) {
      this.$refs[ref].resetFields()
    },
    // 查询筛选数据
    handleQuery() {
      this.getUserList()
    },
    // 每页数量发生改变时
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getUserList()
    },
    // 页面切换请求对应页数据
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getUserList()
    },
    // 当用户状态发生改变时回调函数，保存数据到服务端
    async handleStateChange(boolean, id) {
      const { data: res } = await this.$http.put(`users/${id}/state/${boolean}`)
      if (res.meta.status !== 200) {
        this.$Message.error('修改用户状态失败')
      } else {
        this.$Message.success(res.meta.msg)
      }
    },
    // 获取用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams,
      })
      if (res.meta.status !== 200) {
        return this.$Message.error(res.meta.msg)
      } else {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>>
