<template>
  <div>
    <el-button @click="handleToLogin">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    handleToLogin() {
      // 清空token
      window.sessionStorage.clear()
      // 编程式导航跳转到登录页
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
</style>>
