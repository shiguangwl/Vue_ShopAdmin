<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- 黑马logo -->
        <img src="../assets/logo.png" alt="">
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="tuichu()"> 退出 </el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asidewidth" collapse>
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :default-active='activePath'
          active-text-color="#ffd04b"
          :router=true>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item :index="'/'+subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体结构 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      asidewidth: '200px',
      isCollapse: false,
      // 左侧菜单数据
      menuList: null,
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: ''
    }
  },
  created () {
    // 在created阶段请求左侧菜单数据
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    tuichu () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      // 发送请求获取左侧菜单数据
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.menuList = res.data
      console.log(res)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      this.asidewidth = !this.isCollapse ? '200px' : '60px'
    },
    saveNavState (path) {
      // 点击二级菜单的时候保存被点击的二级菜单信息
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style scoped lang="less">
  .home-container {
    height: 100%;
  }
  .el-header{
    img{
      width: 60px;
      height: 60px;
    }
    background-color:#373D41;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 20px;
    > div{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .el-aside{
    background-color:#333744;
  }
  .el-main{
    background-color:#eaedf1;
  }
  .toggle-button{
    text-align: center;
  }
</style>
