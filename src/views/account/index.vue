<template>
  <div>
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>

      <div class="text item content">
        <div class="lf">
          <el-form
            ref="accountFormRef"
            :model="accountForm"
            :rules="accountFormRules"
            label-width="100px"
          >
            <el-form-item label="姓名" prop="name">
              <el-input style="width:80%" v-model="accountForm.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input
                style="width:80%"
                v-model="accountForm.mobile"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                style="width:80%"
                v-model="accountForm.email"
              ></el-input>
            </el-form-item>
            <el-form-item label="简介">
              <el-input
                style="width:80%"
                v-model="accountForm.intro"
              ></el-input>
            </el-form-item>
            <el-button type="primary" @click="editAccount">更新账户</el-button>
          </el-form>
        </div>
        <div class="rt">
          <!-- 用户头像部分 -->
          <el-upload
            action=""
            :show-file-list="false"
            :http-request="httpRequest"
          >
            <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" width="200" height="200"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      accountForm: {
        // 各个成员来自api参考【2.4 编辑用户资料】
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '' // 简介
      },
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          // 后端要求title长度介于1-7个字符
          {
            min: 1,
            max: 7,
            message: '名字长度介于1-7个字符之间'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  // 获取首屏数据
  methods: {
    // 自定义上传方式
    httpRequest (resource) {
    //   console.log(resource)
      let fd = new FormData()
      // 把图片的信息传递给fd对象以便上传文件
      fd.append('photo', resource.file)
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
        //   console.log(result)
          if (result.data.message === 'OK') {
            this.accountForm.photo = result.data.data.photo
            return this.$message.success('上传头像成功')
          }
        })
        .catch(err => {
          return this.$message.error('上传失败', +err)
        })
    },
    // 编辑用户信息
    editAccount () {
      // 表单校验
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          // axios行动了
          // get/post/put/delete
          // put: 修改，修改全部表单
          // patch：修改，修改部分项目
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                // 提示成功
                this.$message.success('修改账号信息成功')
              }
            })
            .catch(err => {
              return this.$message.error('修改失败：' + err)
            })
        }
      })
    },
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          //   console.log(result)
          if (result.data.message === 'OK') {
            this.accountForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取用户失败' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  justify-content: space-between;
  .lf {
    width: 40%;
    height: 300px;
    // background-color: #f00;
  }
  .rt {
    width: 30%;
    height: 300px;
    background-color: #ccc;
  }
}
</style>
