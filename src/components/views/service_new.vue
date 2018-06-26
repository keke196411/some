<template>
  <div class="m-content pg-mirror" ref="container" v-loading.fullscreen.lock="transmitting">
    <div class="u-notify">
      <span><em @click="$router.push({name: 'service'})">服务管理</em> > <em>新增</em></span>
      <a class="btn-edite" @click="reserve">保存</a>
    </div>
    <div class="wrapper">
      <!-- 基本信息 -->
      <el-form  :model="formData" ref="form" label-width="80px" label-position="top" :rules="rules" class="standard-form"
      style="width:100%;padding-bottom:20px;">
        <h2 class="u-header">基本信息</h2>
        <el-col :span="8">
          <el-form-item label="主机名称 :" prop="hostId">
            <el-select v-model="formData.hostId" placeholder="请选择" class="defW">
              <el-option v-for="(item, i) in hostIdOpt" :key="i" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="镜像 :" prop="mirror">
            <el-select v-model="formData.mirror" placeholder="请选择" class="defW input-lih-28" :disabled="!mirrorOpt.length">
              <el-option v-for="(item, i) in mirrorOpt" :key="'mirror_'+i" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称 :" prop="name">
            <el-input v-model="formData.name" placeholder="e.g. name" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="9">
          <el-form-item label="Always pull the image :">
            <div class="radio-bar defW input-lih-28">
              <el-radio v-model="formData.pull" :label="true">是</el-radio>
              <el-radio v-model="formData.pull" :label="false">否</el-radio>
            </div>
          </el-form-item>
        </el-col> -->
        <el-col :span="9">
          <el-form-item label="是否暴露所有端口 :">
            <div class="radio-bar defW input-lih-28">
              <el-radio v-model="formData.exposed" :label="true">是</el-radio>
              <el-radio v-model="formData.exposed" :label="false">否</el-radio>
            </div>
          </el-form-item>
        </el-col>
        <!-- 端口 -->
        <h2 class="u-header fl wp100" style="margin-top: 16px;">端口<a class="btn btn-addnew" @click="newPort">+</a></h2>
        <el-col :span="24" style="padding:20px 0;">
          <ul class="table-style striped al-center">
            <li>
              <span class="wp25">主机端口</span>
              <span class="wp25">容器端口</span>
              <span class="wp25">协议</span>
              <!-- <span class="wp20">发布模式</span> -->
              <span class="wp25">操作</span>
            </li>
            <li v-for="(v, i) in formData.ports" :key="'port_'+i">
              <el-form-item class="fl wp25" :props="'ports.' + i + '.host'" :rules="[
              {required: true, message: '请输入主机端口', trigger: 'blur'}
              ]" style="margin-top:4px;">
                <input v-model="v.host" class="el-input__inner input-lih-28" type="text" placeholder="host: e.g.80">
              </el-form-item>
              <el-form-item class="fl wp25" :props="'ports.' + i + '.container'" :rules="[
              {required: true, message: '请输入容器端口', trigger: 'blur'}
              ]" style="margin-top:4px;">
                <input v-model="v.container" class="el-input__inner input-lih-28" type="text" placeholder="container: e.g.80">
              </el-form-item>
              <span class="fl wp25">
                <div class="radio-bar mapper input-lih-28" style="margin-top:0;padding-top:2px;">
                  <input type="radio" value="tcp" v-model="v.protocol" label="TCP" name="protocol" :class="v.protocol==='tcp'?'checked':''">
                  <input type="radio" value="udp" v-model="v.protocol" label="UDP" name="protocol" :class="v.protocol==='udp'?'checked':''">
                </div>
              </span>
              <!-- <span class="wp20">
                <el-select v-model="v.deliver">
                  <el-option v-for="item in deliverOpt" :key="item.value" :value="item.value">
                  </el-option>
                </el-select>
              </span> -->
              <span class="wp25"><a class="btn btn-delete" @click="deletePorts(index)"></a></span>
            </li>
          </ul>
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
                <el-form-item label="user :">
                  <el-input v-model="formData.user" placeholder="user" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="控制台 :">
                  <div class="radio-bar input-lih-28">
                    <el-radio v-model="formData.console" label="both">Interactive&amp;TTY</el-radio>
                    <el-radio v-model="formData.console" label="interactive">Interactive</el-radio>
                    <el-radio v-model="formData.console" label="tty">TTY</el-radio>
                    <el-radio v-model="formData.console" label="none">None</el-radio>
                  </div>
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
                  <el-select placeholder="请选择" class="defW" v-model="v.load" filterable @focus="isloaded" :filter-method="fiterMount">
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
              <el-col :span="12">
                <el-form-item label="网络 :">
                  <el-select v-model="formData.network.net" placeholder="请选择" class="defW" @focus="isloaded" filterable>
                    <el-option v-for="(item, i) in netOpt" :key="i" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="容器名称 :" v-if="formData.network.net==='container'">
                  <el-select v-model="formData.network.container" placeholder="请选择" class="defW">
                    <el-option v-for="(item, i) in contOpt" :key="i" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主机名称 :">
                  <el-input v-model="formData.network.host" placeholder="e.g. web01" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作域 :">
                  <el-input v-model="formData.network.region" placeholder="e.g. example.com" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="MAC地址 :">
                  <el-input v-model="formData.network.mac" placeholder="e.g. 12-34-56-78-9a-bc" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="IPv4地址 :">
                  <el-input v-model="formData.network.ipv4" placeholder="e.g. 172.20.0.1" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="IPv6地址 :">
                  <el-input v-model="formData.network.ipv6" placeholder="e.g. a:b:c:d:2134" class="defW"></el-input>
                </el-form-item>
              </el-col>
              <h2 class="u-header fl wp100" style="margin:10px 0 0;">主机文件入口<a class="btn btn-addnew" @click="addEntry">+</a></h2>
              <el-col :span="24" v-for="(v, i) in formData.hostEntries" :key="'entry_'+i" style="margin-top:10px;">
                <label class="el-form-item__label" style="line-height:28px;margin-right:10px;padding:0;vertical-align:top;">变量 :</label>
                <el-input placeholder="e.g. host:IP" class="defW" v-model="v.value"></el-input>
                <a class="btn btn-remove" style="margin-left:5px;" @click="deleteEntry(i)"></a>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="环境" name="environment">
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
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
export default {
  data () {
    return {
      formData: {
        name: '',
        hostId: '',
        mirror: '',
        exposed: false,
        ports: [],
        command: '',
        insertPoint: '',
        directory: '',
        user: '',
        console: '',
        envs: [
          {envKey: '', envValue: ''}
        ],
        disks: [{
          host: '',
          hostMode: 'volume',
          load: '',
          readMode: true,
          parasitifer: ''
        }],
        network: {
          net: '',
          container: '',
          host: '',
          region: '',
          mac: '',
          ipv4: '',
          ipv6: ''
        },
        hostEntries: [{value: ''}]
      },
      mirrorOpt: [],
      awaitMirror: [],
      hostIdOpt: [],
      contOpt: [],
      mountOpt: [],
      mountOptCopy: [],
      netOpt: [],
      entryOpt: [],
      transmitting: false,
      protocolOpt: [
        {value: 'tcp'},
        {value: 'udp'}
      ],
      // deliverOpt: [
      //   {value: 'ingress'},
      //   {value: 'host'}
      // ],
      proxyContent: 'command',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        hostId: [{ required: true, message: '请输入主机名', trigger: 'blur' }],
        mirror: [{ required: true, message: '请输入镜像', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'formData.hostId' (v) {
      this.mirrorOpt = this.awaitMirror.filter((item) => {
        return item.hostId === v
      })
      httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/volumes?hostid=${v}`, null, res => {
        this.mountOpt = []
        res.data.forEach(item => {
          this.mountOpt.push(item.Name)
        })
        this.mountOptCopy = [...this.mountOpt]
      })
      // network
      httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/networks?hostid=${v}`, null, res => {
        this.netOpt = [...res.data]
      })
      // container
      httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/running?hostid=${v}`, null, res => {
        this.contOpt = [...res.data]
      })
    }
  },
  methods: {
    fiterMount (v) {
      this.mountOptCopy = this.mountOpt.filter(item => {
        return item.match(new RegExp(v, 'i'))
      })
    },
    newPort () {
      this.formData.ports.push({
        host: '',
        container: '',
        protocol: 'tcp'
        // deliver: ''
      })
    },
    addEnvItem () {
      this.formData.envs.push({
        envKey: '',
        envValue: ''
      })
      this.$nextTick(function () {
        this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight
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
    addDiskItem () {
      this.formData.disks.push({
        host: '',
        hostMode: 'volume',
        load: '',
        readMode: true,
        parasitifer: ''
      })
      this.$nextTick(function () {
        this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight
      })
    },
    deleteDisk (i) {
      this.formData.disks.splice(i, 1)
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
    isloaded () {
      if (!this.formData.hostId) this.$message.warning('请选择主机名称!')
    },
    reserve () {
      let vue = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let form = vue.formData
          let trans
          switch (form.console) {
            case 'both':
              trans = [true, true]
              break
            case 'tty':
              trans = [false, true]
              break
            case 'interactive':
              trans = [true, false]
              break
            case 'none':
              trans = [false, false]
          }
          let collector = {
            name: form.name,
            image: form.mirror,
            hostid: form.hostId,
            hostConfigEntity: {
              portMappings: (() => {
                let res = []
                form.ports.forEach((item) => {
                  res.push({
                    hostAndport: item.host,
                    containterPort: item.container,
                    protocol: item.protocol
                  })
                })
                return res
              })(),
              publishAllPorts: form.exposed
            },
            cmd: (form.command === '') ? [] : [form.command],
            entrypoint: (form.insertPoint === '') ? [] : [form.insertPoint],
            workingDir: form.directory,
            openStdin: trans ? trans[0] : null,
            tty: trans ? trans[1] : null,
            containermodeName: form.network.container,
            networkMode: form.network.net,
            hostname: form.network.host,
            domainame: form.network.region,
            macAddress: form.network.mac,
            iPv4Address: form.network.ipv4,
            iPv6Address: form.network.ipv6,
            extraHosts: (() => {
              let res = []
              form.hostEntries.forEach(item => {
                item.value !== '' && res.push(item.value)
              })
              return res
            })(),
            env: (() => {
              let res = []
              form.envs.forEach((item) => {
                if (item.envKey !== '' && item.envValue !== '') {
                  res.push(item.envKey + '=' + item.envValue)
                }
              })
              return res
            })(),
            volumes: (() => {
              let res = []
              form.disks.forEach(item => {
                res.push({
                  containerPath: item.host,
                  name: item.hostMode === 'volume' ? item.load : item.parasitifer,
                  readOnly: item.readMode,
                  type: item.hostMode
                })
              })
              return res
            })()
          }
          httpRequest.postRequest(`${this.constants.BaseUrl}/container/containers/addContainer`, collector, (res) => {
            vue.$message({
              message: '提交成功!',
              type: 'success',
              duration: 2000
            })
            let t = setTimeout(() => {
              vue.$router.push({name: 'service'})
              clearTimeout(t)
            }, 2200)
          })
        } else {
          console.log('submit error !')
          return false
        }
      })
    }
  },
  created () {
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
        this.awaitMirror.push({
          hostId: item.hostid,
          value: item.imagename
        })
      })
    })
    // hostId
    httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/hosts`, null, (res) => {
      res.data.forEach((item) => {
        this.hostIdOpt.push({label: item.hostname, value: item.hostid})
      })
    })
  }
}
</script>

<style lang="less">

</style>
