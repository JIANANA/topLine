<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发布文章</span>
      </div>
      <!-- 表单部分 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
      >
        <!-- 标题部分 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <!-- 内容部分 -->
        <el-form-item label="内容" prop="content">
          <quill-editor v-model="addForm.content"></quill-editor>
        </el-form-item>
        <!-- 封面部分 -->
        <el-form-item label="封面" prop="cover">
          <el-radio-group v-model="addForm.cover.type">
            <el-radio label>全部</el-radio>
            <!-- 注意这里传的数是数值型的,所以这里需要对数据进行绑定将其转换为数字形式的文件 -->
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <ul>
            <li
              class="uploadbox"
              v-for="item in covernum"
              :key="item"
              @click="showDialog(item)"
            >
              <span>点击图标选择图片</span>
              <img
                v-if="addForm.cover.images[item - 1]"
                :src="addForm.cover.images[item - 1]"
                alt=""
              />
              <div v-else class="el-icon-picture-outline"></div>
            </li>
          </ul>
        </el-form-item>
        <!-- 频道部分 -->
        <el-form-item label="频道" prop="channel_id">
          <!-- <el-select
            v-model="addForm.channel_id"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
          <!-- 使用频道列表组件 -->
          <!-- 此时什么也不填,发现结构已经出来了,但是当我们切换的时候发现数据还是没有出现,所以这里 -->
          <!-- 子组件定义一个事件来接收当前改变参数(第三者存值),这里是要把子组件的值传递到外面 ,就需要使用事件绑定的方法,
          然后在子组件中使用this.$emit('事件名',参数...)-->
          <channel-com @slt="selectHandler"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="articleAdd(true)">发布</el-button>
          <el-button @click="articleAdd(false)">存入草稿</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="70%">
        <!-- 由于浮动的影响这里需要清除一下浮动让ul的宽度不为0 -->
        <ul class="clear">
          <li
            class="image-box"
            v-for="item in imageList"
            :key="item.id"
            ref="getli"
          >
            <img :src="item.url" alt="没有图片" @click="clkImage" />
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="imageOK">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
// 引入频道列表组件
import ChannelCom from '@/components/channel.vue';
export default {
  name: 'ArticleAdd',
  data () {
    return {
      // 定义一个变量,记录当前图片的路径
      materialUrl: '',
      // 在数据中定义个变量接收当前的值
      xu: '',
      // 定义频道列表数据
      // channelList: [],
      imageList: [], // 素材图片列表
      addForm: {
        title: '', // 文章标题
        content: '', // 文章标题
        cover: {
          type: 3, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道信息
      },
      //   定义表单的验证规则
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },
      dialogVisible: false,
      // 获取素材图片的条件参数
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      materialUrl: ''
    }
  },
  computed: {
    // 经过观察我们可以知道此时的type类型和图片的显示张数有着必然的关系,当图片type大于0时他的显示张数就是他的类型数,
    covernum () {
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      } else {
        return 0
      }
    }
  },
  created () {
    this.getImageList()
  },
  methods: {
    // 此时点击发现上传完成之后再次传值,还是会出现被选中的情况,此时需要在清除边框,并且在清除边框的同时,将图片路径也清除
    clearImage () {
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = '';
      }
      this.materialUrl = '';
    },
    imageOK () {
      if (this.materialUrl) {
        // 给添加文章的表单域成员cover.image增加素材图片请求地址信息
        this.addForm.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false // 关闭对话框
        this.clearImage()
        // 由于我们使用的是element-ui的组件,在这个组件本身就有一个关闭的方法,我们可以在关闭的时候清除也可以
      } else {
        this.$message.error('咋地，不挑一个再走啊')
      }
    },
    // 获取图片的高亮效果
    clkImage (evt) {
      // console.log(evt)输出是一个鼠标事件
      // evt.target是一个DOM对象
      this.clearImage()
      // this.$refs.getli.style.height = 100 + 'px'
      // console.log(this.$refs.getli)
      evt.target.parentNode.style.border = '6px solid red';
      this.materialUrl = evt.target.src
    },
    // 获取素材图片列表
    getImageList () {
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('获得素材图片列表错误:' + err)
        })
    },
    // 添加显示对话框
    showDialog (n) {
      // 当显示对话框的时候记录三个之中的哪个图片被选中了
      this.xu = n - 1
      // 显示对话框的时候记录点击图片的成员
      this.dialogVisible = true
    },
    // 定义子组件的方法
    selectHandler (val) {
      // console.log(val + '---val')
      this.addForm.channel_id = val
    },
    //   获取频道列表数据
    // getChannelList () {
    //   var pro = this.$http.get('/channels')
    //   pro
    //     .then(result => {
    //       if (result.data.message === 'OK') {
    //         this.channelList = result.data.data.channels
    //       }
    //     })
    //     .catch(err => {
    //       return this.$message.error('获得文章频道错误：' + err)
    //     })
    // },
    // 文章添加功能
    articleAdd (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          var pro = this.$http.post('/articles', this.addForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              // console.log(result)
              this.$message.success('发布文章成功')
              this.$router.push('/article')
            })
            .catch(err => {
              return this.$message.error('用户信息出错' + err)
            })
        }
      })
    }
  },
  components: {
    quillEditor,
    ChannelCom
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.clear {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
