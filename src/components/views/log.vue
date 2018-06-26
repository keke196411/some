<template>
  <div class="m-content pg-mirror" ref="container">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'proxy'})" v-if="page==='servicelog'">服务代理</em>
        <em @click="$router.push({name: 'service'})" v-if="page==='containerlog'">服务管理</em> >&nbsp;
        <em @click="$router.push({name: 'proxy_interview', query: {serviceId: $route.query.contId}})" v-if="page==='servicelog'">查看</em>
        <em @click="$router.push({name: 'service_interview', query: $route.query})" v-if="page==='containerlog'">查看</em> >&nbsp;
        <em>日志</em></span>
    </div>
    <div class="wrapper log">
      <h2 class="u-header">日志详情</h2>
      <el-col :span="24">
        <label>自动刷新 :</label>
        <div class="radio-bar input-lih-28">
          <el-radio v-model="autoRefresh" :label="true">是</el-radio>
          <el-radio v-model="autoRefresh" :label="false">否</el-radio>
        </div>
      </el-col>
      <el-col :span="24">
        <label>搜索: </label>
        <el-input v-model="keyWords" palceholder="请输入关键词" style="width:6.6rem;" placeholder="请输入关键词查找"></el-input>
      </el-col>
      <el-col :span="24" style="border-bottom:1px solid #e9e9ea;">
        <label>选项: </label>
        <a class="btn btn-copy bg-orange" @click="copyToClipboard" @mousemove="setLocale" style="margin-right:7px;"><em>全选</em></a>
        <a class="btn btn-copy bg-orange" @click="copySelected" @mousemove="setLocale" style="margin-right:7px;"><em>复制选中</em></a>
        <a class="btn btn-copy bg-red" @click="cancelSelected" @mousemove="setLocale"><em>取消选中</em></a>
      </el-col>
      <el-col :span="24">
        <label>日志: </label>
        <p class="log-info" v-html="logInfo"></p>
      </el-col>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
import websocket from '@/vender/js/webSocket'
export default {
  data () {
    return {
      autoRefresh: true,
      keyWords: '',
      websocket: null,
      logContext: '',
      logInfo: ''
    }
  },
  watch: {
    autoRefresh (v, o) {
      if (v) {
        this.activeWebsocket()
      } else {
        this.websocket.close()
      }
    },
    keyWords (v, o) {
      this.logInfo = Reflect.apply(this.search, null, [])
    }
  },
  methods: {
    activeWebsocket () {
      let vue = this
      let length = 0
      vue.logContext = ''
      this.websocket = websocket.initWebSocket({
        onopen (target) {
          target.send(JSON.stringify({
            'type': vue.$route.query.type,
            'id': vue.$route.query.contId
          }))
          if (vue.page === 'containerlog') httpRequest.getRequest(`${vue.constants.BaseUrl}/container/containers/getLog?hostid=${vue.$route.query.hostId}&containerId=${vue.$route.query.contId}`, null, () => {})
          if (vue.page === 'servicelog') httpRequest.getRequest(`${vue.constants.BaseUrl}/service/services/log?serviceId=${vue.$route.query.contId}`, null, () => {})
        },
        onmessage (mes) {
          mes = mes.replace(/\n/g, '')
          if (mes.length) {
            length++
            vue.logContext += `${mes}\n`
            if (length > 80) {
              vue.logContext = vue.logContext.slice(vue.logContext.indexOf('\n') + 1)
            }
            vue.logInfo = vue.logContext
          }
        },
        url: vue.constants.WebsocketUrl
      })
    },
    search () {
      let key = this.keyWords
      let map = new RegExp(`(${key})`, 'gi')
      return this.logContext.replace(map, `<span>$1</span>`)
    },
    copyToClipboard () {
      let node = document.querySelector('.log-info')
      window.getSelection().selectAllChildren(node)
      // if (document.execCommand('Copy')) {
      //   this.$message.success('已复制到粘贴板')
      // } else {
      //   this.$message.error('你的浏览器不支持粘贴板!')
      // }
    },
    copySelected () {
      let range = window.getSelection()
      if (range.rangeCount) {
        range.getRangeAt(0)
        if (document.execCommand('Copy')) {
          this.$message.success('已复制到粘贴板')
        } else {
          this.$message.error('你的浏览器不支持粘贴板!')
        }
      } else {
        this.$message.warning('请选择文本内容!')
      }
    },
    cancelSelected () {
      window.getSelection().removeAllRanges()
    },
    setLocale () {
      let e = arguments[0]
      let h = e.pageX - e.target.getBoundingClientRect().left
      let v = e.pageY - e.target.getBoundingClientRect().top
      e.target.style.setProperty('--x', `${h}px`)
      e.target.style.setProperty('--y', `${v}px`)
    }
  },
  computed: {
    page () {
      return this.$route.query.type
    }
  },
  created () {
    this.activeWebsocket()
  }
}
</script>
