<template>
  <div>
    <!--搜索卡片区-->
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!--匿名插槽，内容主体-->
      <div class="text item">
        <!--el-form搜索表单区域-->
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio-group v-model="searchForm.status">
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表：">
            <!-- <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable > -->
              <!--label:小项目对外提示名称-->
              <!--value:小项目本身的value值-->
              <!-- <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select> -->
            <!-- 同样的,这里的数据也是子组件的数据已知,想要传递给父组件 -->
            <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item label="时间选择：">
            <!--type:日期选取器类型 year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange-->
            <!--value-format:设置接收日期的格式为 年-月-日-->
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--文章列表卡片区-->
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <!--匿名插槽，内容主体-->
      <div class="text item">
        <!--table表格组件应用-->
        <!--data:数据来源的/数组对象集[{},{},{}..]-->
        <el-table :data="articleList">
          <!--el-table-column：定义表格各个"列"的-->
          <!--label：定义表格表头-->
          <!--prop：定义数据属性名称字段-->
          <el-table-column label="图标">
            <!--图标效果：html标签+数据部分(作用域插槽提供数据)-->
            <!-- <span slot-scope="stData">{{stData.row}}</span>当前每个文章记录对象
            { "id": 1194184832490406000, "title": "什么空间到拉萨？", "status": 0, "cover": { "type": 1, "images": [ "http://toutiao.meiduo.site/FrJ2hbwX8-kHG1cmhKRozkK483he" ] }, "pubdate": "2019-11-12 17:27:05" }-->
            <img
              :src="stData.row.cover.images[0]"
              slot-scope="stData"
              alt="没有图标"
              width="150"
              height="100"
            >
          </el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="状态" prop="status">
            <!--通过template统一设置接收作用域插槽数据-->
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-else type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发表时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作">
            <!--内容区域设置当前列显示的信息-->
            <template slot-scope="stData">
              <el-button type="primary" size="mini" @click="articleedit(stData.row.id)">修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text item">
        <!--分页
          @size-change="handleSizeChange" // 每页显示条数变化的回调事件处理，需要methods声明方法
          @current-change="handleCurrentChange" //  当前页码变化的回调事件处理，需要methods声明方法
          :current-page="currentPage4" // 默认当前页码
          :page-sizes="[100, 200, 300, 400]" // 下拉列表，设置每页显示条数
          :page-size="100" // 默认每页显示条数
          layout="total, sizes, prev, pager, next, jumper" // 分页组件构件
          :total="400" // 记录总条数
        -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchForm.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tot"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import ChannelCom from '@/components/channel.vue'
export default {
  // 每个组件都起一个名字
  name: 'ArticleList',
  // 监听器(data)
  watch: {
    // status变化的回调处理
    // 'searchForm.status': function (newv, oldv) {
    //   // 更新相关文章即可
    //   // this.getArticleList()
    // },
    // data名称: function (newv, oldv) {
    //   newv: data更新后的值
    //   oldv: data更新前的旧值
    // }
    timetotime: function (newv, oldv) {
      if (newv) {
        // 把newv拆分为两份赋予给begin_pubdate 和 end_pubdate
        this.searchForm.begin_pubdate = newv[0]
        this.searchForm.end_pubdate = newv[1]
      } else {
        // 清除时间条件信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      // 根据新的 begin_pubdate 和 end_pubdate 筛选文章
      // this.getArticleList()
    },
    // 对searchForm的各个成员多深度监听，统一筛选获得文章
    searchForm: {
      handler: function (newv, oldv) {
        this.getArticleList()
      },
      deep: true
    }
  },
  data () {
    return {
      timetotime: '', // 临时成员，接收范围时间，后期分配给begin_pubdate和end_pubdate，接收到数组信息，里边有两个时间而已
      channelList: [], // 频道列表
      articleList: [], // 文章列表
      searchForm: {
        status: '', // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        channel_id: '', // 频道信息
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        page: 1, // 默认获取第1页数据
        per_page: 10 // 每页获得10条记录
      },
      tot: 0 // 文章总记录条数
    }
  },
  created () {
    // 获得频道列表
    this.getChannelList()
    // 获得文章列表
    this.getArticleList()
  },
  methods: {
    // 定义一个方法接收参数
    selectHandler (val) {
      this.searchForm.channel_id = val
    },
    // 点击修改文章
    articleedit (id) {
      // console.log(123)
      // 这里采用了路由传参的方式,把要修改的id传入到对应的文件中
      this.$router.push(`/articleedit/${id}`)// 经过观察发现id已经成员传入到url文件中
      // id传入到ur中就需要通过id获取数据填充到响应的页面中
    },
    // 删除文章数据
    del (id) {
      this.$confirm('确认要删除该数据么？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // axios.get()查询/post()添加/put()修改/delete()删除
        let pro = this.$http.delete(`/articles/${id}`)
        pro
          .then(result => {
          // 页面刷新即可
            this.getArticleList()
          })
          .catch(err => {
            return this.$message.error('删除文章失败:' + err)
          })
      }).catch(() => { })
    },
    // 分页相关
    // 每页显示条数变化的回调事件处理
    handleSizeChange (val) {
      // val: 更新后的每页条数
      // console.log(val)
      // 更新per_page
      this.searchForm.per_page = val
      // 重新获得数据
      // this.getArticleList()
    },
    // 当前页码变化的回调事件处理
    handleCurrentChange (val) {
      // val:变化后的当前页码
      // console.log(val)
      // 把变化后页码赋予给page成员
      this.searchForm.page = val
      // 根据变化后页码重新获得数据
      // this.getArticleList()
    },
    // 获得文章列表信息
    getArticleList () {
      // 把空的筛选条件都去除
      let searchData = {} // 筛选后的条件数据
      for (var i in this.searchForm) {
        // i：代表遍历出来对象的成员属性名称： status、channel_id、page等等
        if (this.searchForm[i]) {
          searchData[i] = this.searchForm[i]
        }
      }

      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把获得好的文章信息赋予给articleList成员
            this.articleList = result.data.data.results
            // 把总条数赋予给tot成员
            this.tot = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('获得文章错误:' + err)
        })
    },
    // 获得频道
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          // console.log(result) // config 【data】 request headers  status statusText
          if (result.data.message === 'OK') {
            // 把获得好的频道给与channelList成员
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获得频道错误:' + err)
        })
    }
  },
  components: {
    ChannelCom
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
}
/*分页样式*/
.el-pagination {
  margin-top: 15px;
}
</style>
