<template>
  <div class="container">
    <el-container>
      <!-- 左侧侧边导航栏 -->
        <el-aside :width=" isCollapse?'65px': '200px'">
      <el-menu
        background-color="#323745"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        >
        <el-menu-item index="1" :style="{width:isCollapse?'65px': '200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:isCollapse?'65px': '200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/articleadd">发布文章</el-menu-item>
          <el-menu-item index="/article">文章列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" :style="{width:isCollapse?'65px': '200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="4" :style="{width:isCollapse?'65px': '200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
      <el-container>
        <el-header>
          <!-- 头部左侧黑马区域 -->
          <div class="left">
            <i :class="isCollapse? 'el-icon-s-unfold':'el-icon-s-fold'" @click="isCollapse=!isCollapse"></i>
            <span>江苏传智播客教育科技股份有限公司</span>
          </div>
          <!-- 头部右侧搜索区域 -->
          <div class="right">
            <!-- 搜索框部分 -->
            <el-input
              placeholder="请输入搜索的文章内容"
              prefix-icon="el-icon-search"
              style="width:240px"
            >
            </el-input>
            <span style="margin:0 20px">消息</span>
            <!-- 下拉菜单 -->
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <img
                  :src="photo"
                  alt
                  width="40"
                  height="40"
                  style="margin-right:10px; border-radius:50%"
                />
                {{ name }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>github地址</el-dropdown-item>
                <!-- 由于这里组件内没有对点击事件进行封装,所以这里需要加事件修饰符对他进行修饰 -->
                <el-dropdown-item @click.native="logout()"
                  >退出</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    name () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  methods: {
    logout () {
      this.$confirm('确认退出登录么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      width: 200px;
      height: 100%;
      background-color: #333744;
    }
    .el-header {
      height: 60px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      min-width: 800px;
      padding: 0 9px 0 10px;
      .left {
        height: 100%;
        width: 40%;
        // background-color: #127;
        display: flex;
        align-items: center;
        font-size: 20px;
      }
      .right {
        height: 100%;
        width: 50%;
        // background-color: pink;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .el-dropdown-link {
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
    }
  }
}
</style>
