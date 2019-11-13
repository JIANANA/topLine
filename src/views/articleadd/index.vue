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
        </el-form-item>
        <!-- 频道部分 -->
        <el-form-item label="频道" prop="channel_id">
          <el-select
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
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="articleAdd(true)">发布</el-button>
          <el-button @click="articleAdd(false)">存入草稿</el-button>
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
export default {
  name: 'ArticleAdd',
  data () {
    return {
      // 定义频道列表数据
      channelList: [],
      addForm: {
        title: '', // 文章标题
        content: '', // 文章标题
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
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
      }
    }
  },
  created () {
    this.getChannelList()
  },
  methods: {
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
    quillEditor
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
