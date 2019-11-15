<template>
  <!-- 由于频道列表在三个组件中都有这个数据,所以这里我们把他们单独抽离出来,作为一个组件来进行使用 -->
  <el-select v-model="chid" placeholder="请选择" clearable>
    <el-option
      v-for="item in channelList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'channelCom',
  data () {
    return {
      chid: '',
      // 声明数据
      channelList: []
    }
  },
  props: {
    cid: {
      default: 0
    }
  },
  created () {
    //   获取频道列表首屏数据
    this.getChannelList()
  },
  watch: {
    cid: function (newV, oldV) {
      this.cid = newV
    },
    chid: function (newV, oldV) {
      // console.log(this.chid)
      this.$emit('slt', this.chid)
    }
  },
  methods: {
    //   获取频道列表数据
    getChannelList () {
    //   console.log(this.chid)
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
