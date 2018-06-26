<template>
  <div class="m-content pg-mirror" ref="container" v-loading.fullscreen.lock="transmitting">
    <div class="u-notify">
      <span><em @click="$router.push({name: 'proxy'})">服务代理</em> > <em>新增</em></span>
      <a class="btn-edite" @click="reserve">保存</a>
    </div>
    <div class="wrapper">
      <el-form  :model="formData" ref="form" label-width="80px" label-position="top" :rules="rules" class="standard-form"
      style="width:100%;padding-bottom:20px;">
        <!-- 基本信息 -->
        <h2 class="u-header">基本信息</h2>
        <el-col :span="8">
          <el-form-item label="名称 :" prop="name">
            <el-input v-model="formData.name" placeholder="e.g. name" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="镜像 :">
            <el-select v-model="formData.mirror" placeholder="请选择" class="defW">
              <el-option v-for="(item, i) in mirrorOpt" :key="'mirror_'+i" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="启动模式 :">
            <div class="radio-bar defW input-lih-28">
              <el-radio v-model="formData.pattern" label="global">全局</el-radio>
              <el-radio v-model="formData.pattern" label="replicated">副本</el-radio>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="副本 :" prop="duplicate">
            <el-input v-model.number="formData.duplicate" placeholder="请输入" :disabled="formData.pattern==='global'" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <!-- 端口映射 -->
        <h2 class="u-header fl wp100" style="margin-top: 16px;">端口映射<a class="btn btn-addnew" @click="addMapper">+</a></h2>
        <el-col :span="24" v-for="(v, i) in formData.mappers" :key="'mapper_'+i">
          <el-col :span="8">
            <el-form-item label="host :">
              <el-input v-model.number="v.host" placeholder="e.g. :80" class="defW"></el-input>
              <div class="indicator-arrow"><i class="icon icon-pointer"></i></div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="container :">
              <el-input v-model.number="v.container" placeholder="e.g. :80" class="defW"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="mapper-tail">
            <div class="radio-bar mapper input-lih-28">
              <input type="radio" value="tcp" v-model="v.protocol" label="TCP" name="protocol" :class="v.protocol==='tcp'?'checked':''">
              <input type="radio" value="udp" v-model="v.protocol" label="UDP" name="protocol" :class="v.protocol==='udp'?'checked':''">
              <input type="radio" value="ingress" v-model="v.role" label="Ingress" name="role" :class="v.role==='ingress'?'checked':''">
              <input type="radio" value="host" v-model="v.role" label="Host" name="role" :class="v.role==='host'?'checked':''">
            </div>
            <a class="btn btn-remove" @click="deleteMapper(i)" style="vertical-align:bottom;"></a>
          </el-col>
        </el-col>
        <!-- 具体内容 -->
        <h2 class="u-header fl wp100" style="margin-top: 16px;">具体内容</h2>
        <div class="fl wp66">
          <el-tabs class="tab-proxy" v-model="proxyContent">
            <el-tab-pane label="命令/日志" name="command">
              <el-col :span="12">
                <el-form-item label="命令 :">
                  <el-input v-model="formData.command" placeholder="e.g. /user/bin/nginx-t-c/mynginx" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="接入点 :">
                  <el-input v-model="formData.insertPoint" placeholder="e.g. /bin/sh.c" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作路径 :">
                  <el-input v-model="formData.directory" placeholder="e.g. /user/mynginx" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户 :">
                  <el-input v-model="formData.user" placeholder="user" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <!-- 环境变量 -->
              <h2 class="u-header fl wp100" style="margin-top:10px;">环境变量<a class="btn btn-addnew" @click="addEnvItem">+</a></h2>
              <el-col :span="24" class="env-bar" v-for="(v, i) in formData.envs" :key="'env_'+i">
                <el-form-item label="名称 :">
                  <el-input v-model="v.envKey" placeholder="syslog" class="defW"></el-input>
                </el-form-item>
                <el-form-item label="变量 :">
                  <el-input v-model="v.envValue" placeholder="e.g.myimge:myTag" style="display:inline-block;width:auto;" class="defW"></el-input>
                  <a class="btn btn-remove" style="margin-left:5px;" @click="deleteEnv(i)"></a>
                </el-form-item>
              </el-col>
              <!-- 日志 -->
              <h2 class="u-header fl wp100" style="margin-top: 16px;">日志</h2>
              <el-col :span="12">
                <el-form-item label="Driver :">
                  <el-select v-model="formData.log" placeholder="请选择" class="defW">
                    <el-option v-for="item in logOpt" :key="item.value" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 选项 -->
              <h2 class="u-header fl wp100" style="margin-top: 16px;">options<a class="btn btn-addnew" @click="addOption">+</a></h2>
              <el-col :span="24" class="env-bar" v-for="(v, i) in formData.options" :key="'opt_'+i">
                <el-form-item label="option :">
                  <el-input v-model="v.key" placeholder="e.g.myimge:myTag" class="defW"></el-input>
                </el-form-item>
                <el-form-item label="value :">
                  <el-input v-model="v.value" placeholder="e.g" style="display:inline-block;width:auto;" class="defW"></el-input>
                  <a class="btn btn-remove" style="margin-left:5px;" @click="deleteOption(i)"></a>
                </el-form-item>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="磁盘" name="dist">
              <!-- 磁盘 -->
              <h2 class="u-header fl wp100" style="margin-top:10px;">路径挂载<a class="btn btn-addnew" @click="addDiskItem">+</a></h2>
              <el-col :span="24" class="env-bar" v-for="(v, i) in formData.disks" :key="i">
                <el-form-item label="主机地址 :">
                  <el-input placeholder="e.g. /path/In/container" class="defW" v-model="v.host"></el-input>
                  <div class="radio-bar mapper input-lih-28 wp100" style="margin-top:0;">
                    <input type="radio" value="volume" v-model="v.hostMode" label="挂载" :class="v.hostMode==='volume'?'checked':''">
                    <input type="radio" value="bind" v-model="v.hostMode" label="绑定" :class="v.hostMode==='bind'?'checked':''">
                  </div>
                  <div class="indicator-arrow"><i class="icon icon-pointer"></i></div>
                </el-form-item>
                <el-form-item label="挂载点 :" v-show="v.hostMode==='volume'">
                  <el-select placeholder="请选择" class="defW" v-model="v.load" value-key="Name" filterable :filter-method="filteMount">
                    <el-option v-for="item in mountOptCopy" :key="item" :value="item"></el-option>
                  </el-select>
                  <a class="btn btn-remove" style="margin-left:5px;" @click="deleteDisk(i)"></a>
                  <div class="radio-bar mapper input-lih-28 wp100" style="margin-top:0;">
                    <input type="radio" :value="false" v-model="v.readMode" label="读写" :class="v.readMode||'checked'">
                    <input type="radio" :value="true" v-model="v.readMode" label="只读" :class="v.readMode&&'checked'">
                  </div>
                </el-form-item>
                <el-form-item label="宿主地址 :" v-show="v.hostMode==='bind'">
                  <el-input placeholder="e.g. /path/on/host" class="defW" v-model="v.parasitifer"></el-input>
                  <a class="btn btn-remove" style="margin-left:5px;" @click="deleteDisk(i)"></a>
                  <div class="radio-bar mapper input-lih-28 wp100" style="margin-top:0;">
                    <input type="radio" :value="false" v-model="v.readMode" label="读写" :class="v.readMode||'checked'">
                    <input type="radio" :value="true" v-model="v.readMode" label="只读" :class="v.readMode&&'checked'">
                  </div>
                </el-form-item>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="网络" name="network">
              <!-- 网络 -->
              <h2 class="u-header fl wp100" style="margin-top: 10px;">网络</h2>
              <el-col :span="24">
                <el-select placeholder="请选择" class="defW" v-model="formData.network" filterable>
                  <el-option v-for="(v, i) in netOpt" :key="'net_'+i" :value="v"></el-option>
                </el-select>
              </el-col>
              <h2 class="u-header fl wp100" style="margin-top:10px;">附加网络<a class="btn btn-addnew" @click="addNet">+</a></h2>
              <el-col :span="24" v-for="(v, i) in formData.additionalNet" :key="'add_'+i" style="margin-top:10px;">
                <el-select placeholder="请选择" class="defW" v-model="v.value" filterable>
                  <el-option v-for="(item, index) in netOpt" :key="index" :value="item"></el-option>
                </el-select>
                <a class="btn btn-remove" style="margin-left:5px;" @click="deleteAdditional(i)"></a>
              </el-col>
              <h2 class="u-header fl wp100" style="margin:10px 0 0;">主机文件入口<a class="btn btn-addnew" @click="addEntry">+</a></h2>
              <el-col :span="24" v-for="(v, i) in formData.hostEntries" :key="'entry_'+i" style="margin-top:10px;">
                <label class="el-form-item__label" style="line-height:28px;margin-right:10px;padding:0;vertical-align:top;">变量 :</label>
                <el-input placeholder="e.g. host:IP" class="defW" v-model="v.value"></el-input>
                <a class="btn btn-remove" style="margin-left:5px;" @click="deleteEntry(i)"></a>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
export default{
  data () {
    return {
      formData: {
        name: '',
        mirror: '',
        pattern: 'global',
        duplicate: 1,
        mappers: [],
        command: '',
        insertPoint: '',
        directory: '',
        user: '',
        envs: [
          {envKey: '', envValue: ''}
        ],
        log: 'json-file',
        options: [{
          key: '',
          value: ''
        }],
        disks: [{
          host: '',
          hostMode: 'volume',
          load: '',
          readMode: true,
          parasitifer: ''
        }],
        netWork: '',
        additionalNet: [{value: ''}],
        hostEntries: [{value: ''}]
      },
      mirrorOpt: [],
      logOpt: [],
      mountOpt: [],
      mountOptCopy: [],
      netOpt: [],
      entryOpt: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        duplicate: [
          { required: true, message: '请输入副本', trigger: 'blur' },
          {type: 'number', message: '请输入数值', trigger: ['blur', 'change']}
        ]
      },
      proxyContent: 'command',
      transmitting: false
    }
  },
  methods: {
    filteMount (v) {
      this.mountOptCopy = this.mountOpt.filter(item => {
        return item.match(new RegExp(v, 'i'))
      })
    },
    addMapper () {
      this.formData.mappers.push({
        host: '',
        container: '',
        protocol: 'tcp',
        role: 'ingress'
      })
    },
    deleteMapper (index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.mappers.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    addEnvItem () {
      this.formData.envs.push({
        envKey: '',
        envValue: ''
      })
    },
    deleteEnv (index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.envs.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    addOption () {
      this.formData.options.push({
        option: '',
        value: ''
      })
      this.$nextTick(function () {
        this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight
      })
    },
    deleteOption (index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.options.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    addDiskItem () {
      this.formData.disks.push({
        host: '',
        hostMode: 'volume',
        load: '',
        loadMode: true,
        parasitifer: ''
      })
      this.$nextTick(function () {
        this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight
      })
    },
    deleteDisk (i) {
      this.formData.disks.splice(i, 1)
    },
    addNet () {
      this.formData.additionalNet.push({value: ''})
    },
    deleteAdditional (i) {
      this.formData.additionalNet.splice(i, 1)
    },
    addEntry () {
      this.formData.hostEntries.push({value: ''})
      this.$nextTick(function () {
        this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight
      })
    },
    deleteEntry (i) {
      this.formData.hostEntries.splice(i, 1)
    },
    reserve () {
      let vue = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let form = vue.formData
          let collector = {
            name: form.name,
            extrtaNetwork: (() => {
              let res = []
              form.additionalNet.forEach(item => {
                res.push(item.value)
              })
              return res
            })(),
            imageid: form.mirror,
            network: form.network,
            serviceModeEntity: {
              mode: form.pattern,
              replicas: form.duplicate
            },
            endpointSpecEntity: {
              portConfigEntities: (() => {
                let res = []
                form.mappers.forEach((item) => {
                  res.push({
                    protocol: item.protocol,
                    publishMode: item.role,
                    publishedPort: item.host,
                    targetPort: item.container
                  })
                })
                return res
              })()
            },
            taskSpecEntity: {
              containerSpecEntity: {
                command: (form.command === '') ? [] : [form.command],
                agrs: (form.insertPoint === '') ? [] : [form.insertPoint],
                dir: form.directory,
                env: (() => {
                  let res = []
                  form.envs.forEach((item) => {
                    if (item.envKey !== '' && item.envValue !== '') {
                      res.push(item.envKey + '=' + item.envValue)
                    }
                  })
                  return res
                })(),
                image: (() => {
                  return vue.mirrorOpt.filter((v) => {
                    return v.value === form.mirror
                  })[0].label
                })(),
                user: form.user,
                extraHosts: (() => {
                  let res = []
                  form.hostEntries.forEach(item => {
                    res.push(item.value)
                  })
                  return res
                })(),
                volumes: (() => {
                  let res = []
                  form.disks.forEach(item => {
                    res.push({
                      readOnly: item.readMode,
                      source: item.hostMode === 'volume' ? item.load : {Name: item.parasitifer},
                      target: item.host,
                      type: item.hostMode
                    })
                  })
                  return res
                })()
              },
              driverEntity: {
                name: form.log,
                options: (() => {
                  let res = []
                  form.options.forEach((v, i) => {
                    res.push(v.key + '=' + v.value)
                  })
                  return res
                })()
              }
            }
          }
          httpRequest.postRequest(`${this.constants.BaseUrl}/service/services/add`, collector, (res) => {
            vue.$message({
              message: '提交成功!',
              type: 'success',
              duration: 2000
            })
            let t = setTimeout(() => {
              vue.$router.push({name: 'proxy'})
              clearTimeout(t)
            }, 2500)
          })
        } else {
          console.log('submit error !')
          return false
        }
      })
    }
  },
  created () {
    // 日志
    httpRequest.getRequest(`${this.constants.BaseUrl}/service/services/logDrivers`, null, (res) => {
      res.data.forEach((item) => {
        this.logOpt.push({value: item})
      })
    })
    // 镜像
    httpRequest.getRequest(`${this.constants.BaseUrl}/service/services/images`, null, (res) => {
      if (!res.data.length) {
        this.$message({
          message: '未找到对应镜像，请先下载!',
          duration: 2000,
          type: 'error'
        })
        setTimeout(() => {
          this.$router.push({name: 'mirror'})
        }, 2200)
        return
      }
      res.data.forEach((item) => {
        this.mirrorOpt.push({
          label: item.imagename,
          value: item.imageid
        })
      })
      this.formData.mirror = this.mirrorOpt[0].value
    })
    // 挂载点
    httpRequest.getRequest(`${this.constants.BaseUrl}/service/services/list/volumes`, null, res => {
      res.data.forEach(item => {
        this.mountOpt.push(item.Name)
      })
      this.mountOptCopy = [...this.mountOpt]
    })
    // 网络选项
    httpRequest.getRequest(`${this.constants.BaseUrl}/service/containers/networks`, null, res => {
      this.netOpt = [...res.data]
    })
  }
}
</script>
