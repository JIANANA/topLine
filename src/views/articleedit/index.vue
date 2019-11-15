<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发布文章</span>
      </div>
      <!-- 表单部分 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
      >
        <!-- 标题部分 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <!-- 内容部分 -->
        <el-form-item label="内容" prop="content">
          <quill-editor v-model="editForm.content"></quill-editor>
        </el-form-item>
        <!-- 封面部分 -->
        <el-form-item label="封面" prop="cover">
          <el-radio-group v-model="editForm.cover.type">
            <el-radio label>全部</el-radio>
            <!-- 注意这里传的数是数值型的,所以这里需要对数据进行绑定将其转换为数字形式的文件 -->
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 频道部分 -->
        <el-form-item label="频道" prop="channel_id">
          <!-- <el-select
            v-model="editForm.channel_id"
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
          <!-- 此时发现数据以前的获取的数据不显示,这里就需要单独设置子传父 -->
          <channel-com @slt="selectHandler" :cid="editForm.channel_id"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="articleEdit(true)">修改</el-button>
          <el-button @click="articleEdit(false)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'articleEdit',
  data () {
    return {
      // 定义频道列表数据
      channelList: [],
      editForm: {
        title: '', // 文章标题
        content: '', // 文章标题
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道信息
      },
      //   定义表单的验证规则
      editFormRules: {
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
      }
    }
  },
  created () {
    this.getChannelList()
    this.getArticleByAid()
  },
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  methods: {
    //   根据id获取当前的数据
    getArticleByAid () {
      // 由于数据每次都访问this.$route.params.id,所以这里我们把他当计算属性单独抽离出来
      let pro = this.$http.get(`/articles/${this.aid}`)
      pro
        .then(result => {
        //   console.log(result)
          this.editForm = result.data.data
        })
        .catch(err => {
          return this.$message.error('获取数据失败' + err)
        })
    },
    //   获取频道列表数据
    getChannelList () {
      var pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获得文章频道错误：' + err)
        })
    },
    // 文章添加功能
    articleEdit (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          // 注意这里传的参数是aid,也就是通过路由传参获取的路由参数
          var pro = this.$http.put(`/articles/${this.aid}`, this.editForm, {
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
</style>
