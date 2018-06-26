<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'proxy'})">服务代理</em> >
        <em>查看</em>
      </span>
      <a class="btn-edite" @click="editMode = !editMode" v-show="!editMode">编辑</a>
      <a class="btn-edite bg-blue" @click="updateService" v-show="editMode">更新</a>
      <a class="btn-edite bg-red" @click="deleteService">删除</a>
    </div>
    <!-- 基本信息 -->
    <div class="view-bar">
      <div class="u-header">基本信息</div>
      <div class="content infor">
        <div class="left">
          <i class="icon icon-board"></i>
          <p v-text="formData.name"></p>
        </div>
        <div class="right">
          <div>
            <em>编号 :</em>
            <span>
              <input v-model="formData.sequence" :readonly="true" class="el-input__inner multipleMode">
            </span>
          </div>
          <div>
            <em>创建时间 :</em>
            <span v-text="formData.created"></span>
          </div>
          <div>
            <em>更新时间 :</em>
            <span v-text="formData.updated"></span>
          </div>
          <div>
            <em>版本 :</em>
            <span><input v-model="formData.version" :readonly="true" class="el-input__inner multipleMode"></span>
          </div>
          <div>
            <em>部署模式 :</em>
            <span><input v-model="formData.deploy" :readonly="true" class="el-input__inner multipleMode"></span>
          </div>
          <div v-if="formData.deploy==='replicated'">
            <em>副本 :</em>
            <span class="w80">
              <input name="duplicate" v-model="formData.duplicate" v-validate="'required'"
              :readonly="!editMode" :class="['multipleMode el-input__inner', {'is-danger': errors.has('duplicate')}]">
              <span v-show="errors.has('duplicate')" class="help is-danger">{{ errors.first('duplicate')}}</span>
            </span>
          </div>
          <div class="wp66">
            <em>镜像 :</em>
            <span><input v-model="formData.mirror" :readonly="true" class="el-input__inner multipleMode"></span>
          </div>
          <div>
            <em>服务日志 :</em>
            <span><a class="btn" @click="inspectDialog">查看</a></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 环境变量 -->
    <div class="view-bar">
      <div class="u-header">环境变量<a class="btn btn-addnew" @click="appendEnv" v-show="editMode">+</a></div>
      <div class="content">
        <ul class="u-ul-standard">
          <li v-for="(v, i) in formData.envs" :key="i" @mouseenter="hoverEnvs(i)" @mouseleave="leaveEnvs(i)">
            <div class="cell wp45">
              <label>名称 :</label>
              <p>
                <input :name="'envKey_'+i" v-model="v.envKey" v-validate="'required'" :readonly="!editMode"
                :class="['multipleMode el-input__inner input-lih-24', {'is-danger': errors.has('envKey_'+i) }]" type="text" placeholder="请输入名称">
                <span v-show="errors.has('envKey_'+i)" class="help is-danger">{{ errors.first('envKey_'+i) }}</span>
              </p>
            </div>
            <div class="cell wp45">
              <label>变量 :</label>
              <p>
                <input :name="'envValue_'+i" v-model="v.envValue" v-validate="'required'" :readonly="!editMode"
                :class="['multipleMode el-input__inner input-lih-24', {'is-danger': errors.has('envValue_'+i) }]" type="text" placeholder="请输入变量">
                <span v-show="errors.has('envValue_'+i)" class="help is-danger">{{ errors.first('envValue_'+i) }}</span>
              </p>
            </div>
            <a class="btn btn-remove" v-show="v.hover&&editMode" @click="removeEnvs(i)"></a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 端口 -->
    <div class="view-bar">
      <div class="u-header">端口<a class="btn btn-addnew" v-show="editMode" @click="newPort">+</a></div>
      <div class="content">
        <ul class="table-style striped al-center">
          <li>
            <span class="wp20">主机端口</span>
            <span class="wp20">容器端口</span>
            <span class="wp20">协议</span>
            <span class="wp20">发布模式</span>
            <span class="wp20">操作</span>
          </li>
          <li v-for="(item, index) in formData.ports" :key="index">
            <span class="wp20" style="padding-left:0;">
              <input :name="'host_'+index" v-model="item.host" v-validate="'required'" :readonly="!editMode"
              :class="['multipleMode el-input__inner input-lih-28', {'is-danger': errors.has('host_'+index) }]" type="text" placeholder="host: e.g.80">
              <span v-show="errors.has('host_'+index)" class="help is-danger">{{ errors.first('host_'+index) }}</span>
            </span>
            <span class="wp20">
              <input :name="'container_'+index" v-model="item.container" v-validate="'required'" :readonly="!editMode"
              :class="['multipleMode el-input__inner input-lih-28', {'is-danger': errors.has('container_'+index) }]" type="text" placeholder="container: e.g.80">
              <span v-show="errors.has('container_'+index)" class="help is-danger">{{ errors.first('container_'+index) }}</span>
            </span>
            <span class="wp20">
              <el-select v-model="item.protocol" class="multipleMode input-lih-28" :disabled="!editMode" placeholder="请选择">
                <el-option v-for="item in protocolOpt" :key="item.value" :value="item.value">
                </el-option>
              </el-select>
            </span>
            <span class="wp20">
              <el-select v-model="item.deliver" class="multipleMode input-lih-28" :disabled="!editMode" placeholder="请选择">
                <el-option v-for="item in deliverOpt" :key="item.value" :value="item.value">
                </el-option>
              </el-select>
            </span>
            <span class="wp20"><a class="btn btn-delete" @click="deletePorts(index)" v-show="editMode"></a></span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 资源限制 -->
    <div class="view-bar">
      <div class="u-header">资源限制</div>
      <div class="content resource">
        <ul class="u-ul-standard">
          <li>
            <div class="cell">Memory reservation (MB) :</div>
            <div class="cell">
              <el-input-number v-model="formData.resource.memReserve" :min="0" :step="0.25" :disabled="!editMode"
              :max="formData.resource.memTotal" size="mini" class="input-lih-24">
              </el-input-number>
              </div>
            <div class="cell">Minimum memory available on a node to run a task (set to 0 for unlimited)</div>
          </li>
          <li>
            <div class="cell">Memory limit (MB) :</div>
            <div class="cell">
              <el-input-number v-model="formData.resource.memLimit" :min="0" :step="0.25" :disabled="!editMode"
              :max="formData.resource.memTotal" size="mini" class="input-lih-24">
              </el-input-number>
            </div>
            <div class="cell">Maximum memory usage per task (set to 0 for unlimited)</div>
          </li>
          <li>
            <div class="cell" style="line-height:38px;">CPU reservation :</div>
            <div class="cell">
              <el-slider v-model="formData.resource.cpuReserve" :min="0" :disabled="!editMode"
              :max="formData.resource.cpuTotal" :step="1" input-size="mini"></el-slider>
            </div>
            <div class="cell" style="line-height:38px;">Minimum CPU available on a node to run a task</div>
          </li>
          <li>
            <div class="cell" style="line-height:38px;">CPU limit :</div>
            <div class="cell">
              <el-slider v-model="formData.resource.cpuLimit" :min="0" :disabled="!editMode"
              :max="formData.resource.cpuTotal" :step="1" input-size="mini"></el-slider>
            </div>
            <div class="cell" style="line-height:38px;">Maximum CPU usage per task</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 重启规则 -->
    <div class="view-bar">
      <div class="u-header">重启规则</div>
      <div class="content resource">
        <ul class="u-ul-standard">
          <li>
            <div class="cell">Restart condition :</div>
            <div class="cell">
              <el-select v-model="formData.restart.condition" class="multipleMode input-lih-24 w100" :disabled="!editMode">
                <el-option v-for="item in conditionOpt" :key="item.value" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="cell">Condition for restart</div>
          </li>
          <li>
            <div class="cell">Restart delay :</div>
            <div class="cell">
              <input v-model="formData.restart.delay" :readonly="!editMode" class="multipleMode el-input__inner input-lih-24 w100" type="text">
              <em v-show="editMode">s</em>
              <!-- <span v-show="errors.has('restart-delay')" class="help is-danger">{{ errors.first('restart-delay') }}</span> -->
            </div>
            <div class="cell">Delay between restart attempts expressed by a number followed by unit (ns|us|ms|s|m|h). Default value is 5s, 5 seconds</div>
          </li>
          <li>
            <div class="cell">Restart max attempts :</div>
            <div class="cell">
              <input v-model="formData.restart.max" :readonly="!editMode" class="multipleMode el-input__inner input-lih-24 w100" type="text">
              <!-- <span v-show="errors.has('max-attempts')" class="help is-danger">{{ errors.first('max-attempts') }}</span> -->
            </div>
            <div class="cell">Maximum attempts to restart a given task before giving up (default value is 0, which means unlimited)</div>
          </li>
          <li>
            <div class="cell">Restart window :</div>
            <div class="cell">
              <input v-model="formData.restart.window" :readonly="!editMode" class="multipleMode el-input__inner input-lih-24 w100" type="text">
              <em v-show="editMode">s</em>
              <!-- <span v-show="errors.has('restart-window')" class="help is-danger">{{ errors.first('restart-window') }}</span> -->
            </div>
            <div class="cell">Time window to evaluate restart attempts expressed by a number followed by unit (ns|us|ms|s|m|h). Default value is 0 seconds, which is unbounded</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 服务标签 -->
    <div class="view-bar">
      <div class="u-header">服务标签<a class="btn btn-addnew" v-show="editMode" @click="newLabels">+</a></div>
      <div class="content">
        <ul class="table-style striped al-center">
          <li>
            <span class="wp50">标签名称</span>
            <span class="wp30">标签值</span>
            <span class="wp20">操作</span>
          </li>
          <li v-for="(item, index) in formData.labels" :key="index">
            <span class="wp50" style="padding-left:0;">
              <input :name="'service-label_'+index" v-model="item.name" v-validate="'required'" :readonly="!editMode"
              :class="['multipleMode el-input__inner input-lih-28', {'is-danger': errors.has('service-label_'+index) }]" type="text" placeholder="请输入">
              <span v-show="errors.has('service-label_'+index)" class="help is-danger">{{ errors.first('service-label_'+index) }}</span>
            </span>
            <span class="wp30">
              <input :name="'service-velue'+index" v-model="item.value" v-validate="'required'" :readonly="!editMode"
              :class="['multipleMode el-input__inner input-lih-28', {'is-danger': errors.has('service-velue'+index) }]" type="text" placeholder="请输入">
              <span v-show="errors.has('service-velue'+index)" class="help is-danger">{{ errors.first('service-velue'+index) }}</span>
            </span>
            <span class="wp20"><a class="btn btn-delete" @click="deletelabels(index)"></a></span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 服务列表 -->
    <div class="view-bar">
      <div class="u-header">服务列表</div>
        <div class="content wrap-table">
          <div class="m-wrap-table proxy-service" style="padding:0;">
            <el-table :data="formData.list" style="width: 100%" class="m-table cursor" stripe @row-click="handleServiceRow">
              <el-table-column label="序号" prop="sort" align="center" class-name="wp5"></el-table-column>
              <el-table-column label="名称" prop="name" align="center"></el-table-column>
              <el-table-column label="所属代理" prop="belong" align="center">
                <template slot-scope="scope">
                  <div :title="scope.row.belong" class="ellipsis">{{scope.row.belong}}</div>
                </template>
              </el-table-column>
              <el-table-column label="镜像" prop="label" align="center"></el-table-column>
              <el-table-column label="地址" prop="ip" align="center" class-name="wp10"></el-table-column>
              <el-table-column label="端口" prop="port" align="center" class-name="wp10"></el-table-column>
              <el-table-column label="状态" prop="status" align="center" class-name="wp10"></el-table-column>
              <el-table-column label="所有者" prop="owner" align="center" class-name="wp10"></el-table-column>
            </el-table>
            <el-pagination :current-page.sync="currentPage_2" :page-size="3" layout="prev, pager, next,total" :total="totalPage_2" class="m-paginator"
              v-if="totalPage_2>0">
            </el-pagination>
          </div>
        </div>
    </div>
    <el-dialog title="日志信息" :visible.sync="showLogDialog" width="6.2rem" custom-class="m-dialog" top="10vh" :before-close="closeLogDialog">
      <div class="u-exhibit">
        <p v-for="v in logContext" v-text="v" :key="v"></p>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
import utils from '@/vender/js/utils'
import websocket from '@/vender/js/webSocket'
const POWERMEM = Math.pow(1024, 2)
const NEGPOWERMEM = Math.pow(1024, -2)
const POWERCPU = Math.pow(10, 9)
const NEGPOWERCPU = Math.pow(10, -9)
export default {
  data () {
    return {
      serviceId: null,
      websocket: null,
      formData: {
        name: '',
        sequence: '',
        created: '',
        updated: '',
        version: '',
        deploy: '',
        duplicate: '',
        mirror: '',
        envs: [],
        ports: [],
        resource: {
          cpuLimit: 0,
          cpuReserve: 0,
          memLimit: 0,
          memReserve: 0
        },
        restart: {
          condition: 'on-failure',
          delay: null,
          max: null,
          window: null
        },
        labels: [],
        list: []
      },
      editMode: false,
      protocolOpt: [
        {value: 'tcp'},
        {value: 'udp'}
      ],
      deliverOpt: [
        {value: 'ingress'},
        {value: 'host'}
      ],
      conditionOpt: [
        {value: 'none'},
        {value: 'on-failure'},
        {value: 'any'}
      ],
      logContext: [],
      showLogDialog: false,
      currentPage_2: this.constants.PAGE_SETTING.pageNum
    }
  },
  methods: {
    appendEnv () {
      this.formData.envs.push({
        envKey: '',
        envValue: '',
        hover: false
      })
    },
    hoverEnvs (i) {
      this.formData.envs[i].hover = true
    },
    leaveEnvs (i) {
      this.formData.envs[i].hover = false
    },
    removeEnvs (i) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.envs.splice(i, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    newPort () {
      this.formData.ports.push({
        host: '',
        container: '',
        protocol: '',
        deliver: ''
      })
    },
    deletePorts (i) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.ports.splice(i, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    newLabels () {
      this.formData.labels.push({
        name: '',
        value: ''
      })
    },
    deletelabels (i) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.labels.splice(i, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    inspectDialog () {
      // this.showLogDialog = true
      this.$router.push({name: 'log', query: {contId: this.$route.query.serviceId, type: 'servicelog'}})
    },
    closeLogDialog () {
      this.websocket.close()
      this.logContext = []
      this.showLogDialog = false
    },
    deleteService () {
      let vue = this
      vue.$confirm('此操作将永久删除该服务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest.postRequest(`${this.constants.BaseUrl}/service/services/delete?serviceId=${vue.serviceId}`, null, (res) => {
          vue.$message({
            type: 'success',
            message: ' 删除成功！',
            duration: 2000
          })
          let t = setTimeout(() => {
            vue.$router.push({name: 'proxy'})
            clearTimeout(t)
          }, 2500)
        })
      })
    },
    updateService () {
      let vue = this
      let formData = this.formData
      this.$validator.validateAll().then((result) => {
        if (result) {
          let transfer = {
            appid: '',
            endpointSpecEntity: {
              mode: '',
              portConfigEntities: []
            },
            imageid: '',
            labels: {},
            name: '',
            serviceModeEntity: {
              mode: '',
              replicas: 0
            },
            taskSpecEntity: {
              containerSpecEntity: {
                env: [],
                image: ''
              },
              resourceRequirementsEntity: {
                limits: {
                  memoryBytes: 0,
                  nanoCpus: 0
                },
                reservations: {
                  memoryBytes: 0,
                  nanoCpus: 0
                }
              },
              restartPolicyEntity: {
                condition: '',
                delay: 0,
                maxAttempts: 0,
                window: 0
              }
            }
          }
          // 名称
          transfer.name = formData.name
          // 副本
          transfer.serviceModeEntity = {
            mode: formData.deploy,
            replicas: formData.duplicate
          }
          // 环境变量
          if (formData.envs && formData.envs.length) {
            formData.envs.forEach((item) => {
              if (item.envKey !== '' && item.envValue !== '') {
                transfer.taskSpecEntity.containerSpecEntity.env.push(item.envKey + '=' + item.envValue)
              }
            })
          }
          transfer.taskSpecEntity.containerSpecEntity.image = formData.mirror
          // 端口
          if (formData.ports && formData.ports.length) {
            formData.ports.forEach((item) => {
              transfer.endpointSpecEntity.portConfigEntities.push({
                protocol: item.protocol,
                targetPort: item.container,
                publishedPort: item.host,
                publishMode: item.deliver
              })
            })
          }
          // 资源限制
          transfer.taskSpecEntity.resourceRequirementsEntity = {
            'limits': {
              'memoryBytes': formData.resource.memLimit * POWERMEM,
              'nanoCpus': formData.resource.cpuLimit * POWERCPU
            },
            'reservations': {
              'memoryBytes': formData.resource.memReserve * POWERMEM,
              'nanoCpus': formData.resource.cpuReserve * POWERCPU
            }
          }
          // 重启规则
          transfer.taskSpecEntity.restartPolicyEntity = {
            'condition': formData.restart.condition,
            'delay': formData.restart.delay,
            'maxAttempts': formData.restart.MaxAttempts,
            'window': formData.restart.Window
          }
          // 服务标签
          if (formData.labels && formData.labels.length) {
            formData.labels.forEach((item) => {
              transfer.labels[item.name] = item.value
            })
          }
          httpRequest.postRequest(`${this.constants.BaseUrl}/service/services/update?serviceId=${encodeURIComponent(vue.serviceId)}&version=${encodeURIComponent(formData.version)}`, transfer, (res) => {
            vue.$message({
              type: 'success',
              message: ' 更新成功！',
              duration: 2000
            })
            let t = setTimeout(() => {
              vue.$router.push({name: 'proxy'})
              clearTimeout(t)
            }, 2500)
          }, () => {
            vue.$message.error('更新失败!')
          })
        } else {
          this.$message.error('请检查输入内容是否完整!')
        }
      })
    },
    activeWebsocket () {
      let vue = this
      this.websocket = websocket.initWebSocket({
        onopen (target) {
          target.send(1)
        },
        onmessage (mes) {
          vue.logContext.push(mes)
        },
        url: vue.constant.WebsocketUrl
      })
    },
    handleServiceRow (r) {
      this.$router.push({
        name: 'service_interview',
        query: {
          paraPort: r.paraPort,
          paraIp: r.paraIp,
          hostId: r.hostId,
          contId: r.containerId
        }
      })
    }
  },
  computed: {
    serviceData () {
      return this.formData.list.slice((this.currentPage_2 - 1) * 3, (this.currentPage_2 - 1) * 3 + 3)
    },
    totalPage_2 () {
      return this.formData.list.length
    }
  },
  created () {
    let vue = this
    vue.serviceId = vue.$route.query.serviceId
    // console.log(vue.serviceId)
    httpRequest.getRequest(`${this.constants.BaseUrl}/service/services/inspect?serviceId=${encodeURIComponent(vue.serviceId)}`, null, (res) => {
      let data = res.data
      vue.originData = data
      vue.formData = {...vue.formData,
        name: data.Spec.Name,
        sequence: data.ID,
        created: utils.formatDateFromLong(data.CreatedAt, 'yyyy-MM-dd hh:mm:ss'),
        updated: utils.formatDateFromLong(data.UpdatedAt, 'yyyy-MM-dd hh:mm:ss'),
        version: data.Version.Index,
        deploy: data.Spec.Mode.Global ? 'global' : 'replicated',
        duplicate: (() => {
          try {
            return data.Spec.Mode.Replicated.Replicas
          } catch (error) {}
        })(),
        mirror: data.Spec.TaskTemplate.ContainerSpec.Image,
        envs: (() => {
          try {
            let res = []
            data.Spec.TaskTemplate.ContainerSpec.Env.forEach((item) => {
              let map = item.split('=')
              res.push({
                envKey: map[0],
                envValue: map[1],
                hover: false
              })
            })
            return res
          } catch (error) {}
        })(),
        ports: (() => {
          try {
            let res = []
            data.Spec.EndpointSpec.Ports.forEach((item) => {
              res.push({
                host: item.PublishedPort,
                container: item.TargetPort,
                protocol: item.Protocol,
                deliver: item.PublishMode
              })
            })
            return res
          } catch (error) {}
        })(),
        resource: {
          cpuLimit: data.Spec.TaskTemplate.Resources.Limits ? data.Spec.TaskTemplate.Resources.Limits.NanoCPUs * NEGPOWERCPU : 0,
          cpuReserve: data.Spec.TaskTemplate.Resources.Reservations ? data.Spec.TaskTemplate.Resources.Reservations.NanoCPUs * NEGPOWERCPU : 0,
          memLimit: data.Spec.TaskTemplate.Resources.Limits ? data.Spec.TaskTemplate.Resources.Limits.MemoryBytes * NEGPOWERMEM : 0,
          memReserve: data.Spec.TaskTemplate.Resources.Reservations ? data.Spec.TaskTemplate.Resources.Reservations.MemoryBytes * NEGPOWERMEM : 0
        },
        restart () {
          if (data.Spec.TaskTemplate.RestartPolicy) {
            return {
              condition: data.Spec.TaskTemplate.RestartPolicy.Condition || 'on-failure',
              delay: data.Spec.TaskTemplate.RestartPolicy.Delay || null,
              max: data.Spec.TaskTemplate.RestartPolicy.MaxAttempts || null,
              window: data.Spec.TaskTemplate.RestartPolicy.Window || null
            }
          }
        },
        labels: (() => {
          let res = []
          for (let i of Object.keys(data.Spec.Labels)) {
            res.push({
              name: i,
              value: data.Spec.Labels[i]
            })
          }
          return res
        })()
      }
    })
    httpRequest.getRequest(`${this.constants.BaseUrl}/service/services/dockerinfo`, null, (res) => {
      vue.formData.resource.memTotal = Math.round(res.data.MemTotal / (1024 ^ 2))
      vue.formData.resource.cpuTotal = res.data.NCPU
    })
    // 获取服务列表
    httpRequest.getRequest(`${this.constants.BaseUrl}/service/services/list/containers?serviceId=${encodeURIComponent(vue.serviceId)}`, null, (res) => {
      res.data && res.data.forEach((item, index) => {
        vue.formData.list.push({
          sort: ++index,
          name: item.container,
          belong: item.servicename,
          label: item.imagename,
          ip: item.ipAddress || '-',
          port: item.ports.length ? item.ports[0] + item.ports[1] : '-',
          status: item.state === 'running' ? '运行中' : '暂停',
          owner: item.auth || '-',

          paraPort: item.hostPort,
          paraIp: item.hostIp,
          hostId: item.hostId,
          containerId: item.containerId
        })
      })
    })
  }
}
</script>

<style lang="less">
.m-wrap-table {
  &.proxy-service {
    tr {
      th,
      td {
        width: (100%-45%)/3;
      }
    }
    .m-paginator {
      padding-bottom: 16px;
      text-align: right;
    }
  }
}
</style>
