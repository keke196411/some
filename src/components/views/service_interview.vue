<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'service'})">服务管理</em> >
        <em>查看</em>
      </span>
      <a class="btn-edite" v-show="!editMode" @click="editMode = true">编辑</a>
      <a class="btn-edite bg-blue" v-show="editMode" @click="reserve">更新</a>
    </div>
    <!-- 基本信息 -->
    <div class="view-bar">
      <div class="u-header">基本信息</div>
      <div class="content infor">
        <div class="left">
          <i class="icon icon-dashed-board"></i>
          <p>
            <span :title="name" v-text="name" v-if="!editMode"></span>
            <input type="text" v-model="name" name="mirrorName" v-validate="'required'"
            :class="['el-input__inner input-lih-28', {'is-danger': errors.has('mirrorName') }]" v-if="editMode">
            <span v-show="errors.has('mirrorName')" class="help is-danger">{{ errors.first('mirrorName') }}</span>
          </p>
        </div>
        <div class="right">
          <div>
            <em>编号 :</em>
            <span v-text="sequence" :title="sequence" class="ellipsis"></span>
          </div>
          <div>
            <em>状态 :</em>
            <span v-text="status"></span>
          </div>
          <div>
            <em>创建时间 :</em>
            <span v-text="created"></span>
          </div>
          <div>
            <em>开始时间 :</em>
            <span v-text="started"></span>
          </div>
          <div>
            <em style="width:80px;margin-left:-25px;">所属主机名称 :</em>
            <span v-text="hostName"></span>
          </div>
          <div>
            <em style="width:80px;margin-left:-25px;">所属主机IP :</em>
            <span v-text="hostIP"></span>
          </div>
          <div>
            <em>日志 :</em>
            <span><a class="btn" @click="goLog">查看</a></span>
          </div>
          <div v-if="status==='running'">
            <em>控制台 :</em>
            <span><a class="btn" @click="goConsole">查看</a></span>
          </div>
          <div>
            <em>Inpect :</em>
            <span><a class="btn" @click="goInspect">查看</a></span>
          </div>
          <div v-if="status==='running'">
            <em>统计 :</em>
            <span><a class="btn" @click="goStatus">查看</a></span>
          </div>
          <div>
            <em>镜像 :</em>
            <span><a class="btn orange" @click="generateMirror">生成</a></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 生成镜像 -->
    <div class="view-bar" v-show="showMirror" v-loading="mirroring" element-loading-background="rgba(255,255,255,.5)">
      <div class="u-header">生成镜像</div>
      <div class="content">
        <ul class="u-ul-standard">
          <li v-for="(v, i) in mirror" :key="i">
            <div class="cell wp45">
              <label>名称 :</label>
              <p>
                <input :name="'mirrorKey_'+i" v-model="v.mirrorKey" v-validate="'required'" :readonly="v.done"
                :class="['multipleMode el-input__inner input-lih-28', {'is-danger': errors.has('mirrorKey_'+i) }]" type="text" placeholder="请输入名称">
                <span v-show="errors.has('mirrorKey_'+i)" class="help is-danger">{{ errors.first('mirrorKey_'+i) }}</span>
              </p>
            </div>
            <div class="cell wp45">
              <label>仓库 :</label>
              <p>
                <el-select v-model="v.lib" class="multipleMode input-lih-28" style="width:220px;" :disabled="v.done">
                  <el-option v-for="item in libOpt" :key="item.value" :value="item.value">
                  </el-option>
                </el-select>
              </p>
            </div>
            <div class="cell wp45" style="margin-top:10px;" v-if="!v.done">
              <label>用户名 :</label>
              <p>
                <input :name="'user_'+i" v-model="v.user" v-validate="'required'"
                :class="['el-input__inner input-lih-28', {'is-danger': errors.has('user_'+i) }]" type="text" placeholder="请输入用户名">
                <span v-show="errors.has('user_'+i)" class="help is-danger">{{ errors.first('user_'+i) }}</span>
              </p>
            </div>
            <div class="cell wp45" style="margin-top:10px;position:relative;" v-if="!v.done">
              <label>密码 :</label>
              <p>
                <input :name="'token_'+i" v-model="v.token" v-validate="'required'"
                :class="['el-input__inner input-lih-28', {'is-danger': errors.has('token_'+i) }]" type="password" placeholder="请输入密码" style="width:220px;">
                <span v-show="errors.has('token_'+i)" class="help is-danger">{{ errors.first('token_'+i) }}</span>
              </p>
              <a class="btn btn-generate" @click="submitMirror(i)" style="position:absolute;top:3px;left:340px;">提交</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 详细信息 -->
    <div class="view-bar">
      <div class="u-header">详细信息</div>
      <div class="content">
        <ul class="u-ul-standard" v-for="(v, i) in mirrorInfo" :key="i">
          <li>
            <div class="cell wp45">
              <label>镜像 :</label>
              <p v-text="v.name"></p>
            </div>
            <div class="cell wp45">
              <label>命令 :</label>
              <p v-text="v.cmd"></p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 变量 -->
      <div class="u-header">变量</div>
      <div class="content">
        <ul class="table-style striped">
          <li>
            <span class="wp40 pl60">名称</span>
            <span class="wp60 pl60">内容</span>
          </li>
          <li v-for="(v, i) in variables" :key="i">
            <span class="wp40 pl40" v-text="v.name"></span>
            <span class="wp60 pl40" v-text="v.content"></span>
          </li>
        </ul>
      </div>
      <!-- 标签 -->
      <div class="u-header">标签</div>
      <div class="content">
        <ul class="table-style striped">
          <li>
            <span class="wp40 pl60">名称</span>
            <span class="wp60 pl60">内容</span>
          </li>
          <li v-for="(v, i) in labels" :key="i">
            <span class="wp40 pl40" v-text="v.name"></span>
            <span class="wp60 pl40" v-text="v.content"></span>
          </li>
        </ul>
      </div>
      <!-- 重启规则 -->
      <div class="u-header">重启规则</div>
      <div class="content" style="padding-bottom:30px;" v-if="restart[0].name">
        <ul class="table-style striped">
          <li>
            <span class="wp40 pl80">名称</span>
            <span class="wp60 pl40">重启次数限制</span>
          </li>
          <li v-for="(v, i) in restart" :key="i">
            <span class="wp40 pl40" v-text="v.name"></span>
            <span class="wp60 pl40" v-text="v.content"></span>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog title="控制台" :visible.sync="dialogConsole" width="60vw" custom-class="m-dialog" top="15vh" :fullscreen="false" :before-close="clean">
      <div class="console-wrap" style="height:70vh" id="xterm">
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogInspect" width="70vw" custom-class="m-dialog" top="15vh" :fullscreen="false">
      <div class="inspect-wrap" style="height:70vh" v-text="content">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
import utils from '@/vender/js/utils'
import {Terminal} from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'
import * as attach from 'xterm/lib/addons/attach/attach'
Terminal.applyAddon(fit)
Terminal.applyAddon(attach)
export default {
  data () {
    return {
      term: undefined,
      status: '',
      content: '',
      editMode: false,
      added: false,
      showMirror: false,
      name: '',
      sequence: '',
      created: '',
      started: '',
      hostName: '',
      hostIP: '',
      mirror: [],
      mirrorInfo: [],
      variables: [],
      labels: [],
      restart: [{name: '', content: ''}],
      libOpt: [],
      defaultLib: '',
      dialogConsole: false,
      dialogInspect: false,
      mirroring: false
    }
  },
  methods: {
    generateMirror () {
      this.showMirror = true
      let l = this.mirror.length
      if (!this.mirror[0] || this.mirror[l - 1].done) {
        this.mirror.push({
          mirrorKey: 'e.g. myImage:myTag',
          lib: this.defaultLib,
          user: '',
          token: undefined,
          done: false
        })
      } else {
        this.$message.warning('请先提交镜像!')
      }
    },
    goInspect () {
      this.dialogInspect = true
    },
    goLog () {
      this.$router.push({name: 'log', query: {...this.$route.query, type: 'containerlog'}})
    },
    submitMirror (i) {
      this.mirroring = true
      let param = {
        containerId: this.$route.query.contId,
        hostId: this.$route.query.hostId,
        iamgeRegistry: this.mirror[i].lib,
        imageName: this.mirror[i].mirrorKey,
        passwd: this.mirror[i].token,
        user: this.mirror[i].user
      }
      httpRequest.postRequest(`${this.constants.BaseUrl}/container/containers/commitContainer`, param, (res) => {
        this.$message.success('镜像生成成功!')
        this.mirror[i].done = true
        this.mirroring = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.mirroring = false
      })
    },
    goConsole () {
      let vue = this
      this.dialogConsole = true
      let query = this.$route.query
      this.$nextTick(() => {
        let socket = new WebSocket(`ws://192.168.22.113:8082/ws/container/exec?&ip=${query.paraIp}&port=${query.paraPort}&containerId=${query.contId}`)
        socket.onopen = () => {
          vue.term = new Terminal({
            cursorBlink: true
          })
          vue.term.open(document.getElementById('xterm'))
          vue.term.attach(socket)
          vue.term.focus()
          vue.term.fit()
        }
      })
    },
    clean (done) {
      this.term && this.term.destroy()
      done()
    },
    goStatus () {
      httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/topResults?hostid=${this.$route.query.hostId}&containerId=${this.$route.query.contId}`, null, (res) => {
        this.$router.push({name: 'service_status', query: {...this.$route.query, hostId: this.$route.query.hostId, contId: this.$route.query.contId}})
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
      })
    },
    reserve () {
      let vue = this
      httpRequest.postRequest(`${this.constants.BaseUrl}/container/containers/renameContainer?hostId=${this.$route.query.hostId}&containerId=${this.$route.query.contId}&containerName=${encodeURIComponent(this.name)}`, null, (res) => {
        vue.$message({
          type: 'success',
          message: ' 更新成功！',
          duration: 2000
        })
        let t = setTimeout(() => {
          vue.$router.push({name: 'service'})
          clearTimeout(t)
        }, 2200)
      })
    }
  },
  created () {
    let hostId = this.$route.query.hostId
    let contId = this.$route.query.contId
    httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/inspect?hostid=${hostId}&containerId=${encodeURIComponent(contId)}`, null, (res) => {
      let data = res.data
      this.content = data
      this.name = data.Name.replace(/^\/+/, '')
      this.sequence = data.Id
      this.status = data.State.Status
      this.created = utils.formatDateFromLong(data.Created, 'yyyy-MM-dd hh:mm:ss')
      this.started = utils.formatDateFromLong(data.State.StartedAt, 'yyyy-MM-dd hh:mm:ss')
      this.hostName = this.$route.query.hostName
      this.hostIP = this.$route.query.hostIP
      this.mirrorInfo = [{
        name: data.Config.Image ? data.Config.Image : '',
        cmd: data.Config.Cmd ? data.Config.Cmd[0] : ''
      }]
      data.Config.Env && data.Config.Env.forEach((item) => {
        let ar = item.split('=')
        this.variables.push({
          name: ar[0],
          content: ar[1]
        })
      })
      for (let i of Object.keys(data.Config.Labels)) {
        this.labels.push({
          name: i,
          content: data.Config.Labels[i]
        })
      }
      this.restart = [{
        name: data.HostConfig.RestartPolicy.Name,
        content: data.HostConfig.RestartPolicy.MaximumRetryCount
      }]
    })
    // 仓库
    httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/registry`, null, (res) => {
      res.data.forEach((item) => {
        this.libOpt.push({
          value: item.dicname
        })
        this.defaultLib = this.libOpt[0].value
      })
    })
  }
}
</script>
