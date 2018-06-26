<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'host'})">主机管理</em> >
        <em>查看</em>
      </span>
      <a class="btn-edite" v-show="!editMode" @click="editMode = true">编辑</a>
      <a class="btn-edite bg-blue" v-show="editMode" @click="reserve">更新</a>
    </div>
    <!-- 基本信息 -->
    <div class="view-bar" style="position:relative;overflow:hidden;">
      <div class="u-header">基本信息</div>
      <div class="content infor">
        <div class="left">
          <i class="icon icon-small-displayer"></i>
          <p v-text="name"></p>
        </div>
        <div class="right">
          <div>
            <em>用户名 :</em>
            <span v-text="userName"></span>
          </div>
          <div>
            <em>密码 :</em>
            <span v-text="token"></span>
          </div>
          <div>
            <em>角色 :</em>
            <span v-show="!editMode">
              <em class="role" v-text="role"></em>
            </span>
            <el-select v-model="role" placeholder="请选择" class="w80 input-lih-24" v-show="editMode">
              <el-option v-for="v in roleOpt" :key="v.value" :value="v.value">
              </el-option>
            </el-select>
          </div>
          <div>
            <em>内存 :</em>
            <span v-text="memory"></span>
          </div>
          <div>
            <em>cpu :</em>
            <span v-text="cpu">4</span>
          </div>
          <div>
            <em>硬盘 :</em>
            <span v-text="disk">1TB</span>
          </div>
          <div>
            <em>网络 :</em>
            <span v-text="network">1000M</span>
          </div>
          <div>
            <em>系统 :</em>
            <span v-text="system"></span>
          </div>
          <div>
            <em>引擎 :</em>
            <span v-text="engine">centos7.4</span>
          </div>
          <div>
            <em>主节点 :</em>
            <span v-text="mainNode">123</span>
          </div>
          <div>
            <em>端口 :</em>
            <span v-text="port">8000</span>
          </div>
          <div>
            <em>IP :</em>
            <span v-text="ip">127.0.0.1</span>
          </div>
        </div>
      </div>
      <div :class="['indicator', this.$route.query.status==='可用'?'valiable':'']" :name="this.$route.query.status">
      </div>
    </div>
    <!-- 实时动态 -->
    <div class="view-bar" style="padding:0;">
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
        <h3 class="u-round-header" style="margin-bottom:10px;" v-if="process.length">进程列表</h3>
        <ul class="table-style striped al-center" name="process" v-if="process.length">
          <li>
            <span class="wp14">进程id</span>
            <span class="wp14">进程所有者</span>
            <span class="wp14">进程状态</span>
            <span class="wp14">进程使用的物理内存百分比（%）</span>
            <span class="wp14">上次更新到现在的CPU时间占用百分比（%）</span>
            <span class="wp14">进程使用的CPU时间总计(1/100秒)</span>
            <span class="wp16">进程名称（命令名/命令行）</span>
          </li>
          <li v-for="(v, i) in process" :key="i">
            <span class="wp14">{{v[0]}}</span>
            <span class="wp14">{{v[1]}}</span>
            <span class="wp14">{{v[2]}}</span>
            <span class="wp14">{{v[3]}}</span>
            <span class="wp14">{{v[4]}}</span>
            <span class="wp14">{{v[5]}}</span>
            <span class="wp16">{{v[6]}}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 资源信息 -->
    <div class="view-bar" style="height:2rem;">
      <h2 class="u-header">资源信息</h2>
      <div class="content resource-info" style="height:calc(100% - 36px);">
        <div @click="$router.push({name: 'mirror'})">
          <i class="icon icon-resource-mirror"></i>
          <div>
            <em>{{resource.images}}</em>
            <span>镜像</span>
          </div>
          <span>占用内存: {{resource.imageSize}} MB</span>
        </div>
        <div @click="$router.push({name: 'proxy'})">
          <i class="icon icon-resource-proxy"></i>
          <div>
            <em>{{resource.services}}</em>
            <span>服务代理</span>
          </div>
        </div>
        <div @click="$router.push({name: 'hardware'})">
          <i class="icon icon-resource-dist"></i>
          <div>
            <em>{{resource.disks}}</em>
            <span>磁盘</span>
          </div>
        </div>
        <div @click="$router.push({name: 'app'})">
          <i class="icon icon-resource-app"></i>
          <div>
            <em>{{resource.stacks}}</em>
            <span>应用</span>
          </div>
        </div>
        <div @click="$router.push({name: 'service'})">
          <i class="icon icon-resource-service"></i>
          <div>
            <em>{{resource.containers}}</em>
            <span>服务管理</span>
          </div>
          <span class="normal">正常: {{resource.runningContainers}}</span>
          <span class="error">异常: {{resource.stoppedContainers}}</span>
        </div>
        <div @click="$router.push({name: 'network'})">
          <i class="icon icon-resource-network"></i>
          <div>
            <em>{{resource.networks}}</em>
            <span>网络</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
import utils from '@/vender/js/utils'

export default {
  data () {
    return {
      memOpt: {
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
          formatter: '{a}: {c}MB'
        },
        xAxis: [{
          type: 'category',
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
          name: '使用量',
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
      },
      cpuOpt: {
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
          formatter: '{a}: {c}%'
        },
        xAxis: [{
          type: 'category',
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
          splitNumber: 4,
          axisLabel: {
            color: '#797c7d',
            fontSize: 14
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
          name: '使用率',
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
      },
      linesOpt: {
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
          formatter: '{a0}: {c0}KB<br>{a1}: {c1}KB'
        },
        xAxis: [{
          type: 'category',
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
      },
      iterator: undefined,
      editMode: false,
      name: '',
      userName: '',
      token: '',
      role: '',
      memory: 0,
      cpu: 0,
      disk: 0,
      network: 0,
      system: '',
      engine: '',
      mainNode: '',
      port: '',
      ip: '',

      interval: '30s',
      intervalOpt: [
        {value: '15s'},
        {value: '30s'},
        {value: '60s'},
        {value: '120s'},
        {value: '150s'}
      ],
      roleOpt: [
        {value: '管理者'},
        {value: '工作节点'}
      ],
      process: [],
      resource: {}
    }
  },
  watch: {
    interval (v, o) {
      this.refresh(v)
    }
  },
  methods: {
    drawChart (id, option) {
      let myChart = this.$echarts.init(document.getElementById(id))
      myChart.setOption(option)
    },
    getProcess () {
      httpRequest.getRequest(`${this.constants.BaseUrl}/host/process?hostid=${this.$route.query.hostId}`, null, (res) => {
        this.process = [...res.data.processes]
      })
    },
    getDynamic () {
      let label = this.memOpt.xAxis[0].data
      let d1 = this.memOpt.series[0].data
      let d2 = this.cpuOpt.series[0].data
      let drx = this.linesOpt.series[0].data
      let dtx = this.linesOpt.series[1].data
      httpRequest.getRequest(`${this.constants.BaseUrl}/host/stats?hostid=${this.$route.query.hostId}`, null, (res) => {
        try {
          let data = res.data
          if (label.length <= 5) {
            label.push(utils.formatDateFromLong(data.date, 'hh:mm:ss'))
            d1.push((data.memUsed / Math.pow(1024, 2)).toFixed(0))
            d2.push((data.cpuLoad * 100).toFixed(2))
            for (let i of Object.keys(data.networkStat)) {
              if (i.match(/^en/i) && data.networkStat[i].rx + 0 > 0) {
                drx.push((data.networkStat[i].rx / 1024).toFixed(2))
                dtx.push((data.networkStat[i].tx / 1024).toFixed(2))
                break
              }
            }
          } else {
            label.shift()
            label.push(utils.formatDateFromLong(data.date, 'hh:mm:ss'))
            d1.shift()
            d1.push((data.memUsed / Math.pow(1024, 2)).toFixed(0))
            d2.shift()
            d2.push((data.cpuLoad * 100).toFixed(1))
            for (let i of Object.keys(data.networkStat)) {
              if (i.match(/^en/i) && data.networkStat[i].rx + 0 > 0) {
                drx.shift()
                drx.push((data.networkStat[i].rx / 1024).toFixed(1))
                dtx.shift()
                dtx.push((data.networkStat[i].tx / 1024).toFixed(1))
                break
              }
            }
          }
          this.cpuOpt.xAxis[0].data = label
          this.linesOpt.xAxis[0].data = label
          this.drawChart('cpuOccupied', this.memOpt)
          this.drawChart('cpuRatio', this.cpuOpt)
          this.drawChart('netOccupied', this.linesOpt)
        } catch (e) {
          console.log(e)
        }
      })
    },
    getResourve () {
      httpRequest.getRequest(`${this.constants.BaseUrl}/host/resources?hostid=${this.$route.query.hostId}`, null, (res) => {
        this.resource = {...res.data}
      })
    },
    refresh (t) {
      t = parseInt(t) * 1000
      this.iterator && clearInterval(this.iterator)
      this.iterator = setInterval(() => {
        this.getDynamic()
        this.getProcess()
        this.getResourve()
      }, t)
    },
    reserve () {
      httpRequest.postRequest(`${this.constants.BaseUrl}/host/updateHost`, {role: this.role === '管理者' ? '01' : '02', ip: this.ip}, (res) => {
        this.$message({
          type: 'success',
          message: ' 更新成功！',
          duration: 2000
        })
        let t = setTimeout(() => {
          this.$router.push({name: 'host'})
          clearTimeout(t)
        }, 2200)
      })
    }
  },
  created () {
    httpRequest.getRequest(`${this.constants.BaseUrl}/host/inspect?hostid=${this.$route.query.hostId}`, null, (res) => {
      let data = res.data
      this.name = data.hostname
      this.userName = data.hostuser
      this.token = '******'
      this.role = data.hostrole === '01' ? '管理者' : '工作节点'
      this.memory = data.hostmem + ' GB'
      this.cpu = data.hostcpu
      this.disk = data.hostdisk + ' GB'
      this.network = data.hostnet + ' MB'
      this.system = data.hostsystem
      this.engine = data.hostengine
      this.mainNode = data.ismaster === '0' ? '是' : '否'
      this.port = data.hostport
      this.ip = data.hostip
    })
    this.getProcess()
    this.getDynamic()
    this.getResourve()
  },
  mounted () {
    this.refresh(this.interval)
  },
  beforeDestroy () {
    clearInterval(this.iterator)
  }
}
</script>
