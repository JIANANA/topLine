<template>
  <div>
    <!-- 观察网站可以发现下面是两个卡片区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!-- 搜索文章区域 -->
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm">
          <el-form-item label="文章状态:">
            <!-- 注意:这里的绑定的是绑定在el-group-radio -->
            <el-radio-group
              v-model="searchForm.status"
              @change="getArticleList()"
            >
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
          </el-form-item> -->
          <!-- 频道列表区域 -->
          <el-form-item label="频道列表：">
            <el-select
              v-model="searchForm.channel_id"
              placeholder="请选择"
              clearable
              @change="getArticleList()"
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
          <!-- 时间选择区域 -->
          <el-form-item label="时间选择: ">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 文章列表展示评论区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{ tot }}条符合条件的内容</span>
      </div>
      <!-- 表格文章展示区域 -->
      <el-table :data="articleList">
        <el-table-column label="图标">
          <!-- 在我们获取数据的时候服务端以网络图片的形式给我们发送了数据,这时我们的数据是已知的,
          假设el-table-column是一个父组件此时图片标签就是一个插槽,数据已知的情况下只需要图片,所以这里需要的就是一个作用域插槽
           -->
          <img
            :src="stData.row.cover.images[0]"
            slot-scope="stData"
            alt="没有图片"
            width="150"
            height="100"
          />
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态" prop="status">
          <!-- <el-tag v-if="stData.row.status===0" slot-scope="stData">草稿</el-tag>
          <el-tag type="success" v-else-if="stData.row.status===1" slot-scope="stData">待审核</el-tag>
          <el-tag type="info" v-else-if="stData.row.status===2" slot-scope="stData">审核通过</el-tag>
          <el-tag type="warning" v-else-if="stData.row.status===3" slot-scope="stData">审核失败</el-tag>
          <el-tag type="danger" v-else>已删除</el-tag> -->
          <template slot-scope="stData">
            <el-tag v-if="stData.row.status === 0">草稿</el-tag>
            <el-tag type="success" v-else-if="stData.row.status === 1"
              >待审核</el-tag
            >
            <el-tag type="info" v-else-if="stData.row.status === 2"
              >审核通过</el-tag
            >
            <el-tag type="warning" v-else-if="stData.row.status === 3"
              >审核失败</el-tag
            >
            <el-tag type="danger" v-else>已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="stData">
            <el-button type="primary" size="mini">修改</el-button>
            <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'articleList',
  data () {
    return {
      // 定义时间中间值进行操作,通过调试工具可以知道,这个结果是一个数组形式的值,我们需要把他取出来放在searchForm中的两个对应的开始值和结束值
      // 由于两个值是实时变化的,如果两个值直接定义则不会传双向绑定,这里我们需要用到一个侦听器watch来实时监测这个开始日期和结束日期的变化
      timetotime: [],
      // 给文章单独的定义一个数据,让他来进行数据的获取
      articleList: [],
      // 定义频道勒边的假数据
      channelList: [
        //   假数据
        // { id: 101, name: 'html' },
        // { id: 102, name: 'ajax' },
        // { id: 103, name: 'nodejs' }
      ],
      // 表单域内绑定的数据
      searchForm: {
        //   文章的审核状态,设置为0,默认选中是全部的状态
        status: '',
        // 定义频道列表的id
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10
      },
      tot: 0
    }
  },
  watch: {
    //   过滤器中有两个参数,第一个是新值,第二个是旧值
    timetotime (newVal) {
      //   console.log(newVal)经检验可以知道上面的值获取的是一个数组形式的值
      // 此时可以通过判断newVal是否有值,如果有值就需要把值给文章的开始日期和结束日期
      if (newVal) {
        // let [this.searchForm.begin_pubdate, this.searchForm.end_pubdate] = newVal
        // console.log(begin_pubdate, end_pubdate)
        this.searchForm.begin_pubdate = newVal[0]
        this.searchForm.end_pubdate = newVal[1]
        // 经过调试工具的观察,此时的值已经是双向绑定了
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      this.getArticleList()
    }
  },
  created () {
    // 获取频道列表功能
    this.getChannelList()
    // 获取文章列表功能
    // 经过直接调用接口发现数据有问题,报错401,主要是因为缺少token的指令,所以这里我们需要用到一个认证信息,而这个信息是直接写到axios的拦截器中的
    this.getArticleList()
  },
  methods: {
    // 这里使用的是每次变化的条数
    handleSizeChange (val) {
      this.searchForm.per_page = val
      this.getArticleList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.getArticleList()
    },
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          //   console.log(result)
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          //   console.log(err)
          return this.$message.error('获取用户频道失败' + err)
        })
    },
    // 获取文章列表功能
    getArticleList () {
      // 把 searchForm为空的时候都去掉,然后再重新赋值一个信息的对象
      let searchData = {}
      // 对searchForm进行遍历
      for (var k in this.searchForm) {
        // 遍历的时候需要判断一下当前的值是否存在
        if (this.searchForm[k]) {
          searchData[k] = this.searchForm[k]
        }
      }
      // 在传参数的时候,当频道id为空或者是status的值为空的时候,就会出现检验不准确的情况,所以这里我们要提前对其进行判断
      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          // console.log(result)
          this.articleList = result.data.data.results
          // console.log(this.articleList)
          this.tot = result.data.data.total_count
        })
        .catch(err => {
          return err
        })
    },
    del (id) {
      // console.log(id)
      let pro = this.$http.delete(`/articles/${id}`)
      pro
        .then(result => {
          // console.log(result)
          this.$message.success('文章删除成功')
          this.getArticleList()
        })
        .catch(err => {
          return this.$message.error('删除失败' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
