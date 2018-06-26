<template>
  <div class="m-content pg-abstract">
    <div class="u-notify"><span><em>资源概览</em></span></div>
    <div class="show show-bar">
      <div class="cell long">
        <h2 class="u-header">基本信息</h2>
        <em>ENLOOP V2.0</em>
      </div>
      <div class="cell normal" @click="$router.push({name: 'host'})" v-show="baseReady">
        <i class="icon icon-scatter blue"></i>
        <div>
          <em class="blue">{{nodeNumber}}</em>
          <span>集群节点数</span>
        </div>
      </div>
      <div class="cell normal" @click="$router.push({name: 'host', query: {searchwords: {role: 'manager'}}})" v-show="baseReady">
        <i class="icon icon-scatter orange"></i>
        <div>
          <em class="orange">{{mannageNum}}</em>
          <span>管理节点数</span>
        </div>
      </div>
      <div class="cell normal" @click="$router.push({name: 'host', query: {searchwords: {role: 'worker'}}})" v-show="baseReady">
        <i class="icon icon-scatter purple"></i>
        <div>
          <em class="purple">{{runningNum}}</em>
          <span>工作节点数</span>
        </div>
      </div>
    </div>
    <div class="case-wrapper">
      <!--管理节点-->
      <div v-for="(node,index) in nodeManageList" :class="['show', 'showcase',node.status==='ready'?'normal':'abnormal']" :id="`manage_${index}`"
        :key="index" @click="$router.push({name: 'host_interview', query: {hostId: node.hostid, status: node.status==='ready'?'可用' : '不可用'}})">
        <div class="head" :status="node.status==='ready'?'正常':'异常'">
          <i class="icon icon-bar"></i>
          {{node.name}}
          <span>(管理节点)</span>
        </div>
        <div class="content">
          <div>
            <canvas :name="`manage_${index}_cpu`" :width="processRadius" :height="processRadius"></canvas>
            <span>cpu</span>
          </div>
          <div>
            <canvas :name="`manage_${index}_memory`" :width="processRadius" :height="processRadius"></canvas>
            <span>内存</span>
          </div>
          <div>
            <canvas :name="`manage_${index}_network`" :width="processRadius" :height="processRadius"></canvas>
            <span>网络</span>
          </div>
        </div>
      </div>
    </div>
    <div class="case-wrapper">
      <!--工作节点-->
      <div v-for="(node,index) in nodeComponentList" :class="['show', 'showcase',node.status==='ready'?'normal':'abnormal']" :id="`task_${index}`"
        :key="index" @click="$router.push({name: 'host_interview', query: {hostId: node.hostid, status: node.status==='ready'?'可用' : '不可用'}})">
        <div class="head" :status="node.status==='ready'?'正常':'异常'">
          <i class="icon icon-bar"></i>
          {{node.name}}
          <span>(工作节点)</span>
        </div>
        <div class="content">
          <div>
            <canvas :name="`task_${index}_cpu`" :width="processRadius" :height="processRadius"></canvas>
            <span>cpu</span>
          </div>
          <div>
            <canvas :name="`task_${index}_memory`" :width="processRadius" :height="processRadius"></canvas>
            <span>内存</span>
          </div>
          <div>
            <canvas :name="`task_${index}_network`" :width="processRadius" :height="processRadius"></canvas>
            <span>网络</span>
          </div>
        </div>
      </div>
    </div>
    <div class="show show-resource">
      <h2 class="u-header">资源详情</h2>
      <div class="content resource-info">
        <div @click="$router.push({name: 'mirror'})">
          <i class="icon icon-resource-mirror"></i>
          <div>
            <em>{{resource.images}}</em>
            <span>镜像</span>
          </div>
          <span>占用磁盘: {{resource.imageSize}} MB</span>
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
import utils from '@/vender/js/utils'
import httpRequest from '@/vender/js/httpUtils'
export default {
  name: 'HelloWorld',
  data () {
    return {
      baseReady: false,
      processRadius: '65px',
      nodeNumber: 0,
      mannageNum: 0,
      runningNum: 0,
      nodeManageList: [],
      nodeComponentList: [],
      resource: {},
      iterator1: undefined,
      iterator2: undefined
    }
  },
  methods: {
    getCanvas () {
      httpRequest.getRequest(`${this.constants.BaseUrl}/cluster/realtimeInfo`, null, (res) => {
        try {
          this.nodeComponentList = []
          this.nodeManageList = []
          res.data.forEach((item, index) => {
            if (item.role === '01') {
              this.nodeManageList.push(item)
            } else {
              this.nodeComponentList.push(item)
            }
          })
          this.$nextTick(function () {
            this.nodeManageList.forEach((item, index) => {
              let cpu = document.querySelector(`[name='manage_${index}_cpu']`)
              let memory = document.querySelector(`[name='manage_${index}_memory']`)
              let network = document.querySelector(`[name='manage_${index}_network']`)
              let cpuColor = item.cpuUsed <= 30 ? '#24b914' : item.cpuUsed <= 60 ? '#4d84fe' : item.cpuUsed <= 80 ? '#ffb544' : '#fc4c7a'
              let memColor = item.memUsed <= 30 ? '#24b914' : item.memUsed <= 60 ? '#4d84fe' : item.memUsed <= 80 ? '#ffb544' : '#fc4c7a'
              let netColor = item.networkUsed <= 30 ? '#24b914' : item.networkUsed <= 60 ? '#4d84fe' : item.networkUsed <= 80 ? '#ffb544' : '#fc4c7a'
              utils.drawProcessCircle(cpu, item.cpuUsed, cpuColor, '#e9e9ea', cpuColor)
              utils.drawProcessCircle(memory, item.memUsed, memColor, '#e9e9ea', memColor)
              utils.drawProcessCircle(network, item.networkUsed, netColor, '#e9e9ea', netColor)
            })
            this.nodeComponentList.forEach((item, index) => {
              let cpu = document.querySelector(`[name='task_${index}_cpu']`)
              let memory = document.querySelector(`[name='task_${index}_memory']`)
              let network = document.querySelector(`[name='task_${index}_network']`)
              let cpuColor = item.cpuUsed <= 30 ? '#24b914' : item.cpuUsed <= 60 ? '#4d84fe' : item.cpuUsed <= 80 ? '#ffb544' : '#fc4c7a'
              let memColor = item.memUsed <= 30 ? '#24b914' : item.memUsed <= 60 ? '#4d84fe' : item.memUsed <= 80 ? '#ffb544' : '#fc4c7a'
              let netColor = item.networkUsed <= 30 ? '#24b914' : item.networkUsed <= 60 ? '#4d84fe' : item.networkUsed <= 80 ? '#ffb544' : '#fc4c7a'
              utils.drawProcessCircle(cpu, item.cpuUsed, cpuColor, '#e9e9ea', cpuColor)
              utils.drawProcessCircle(memory, item.memUsed, memColor, '#e9e9ea', memColor)
              utils.drawProcessCircle(network, item.networkUsed, netColor, '#e9e9ea', netColor)
            })
          })
        } catch (e) {}
      })
    },
    getBaseInfo () {
      httpRequest.getRequest(`${this.constants.BaseUrl}/cluster/info`, null, (res) => {
        this.nodeNumber = res.data.nodes
        this.mannageNum = res.data.managerNodes
        this.runningNum = res.data.workerNodes
        this.baseReady = true
      })
    },
    getResource () {
      httpRequest.getRequest(`${this.constants.BaseUrl}/cluster/resources`, null, (res) => {
        this.resource = {...res.data}
      })
    }
  },
  created () {
    this.getBaseInfo()
    this.getResource()
    this.iterator2 = setInterval(() => {
      this.getBaseInfo()
      this.getResource()
    }, 120000)
  },
  mounted () {
    this.getCanvas()
    this.iterator1 = setInterval(() => {
      this.getCanvas()
    }, 10000)
  },
  beforeDestroy () {
    clearInterval(this.iterator1)
    clearInterval(this.iterator2)
  }
}

</script>
