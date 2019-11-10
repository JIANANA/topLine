<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 请输入电话部分 -->
      <!-- 给输入框添加自然方式的验证 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 图片部分 -->
        <img src="./logo_index.png" alt="" />
        <el-form-item prop=" mobile">
          <el-input
            v-model="loginForm.mobile"
            placeholder="请输入电话号码"
          ></el-input>
        </el-form-item>
        <!-- 请输入验证码部分 -->
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
          ></el-input>
        </el-form-item>
        <!-- 复选框部分 -->
        <el-form-item style="text-align:left;" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <!-- 登录部分 -->
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义校验方式需要给复选框进行校验
    var xieyiTest = (rule, value, callback) => {
      // if (value) {
      //   callback()
      // } else {
      //   return callback(new Error('请遵守协议'))
      // }
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      // mobile: "Missing required parameter in the JSON body"
      loginForm: {
        // 注意这里的参数问题,一定要跟接口文档中的保持一致
        mobile: '15003870907',
        code: '246810',
        xieyi: false
      },
      // 注意上面的规则验证跟这里要一致,上面使用的是:rules的方式绑定了一个规则属性
      loginFormRules: {
        // 这里既可以给手机添加提示框的信息,也可以给添加简单的正则验证
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        xieyi: [
          { validator: xieyiTest }
        ]
      }
    }
  },
  methods: {
    // 登录功能
    login () {
      // console.log(123)
      // 给登录功能添加表单验证的方式
      // 对于整个表单进行校验的方式是通过登录方法的时候进行验证的,在表单验证中有一个validate的方法
      // 这个方法
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        // 在这里判断前面客户端的验证都通过之后,需要对服务端发送axios请求
        // 这里得到是一个promise的对象,这里可以通过.then.catch的方式获得,但是我们之前学过async函数,所以可以将异步的任务变成是同步的任务进行相关的操作
        // console.log(this.loginForm)
        var pro = this.$http.post('/authorizations', this.loginForm)
        console.log(this.loginForm)
        // console.log(res.data)
        pro
          .then(result => {
            // console.log(result)
            if (result.data.message === 'OK') {
              // 判断客户端验证成功,将数据存储在客户端
              window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
              this.$router.push({ name: 'home' })
            }
          })
          .catch(err => {
            return this.$message.error('用户名或密码错误' + err)
          })

        // const { data: res } = await this.$http.post('/authorizations', this.loginForm)
        // console.log(res.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  img {
    width: 50%;
    margin: 20px auto;
  }
  .login-box {
    width: 410px;
    height: 360px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      width: 75%;
      .el-checkbox {
        margin-right: 20px;
      }
    }
  }
}
</style>
