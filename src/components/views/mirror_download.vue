<template>
  <div class="m-content pg-mirror" v-loading="uploading" element-loading-background="rgba(255, 255, 255, .5)">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'mirror'})">镜像管理</em> >
        <em>新增</em>
      </span>
      <a class="btn-edite" @click="submitForm">保存</a>
    </div>
    <div class="wrapper">
      <h2 class="u-header">基本信息</h2>
      <el-form ref="form" :model="formData" label-width="80px" label-position="top" :rules="rules" class="standard-form" style="width:6.3rem;">
        <el-col :span="12">
          <el-form-item label="镜像仓库:" prop="lib">
            <el-select v-model="formData.lib" placeholder="请选择镜像仓库" class="defW">
              <el-option v-for="item in libs" :key="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称:" prop="name">
            <el-select v-model="formData.name" placeholder="请输入名称" class="defW" filterable remote :remote-method="queryNames" :loading="querying" allow-create default-first-option>
              <el-option v-for="(item, index) in nameOpt" :key="index" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名:">
            <el-input v-model="formData.user" palceholder="请输入用户名" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码:">
            <el-input v-model="formData.code" type="password" palceholder="请输入密码" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="formData.desc" placeholder="请输入相关描述" style="width:5.61rem;"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="u-shadow" v-show="shadowing">
      <p>{{processLabel}}</p>
      <el-progress :stroke-width="18" :percentage="processPercent" :text-inside="true"></el-progress>
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
        lib: '',
        user: '',
        code: '',
        desc: ''
      },
      libs: [],
      nameOpt: [],
      uploading: false,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        lib: [
          { required: true, message: '请选择入仓库', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      },
      shadowing: false,
      processLabel: '',
      processPercent: 0,
      querying: false
    }
  },
  created () {
    let vue = this
    httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/registry`, null, (res) => {
      res.data.forEach((item) => {
        vue.libs.push({
          label: item.dicname,
          value: item.dicname
        })
      })
      this.formData.lib = vue.libs[0].value
    })
  },
  methods: {
    submitForm () {
      let vue = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          vue.downloadItem()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    queryNames (v) {
      this.querying = true
      if (v === '' && this.formData.name) {
        this.formData.name = ''
        return
      }
      httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/search?term=${encodeURIComponent(v)}&imageRegistry=${this.formData.lib}`, null, (res) => {
        let data = [...new Set(res.data)]
        data = data.map(item => { return {value: item} })
        this.nameOpt = data
        this.querying = false
      })
    },
    downloadItem () {
      let vue = this
      vue.uploading = true
      let query = {
        desc: this.formData.desc,
        iamgeRegistry: this.formData.lib,
        image: this.formData.name,
        passwd: this.formData.code,
        user: this.formData.user
      }
      httpRequest.postRequest(`${this.constants.BaseUrl}/image/images/pull`, query, (res) => {
        vue.uploading = false
        vue.$message({
          message: '下载成功！',
          type: 'success',
          duration: 2000
        })
        let t = setTimeout(() => {
          this.$router.push({name: 'mirror'})
          clearTimeout(t)
        }, 2200)
      }, (error) => {
        vue.$message.error(error.response ? error.response.data.message : error.message)
        vue.uploading = false
      })
    }
  }
}

</script>

<style lang="less">

</style>
