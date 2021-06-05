<template>
  <div class="login_containter">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../../assets/avatar.jpg" alt="">
      </div>
      <div class="form_box">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <!-- 登录用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 登录密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-password"></el-input>
          </el-form-item>
          <!-- 登录重置按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="handleLogin" plain>登录</el-button>
            <el-button type="info" @click="handleResetForm" plain>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录页表单绑定数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录页表单验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    handleResetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 进行表单预验证，通过再进行登录请求
    handleLogin () {
      this.$refs.loginFormRef.validate(async (result) => {
        if (!result) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$Message.error('登录失败')
        this.$Message.success('登录成功')
        /* 将登录成功的token，保存到客户端的sessionStorage中
          token 只是在当前页面会话期间生效，所以token保准在sessionStorage中
        */
        window.sessionStorage.setItem('token', res.data.token)
        // 编程式导航跳转页面到home页面
        this.$router.push('home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_containter {
    height: 100%;
    background-color: #44cef6;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid rgb(233, 9, 9);
      box-shadow: 0 0 10px rgb(233, 9, 9);
      border-radius: 50%;
      position: absolute;
      left: 50%;
      padding: 5px;
      border-color:#fff;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 0 10px rgb(17, 143, 228);
      }
    }
  }

  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
