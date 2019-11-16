<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发布文章</span>
        <!--
            这里我们采用的是默认的post方式上传文件,第一次点击上传发现报了401的错误,
            主要是因为我们这里提交的直接是ajax请求,我们的axios的拦截器并不能拦截到其他的ajax请求
            经过查阅文档我们发现,可以给上传文档添加一个请求头,请求头加上token信息
            由于此时的token信息是以字符串的形式存储在客户端的,我们取的时候需要转换再添加到对象中,
            所以这里我们需要通过计算属性的方式来获取相关的值
            当设置好token之后发现此时的401信息不报错了,但是又报了400的错误,主要是因为上传文件的字段名不存在,这里需要设置name属性
         -->
        <el-upload
          style="float: right; padding: 3px 0"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="setToken"
          name="image"
          :show-file-list="false"
          :on-success="onSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div class="text item">
        <ul>
          <li class="image-box" v-for="item in imgList" :key="item.id">
            <!-- 中间的图片 -->
            <img :src="item.url" alt />
            <div class="image-bot">
              <el-button
                type="success"
                icon="el-icon-star-off"
                circle
              ></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgList: [],
      // 提前声明好要传递的参数对象
      querycdt: {
        collect: false,
        page: 1,
        per_page: 20
      }
    }
  },
  computed: {
    setToken () {
      let token = JSON.parse(window.sessionStorage.getItem('userinfo')).token
      return { Authorization: 'Bearer ' + token }
    }
  },
  created () {
    // 获取图片的首屏数据
    this.getImgList()
  },
  methods: {
    // 上传图片成功回调处理函数
    onSuccess () {
    //   console.log(123)
      this.$message.success('图片上传成功')
      // 上传图片成功之后需要重新加载首屏数据
      this.getImgList()
    },
    // 获取首屏加载的图片数据
    getImgList () {
      // 查看接口文档可知,在获取图片列表的数据中需要传递参数
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          //   console.log(result)
          this.imgList = result.data.data.results
        })
        .catch(err => {
          return this.$message.error('获取图片信息失败' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
// 素材图片列表样式
.image-box {
  list-style: none;
  width: 200px;
  height: 200px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  img {
    width: 200px;
    height: 140px;
  }
  .image-bot {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
</style>
