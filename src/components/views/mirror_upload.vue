<template>
  <div class="m-content pg-mirror" v-loading="uploading" element-loading-background="rgba(255, 255, 255, .5)">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'mirror'})">镜像管理</em> >
        <em>上传</em>
      </span>
      <a class="btn-edite" @click="submitForm">保存</a>
    </div>
    <div class="wrapper">
      <h2 class="u-header">基本信息</h2>
      <el-form ref="form" :model="formData" label-width="80px" label-position="top" :rules="rules" class="standard-form" style="width:6.3rem;">
        <el-col :span="12">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="formData.name" palceholder="请输入名称" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="镜像仓库:" prop="lib">
            <el-select v-model="formData.lib" placeholder="请选择镜像仓库" class="defW">
              <el-option v-for="(v, i) in libOpt" :key="i" :value="v.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名:" prop="user">
            <el-input v-model="formData.user" palceholder="请输入用户名" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码:" prop="code">
            <el-input v-model="formData.code" type="password" palceholder="请输入密码" class="defW"></el-input>
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
      hostId: '',
      formData: {
        name: '',
        lib: '',
        user: '',
        code: ''
      },
      libOpt: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        lib: [
          { required: true, message: '请输入仓库', trigger: 'blur' }
        ],
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      uploading: false
    }
  },
  created () {
    this.hostId = this.$route.query.hostId
    httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/registry`, null, (res) => {
      res.data.forEach((item) => {
        this.libOpt.push({value: item.dicname})
      })
    })
  },
  methods: {
    submitForm () {
      let vue = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          vue.uploadItem()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    uploadItem () {
      this.uploading = true
      let query = {
        iamgeRegistry: this.formData.lib,
        image: this.formData.name,
        passwd: this.formData.code,
        user: this.formData.user
      }
      httpRequest.postRequest(`${this.constants.BaseUrl}/image/images/push?hostId=${this.hostId}&image=${encodeURIComponent(this.$route.query.img)}`, query, (res) => {
        this.uploading = false
        this.$message({
          message: '上传成功!',
          type: 'success',
          duration: 2000
        })
        let t = setTimeout(() => {
          this.$router.push({name: 'mirror'})
          clearTimeout(t)
        }, 2200)
      }, (e) => {
        this.$message.error(e.response ? e.response.data.message : e.message)
        this.uploading = false
      })
    }
  }
}

</script>

<style lang="less">

</style>
