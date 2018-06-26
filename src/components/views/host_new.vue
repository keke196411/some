<template>
  <div class="m-content pg-mirror" v-loading.fullscreen.lock="inHandle">
    <div class="u-notify">
      <span>
        <em>主机管理</em> >
        <em>新增</em>
      </span>
      <a class="btn-edite" @click="submitForm">保存</a>
    </div>
    <div class="wrapper">
      <el-form ref="form" :model="formData" label-width="80px" label-position="top" :rules="rules" class="standard-form wp100">
        <h2 class="u-header">基本信息</h2>
        <el-col :span="8">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="formData.name" palceholder="请输入名称" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="IP地址:" prop="ip">
            <el-input v-model="formData.ip" palceholder="请输入IP" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="端口:" prop="port">
            <el-input v-model="formData.port" palceholder="请输入端口" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户名:" prop="user">
            <el-input v-model="formData.user" palceholder="请输入用户名" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="密码:" prop="token">
            <el-input type="password" v-model="formData.token" palceholder="请输入IP" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <h2 class="u-header fl wp100" style="margin-top:10px;">高级信息</h2>
        <el-col :span="8">
          <el-form-item label="角色:" prop="role">
            <el-select v-model="formData.role" placeholder="请选择" class="defW">
              <el-option v-for="item in roleOpt" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:" prop="status">
            <el-select v-model="formData.status" placeholder="请选择" class="defW">
              <el-option v-for="item in statusOpt" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="授权码:" prop="authorize">
            <el-input v-model="formData.authorize" palceholder="请输入" readonly style="width:calc(2.47rem - 47px);"></el-input>
            <a class="btn btn-sm-blue" @click="getAuthorize">获取</a>
          </el-form-item>
        </el-col>
        <el-col :span="16" v-for="(v, i) in formData.labels" :key="i" class="clearfix">
          <el-form-item class="wp50 fl" label="标签名 :">
            <el-input v-model="v[0]" palceholder="请输入标签名" class="defW"></el-input>
          </el-form-item>
          <el-form-item class="wp50 fl" label="标签值 :">
            <el-input v-model="v[1]" palceholder="请输入标签值" style="width:calc(2.47rem - 47px);"></el-input>
            <a class="btn btn-sm-blue" @click="formData.labels.push(['',''])" v-if="i===formData.labels.length-1">添加</a>
            <a class="btn btn-remove" @click="formData.labels.splice(i, 1)" v-if="i!==formData.labels.length-1"></a>
          </el-form-item>
        </el-col>
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
        ip: '',
        port: '',
        user: '',
        token: '',
        role: '02',
        status: '0',
        authorize: '',
        labels: [['', '']]

      },
      roleOpt: [
        {label: '管理节点', value: '01'},
        {label: '工作节点', value: '02'}
      ],
      statusOpt: [
        {label: '可用', value: '0'},
        {label: '不可用', value: '1'},
        {label: '移除', value: '2'}
      ],
      inHandle: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        ip: [
          { required: true, message: '请输入IP', trigger: 'blur' },
          {validator: this.verifier.checkIP, trigger: ['blur', 'change']}
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          {validator: this.verifier.checkPort, trigger: ['blur', 'change']}
        ],
        user: [{ type: 'string', required: true, message: '请输入用户名', trigger: 'blur' }],
        token: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        authorize: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getAuthorize () {
      httpRequest.getRequest(`${this.constants.BaseUrl}/host/token?role=${this.formData.role}`, null, (res) => {
        this.formData.authorize = res.data
      })
    },
    submitForm () {
      let form = this.formData
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.inHandle = true
          let labels = {}
          form.labels.forEach((item) => {
            Reflect.set(labels, item[0], item[1])
          })
          let param = {
            hostName: form.name,
            ip: form.ip,
            labels,
            passwd: form.token,
            port: form.port,
            role: form.role,
            status: form.status,
            user: form.user
          }
          httpRequest.postRequest(`${this.constants.BaseUrl}/host/addHost`, JSON.stringify(param), (res) => {
            this.$message({
              message: '提交成功!',
              type: 'success',
              duration: 2000
            })
            this.inHandle = false
            let t = setTimeout(() => {
              this.$router.push({name: 'host'})
              clearTimeout(t)
            }, 2200)
          }, (error) => {
            this.$message.error(error.response ? error.response.data.message : error.message)
            this.inHandle = false
          })
        } else {
          console.log('submit error !')
          return false
        }
      })
    }
  }
}
</script>
