<template>
  <div class="m-content pg-mirror" ref="container">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'service'})">服务管理</em> >&nbsp;
        <em @click="$router.push({name: 'service_interview', query: $route.query})">查看</em> >&nbsp;
        <em>状态</em>
      </span>
      <a class="btn-edite">编辑</a>
    </div>
    <div class="wrapper status">
      <h2 class="u-header">实时动态
        <div class="fr">间隔:&nbsp;&nbsp;&nbsp;&nbsp;
          <el-select v-model="interval" placeholder="请选择" class="w60">
            <el-option v-for="(item, i) in intervalOpt" :key="'mirror_'+i" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </div>
      </h2>
      <div class="wrapper-chart">
        <h3 class="u-round-header">内存使用量 (MB)</h3>
        <div class="wrap-radio">
          <div class="radio-inner">
            <div class="chart" id="cpuOccupied"></div>
          </div>
        </div>
      </div>
      <div class="wrapper-chart">
        <h3 class="u-round-header">CPU使用率 (%)</h3>
        <div class="wrap-radio">
          <div class="radio-inner">
            <div class="chart" id="cpuRatio"></div>
          </div>
        </div>
      </div>
      <div class="wrapper-chart">
        <h3 class="u-round-header">网络使用量 (KB)</h3>
        <div class="wrap-radio">
          <div class="radio-inner">
            <div class="chart" id="netOccupied"></div>
          </div>
        </div>
      </div>
      <h3 class="u-round-header" style="margin-bottom:10px;">进程列表</h3>
      <ul class="table-style striped al-center" name="process">
        <li>
          <span>UID</span>
          <span>PID</span>
          <span>PPID</span>
          <span>C</span>
          <span>STIME</span>
          <span>TTY</span>
          <span class="wp10">TIME</span>
          <span class="wp30">CMD</span>
        </li>
        <li v-for="(v, i) in process" :key="i">
          <span>{{v.uid}}</span>
          <span>{{v.pid}}</span>
          <span>{{v.ppid}}</span>
          <span>{{v.c}}</span>
          <span>{{v.stime}}</span>
          <span>{{v.tty}}</span>
          <span class="wp10">{{v.time}}</span>
          <span class="wp30">{{v.cmd}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
import utils from '@/vender/js/utils'
let lineOpt = {
  grid: {
    show: false,
    top: 25,
    left: 15,
    right: 22,
    bottom: 20,
    containLabel: true
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    formatter: '{a}: {c}'
  },
  xAxis: [{
    type: 'category',
    // boundaryGap: false,
    axisLabel: {
      color: '#797c7d',
      rotate: -20,
      fontSize: 12,
      interval: 0
    },
    axisLine: {
      lineStyle: {
        color: '#c5c5c5'
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    data: []
  }],
  yAxis: [{
    name: '',
    type: 'value',
    min: 0,
    axisLabel: {
      color: '#797c7d',
      fontSize: 14
      // formatter: (value) => {
      //   return value + '%'
      // }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    nameTextStyle: {
      show: false
    }
  }],
  series: [{
    name: '',
    type: 'line',
    symbol: 'circle',
    symbolSize: 6,
    hoverAnimation: false,
    label: {
      show: true,
      formatter: '{c}',
      fontSize: 12,
      color: '#4d84fe'
    },
    itemStyle: {
      normal: {
        color: '#4d84fe'
      }
    },
    lineStyle: {
      color: '#4d84fe'
    },
    data: []
  }]
}
let linesOpt = {
  grid: {
    show: false,
    top: 40,
    left: 15,
    right: 25,
    bottom: 20,
    containLabel: true
  },
  legend: {
    show: true,
    top: 'top',
    right: 25,
    textStyle: {
      fontSize: 14,
      color: '#303133'
    },
    itemGap: 18,
    data: ['RX', 'TX']
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    formatter: '{a0}: {c0}<br>{a1}: {c1}'
  },
  xAxis: [{
    type: 'category',
    // boundaryGap: false,
    axisLabel: {
      color: '#797c7d',
      rotate: -20,
      fontSize: 12,
      interval: 0
    },
    axisLine: {
      lineStyle: {
        color: '#c5c5c5'
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    data: []
  }],
  yAxis: [{
    name: '',
    type: 'value',
    min: 0,
    axisLabel: {
      color: '#797c7d',
      fontSize: 14
      // formatter: (value) => {
      //   return value + '%'
      // }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    nameTextStyle: {
      show: false
    }
  }],
  series: [{
    name: 'RX',
    type: 'line',
    symbol: 'circle',
    symbolSize: 6,
    hoverAnimation: false,
    label: {
      show: false,
      formatter: '{c}',
      fontSize: 12,
      color: '#fc4c7a'
    },
    itemStyle: {
      normal: {
        color: '#fc4c7a'
      }
    },
    lineStyle: {
      color: '#fc4c7a'
    },
    data: []
  }, {
    name: 'TX',
    type: 'line',
    symbol: 'circle',
    symbolSize: 6,
    hoverAnimation: false,
    label: {
      show: false,
      formatter: '{c}',
      fontSize: 12,
      color: '#4d84fe'
    },
    itemStyle: {
      normal: {
        color: '#4d84fe'
      }
    },
    lineStyle: {
      color: '#4d84fe'
    },
    data: []
  }]
}

export default {
  data () {
    return {
      interval: '1s',
      iterator: null,
      intervalOpt: [
        {value: '1s'},
        {value: '2s'},
        {value: '3s'},
        {value: '5s'},
        {value: '10s'}
      ],
      process: [],
      timeLine: [],
      dmem: [],
      dcpu: [],
      drx: [],
      dtx: []
    }
  },
  watch: {
    interval: {
      handler (v, o) {
        this.refresh(v)
      }
    }
  },
  methods: {
    drawChart (id, option) {
      let myChart = this.$echarts.init(document.getElementById(id))
      myChart.setOption(option)
    },
    refresh (t) {
      t = parseInt(t) * 1000
      let label = this.timeLine
      let d_1 = this.dmem
      let d_2 = this.dcpu
      let d_3a = this.drx
      let d_3b = this.dtx
      // 实时动态
      this.iterator && clearInterval(this.iterator)
      this.iterator = setInterval(() => {
        httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/stats?hostid=${this.$route.query.hostId}&containerId=${this.$route.query.contId}`, null, (res) => {
          try {
            let data = res.data
            let y_1 = Math.round(data.meoryStats.usage / Math.pow(1024, 2))
            let y_2 = 0
            let cupDelta = data.cpuStats.cpu_usage.total_usage - data.precpuStats.cpu_usage.total_usage
            let systemDelta = data.cpuStats.system_cpu_usage - data.precpuStats.system_cpu_usage
            let cpuCores = data.cpuStats.cpu_usage.percpu_usage ? data.cpuStats.cpu_usage.percpu_usage.length : 0
            if (cupDelta > 0 && systemDelta > 0) {
              y_2 = ((cupDelta / systemDelta) * cpuCores * 100).toFixed(2)
            }
            let y_3a = (data.networks.eth0.rx_bytes / 1000).toFixed(2)
            let y_3b = (data.networks.eth0.tx_bytes / 1000).toFixed(2)
            let x = utils.formatDateFromLong(data.dateRead, 'hh:mm:ss')
            if (label.length <= 5) {
              d_1.push(y_1)
              d_2.push(y_2)
              d_3a.push(y_3a)
              d_3b.push(y_3b)
              label.push(x)
            } else {
              label.shift()
              label.push(x)
              d_1.shift()
              d_1.push(y_1)
              d_2.shift()
              d_2.push(y_2)
              d_3a.shift()
              d_3a.push(y_3a)
              d_3b.shift()
              d_3b.push(y_3b)
            }
            lineOpt.xAxis[0].data = label
            lineOpt.series[0].name = '内存使用量'
            lineOpt.series[0].data = d_1
            this.drawChart('cpuOccupied', lineOpt)

            lineOpt.series[0].name = 'CPU使用率'
            lineOpt.series[0].data = d_2
            this.drawChart('cpuRatio', lineOpt)

            linesOpt.xAxis[0].data = label
            linesOpt.series[0].data = d_3a
            linesOpt.series[1].data = d_3b
            this.drawChart('netOccupied', linesOpt)
          } catch (e) {}
        })
        // 进程列表
        httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/topResults?hostid=${this.$route.query.hostId}&containerId=${this.$route.query.contId}`, null, (res) => {
          this.process = []
          res.data.Processes.forEach((item) => {
            this.process.push({
              uid: item[0],
              pid: item[1],
              ppid: item[2],
              c: item[3],
              stime: item[4],
              tty: item[5],
              time: item[6],
              cmd: item[7]
            })
          })
        })
      }, t)
    }
  },
  mounted () {
    this.refresh(this.interval)
  },
  beforeDestroy () {
    clearInterval(this.iterator)
  }
}
</script>

<style lang="less">
.table-style[name=process]{
  li{
    >span{
      width: (100%-40%)/6;
    }
  }
}
</style>
