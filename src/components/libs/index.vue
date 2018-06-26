<template>
  <div class="pg-index" v-loading.fullscreen="adding" element-loading-background="rgba(255,255,255,.33)" v-if="stay">
    <div class="legend">
      <i class="icon icon-logo"></i>
      <h2>运维监控</h2>
    </div>
    <div class="settings-box">
      <el-form ref="form" :model="formData" label-width="80px" label-position="top" :rules="rules" class="standard-form">
        <el-col :span="24">
          <el-form-item label="名称 :" prop="name">
            <el-input class="wp100" placeholder="请输入名称" v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP地址 :" prop="ip">
            <el-input class="defW" placeholder="127.0.0.1" v-model="formData.ip"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="端口 :" prop="port" class="al-right">
            <el-input class="defW" placeholder="6066" v-model="formData.port"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名 :" prop="user">
            <el-input class="defW" placeholder="请输入用户名" v-model="formData.user"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码 :" prop="token" class="al-right">
            <el-input class="defW" placeholder="请输入密码" v-model="formData.token" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <a class="btn btn-confirm" @click="handleAdd">确定</a>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
export default {
  data () {
    return {
      stay: false,
      adding: false,
      formData: {
        name: '',
        ip: '',
        port: '',
        user: '',
        token: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: ['blur', 'change'] }],
        ip: [
          { required: true, message: '请输入IP地址', trigger: ['blur', 'change'] },
          {validator: this.verifier.checkIP, trigger: ['blur', 'change']}
        ],
        port: [
          { required: true, message: '请输入端口', trigger: ['blur', 'change'] },
          {validator: this.verifier.checkPort, trigger: ['blur', 'change']}
        ],
        user: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] }],
        token: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    addHost () {
      let vue = this
      let transfer = {
        hostName: vue.formData.name,
        ip: vue.formData.ip,
        passwd: vue.formData.token,
        port: vue.formData.port,
        user: vue.formData.user
      }
      httpRequest.postRequest(`${this.constants.BaseUrl}/cluster/initCluster`, transfer, res => {
        vue.$message({
          message: '添加成功!',
          type: 'success',
          duration: 2000
        })
        vue.adding = false
        setTimeout(() => {
          vue.$router.push({name: 'abstract'})
        }, 2200)
      }, error => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        vue.adding = false
      })
    },
    handleAdd () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.adding = true
          this.addHost()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created () {
    let vue = this
    httpRequest.getRequest(`${this.constants.BaseUrl}/cluster/hasMaster`, null, res => {
      if (res.data) {
        this.$router.push({name: 'abstract'})
      } else this.stay = true
    }, (error) => {
      vue.$message.error(error.message)
      vue.stay = true
    })
  }
}
</script>
