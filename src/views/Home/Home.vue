<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="home_header">
        <img src="../../assets/logo_home.jpg" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button @click="handleToLogin">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isToggleMenu ? '64px' : '200px'">
        <div @click="handleToggleMenu" class="toggle_menu">|||</div>
        <el-menu
          background-color="#425066"
          text-color="#fff"
          active-text-color="#177cb0"
          unique-opened
          :collapse="isToggleMenu"
          :collapse-transition="false"
          router
          :default-active="activeMenu"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id.toString()"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconObjs[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="`/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="handleSaveActiveMenu(`/${subItem.path}`)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 接收侧边栏数据
      menuList: [],
      // 根据指定id值绑定图标类名字
      iconObjs: {
        125: 'el-icon-s-custom',
        103: 'el-icon-open',
        101: 'el-icon-sell',
        102: 'el-icon-tickets',
        145: 'el-icon-s-platform',
      },
      // 控制侧边导航栏是否折叠
      isToggleMenu: false,
      // 保存被选中的菜单导航路径到sessionStorage中，防止刷新页面这个状态丢失
      activeMenu: '',
    }
  },
  created() {
    this.getMenuList()
    this.activeMenu = window.sessionStorage.getItem('path')
  },
  methods: {
    // 处理退出按钮
    handleToLogin() {
      // 清空token
      window.sessionStorage.clear()
      // 编程式导航跳转到登录页
      this.$router.push('/login')
    },
    // 控制侧边导航栏折叠
    handleToggleMenu() {
      this.isToggleMenu = !this.isToggleMenu
    },
    handleSaveActiveMenu(navpath) {
      window.sessionStorage.setItem('path', navpath)
      this.activeMenu = window.sessionStorage.getItem('path')
    },
    // 获取侧边栏导航栏数据
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$Message.error(res.meta.msg)
      this.menuList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    background-color: rgb(53, 52, 51);
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    .home_header {
      display: flex;
      align-items: center;
      font-size: 25px;
      color: #fff;
    }
    img {
      height: 50px;
    }
  }
  .el-aside {
    background-color: #425066;
    .el-menu {
      border-right: none;
    }
  }
}
.toggle_menu {
  background-color: #003371;
  font-size: 10px;
  height: 20px;
  text-align: center;
  letter-spacing: 0.5em;
  color: #fff;
  cursor: pointer;
}
</style>>
