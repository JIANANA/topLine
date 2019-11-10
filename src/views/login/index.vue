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
          >
           <i slot="prefix" class="iconfont icon-shoujihao"></i>
          </el-input>
        </el-form-item>
        <!-- 请输入验证码部分 -->
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
          >
           <i slot="prefix" class="iconfont icon-yanzhengma"></i>
          </el-input>
        </el-form-item>
        <!-- 复选框部分 -->
        <el-form-item style="text-align:left;" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <!-- 登录部分 -->
        <el-form-item>
          <el-button
          type="primary"
          style="width:100%"
          :loading="isloading"
          :disabled="isloading"
          @click="login()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 由于gt文件只在本文件中使用,所以可以不用引入在main.js中,而且由于该文件没有导出的选项,所以我们这里可以不用给他起别名,直接导入整个文件即可
import '@/assets/js/gt.js'
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
        xieyi: true
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
      },
      isloading: false,
      catObj: null
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
        // 这里需要对人机交互进行验证,此时需要获取并引入gt.js文件
        // 这里人机交互的时候需要向服务端发送请求,请求发送完毕之后拿到相关信息进行操作
        // 根据接口文档发送请求
        let pro = this.$http.get(`captchas/${this.loginForm.mobile}`)
        // 然后在每次发送请求之前对缓存的对象进行判断
        if (this.catObj !== null) {
          return this.catObj.verify()
        }
        pro
          .then(result => {
            if (result.data.message === 'OK') {
              let{ data } = result.data
              // 在此处调用这个方法前面必须加window
              window.initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                // 在行为验证中,绝大多数真实用户点击一下即可通过验证,但是考虑到实际风险情况,被行为验证
                // 被行为验证判定为有风险的请求，会进入下个阶段的验证。此时，行为验证提供了弹出二级验证的交互样式，方便用户兼容自己本身的界面。
                product: 'bind'
              }, (captchaObj) => {
                // 这里可以调用验证实例 captchaObj 的实例方法
                captchaObj.appendTo('#app') // 将验证按钮插入到宿主页面中captchaBox元素内
                captchaObj.onReady(() => {
                  // 对于这个创建的弹框而言每次都是重新创建,所以这里可以缓存一下
                  this.catObj = captchaObj
                  // 当请求发送出去,这时可以判断按钮的状态
                  this.isloading = true
                  // 验证码ready之后才能调用verify方法显示验证码
                  this.catObj.verify()
                }).onSuccess(() => {
                // 验证成功之后到服务端验证用户是否真实
                  this.isloading = false
                  this.getAct()
                }).onError(() => {

                })
              })
            }
          })
          .catch(err => {
            return this.$message.error('用户名或密码错误' + err)
          })
      })
    },
    // 为了让页面的代码更加的整洁,这里单独把真实验证提取出来一个方法,然后再登录方法中调用即可
    getAct () {
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
