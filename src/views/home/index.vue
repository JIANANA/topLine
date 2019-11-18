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
          <el-menu-item index="/material">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="/fans" :style="{width:isCollapse?'65px': '200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/account" :style="{width:isCollapse?'65px': '200px'}">
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
// 导入bus
import bus from '@/utils/bus.js'
export default {
  data () {
    return {
      isCollapse: false,
      tmpname: '',
      tmpphoto: ''
    }
  },
  created () {
    // 对name进行更新操作
    // 在home的create函数中声明$on事件,为了保证this指向要保证是箭头函数
    bus.$on('upAccountName', nm => {
      // console.log(val)
      // 经过打印发现当前修改的值已经传输过来了,所以这里我们可以对其进行一些相关的操作
      // 我们想要修改属性值,但是发现是计算属性,虽然用法一样,但是计算属性还是不等于data值,
      // 所以我们可以定义一个临时的数据进行接收
      this.tmpname = nm
      // 所以这里需要在更新成功之后将临时的数据存入到内存之中
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.name = this.tmpname
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 经检验此时已经更新成功了
    })
    // 对头像进行更新操作
    bus.$on('upAccountPhoto', ph => {
      // console.log(val)
      // 经过打印发现当前修改的值已经传输过来了,所以这里我们可以对其进行一些相关的操作
      // 我们想要修改属性值,但是发现是计算属性,虽然用法一样,但是计算属性还是不等于data值,
      // 所以我们可以定义一个临时的数据进行接收
      this.tmpphoto = ph
      // 所以这里需要在更新成功之后将临时的数据存入到内存之中
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.photo = this.tmpphoto
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 经检验此时已经更新成功了
    })
  },
  computed: {
    name () {
      // 这里可以通过短路语法的方式,进行逻辑或的操作,经检验此时已经更新成功了,但是内存中并未更新成功
      return this.tmpname || JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return this.tmpphoto || JSON.parse(window.sessionStorage.getItem('userinfo')).photo
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
