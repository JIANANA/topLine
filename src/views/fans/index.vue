<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>粉丝管理</span>
      </div>
      <div class="text item">
        <div id="main" ref="ecRef"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 下载并引入echarts
import echarts from 'echarts'
export default {
  mounted () {
    this.getEcharts()
  },
  methods: {
    //   由于使用了插件,如果只是在data中定义这个元素,则
    getEcharts () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.ecRef)

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
#main {
  width: 500px;
  height: 500px;
  background-color: #eee;
}
</style>
