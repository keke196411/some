<template>
  <div class="m-content pg-mirror" ref="container" v-loading.fullscreen.lock="transmitting">
    <div class="u-notify">
      <span><em @click="$router.push({name: 'hardware'})">磁盘管理</em> > <em>新增</em></span>
      <a class="btn-edite" @click="reserve">保存</a>
    </div>
    <div class="wrapper">
      <!-- 基本信息 -->
      <el-form  :model="formData" ref="form" label-width="80px" label-position="top" :rules="rules" class="standard-form"
      style="width:100%;padding-bottom:20px;">
        <h2 class="u-header">基本信息</h2>
        <el-col :span="8">
          <el-form-item label="名称 :" prop="name">
            <el-input v-model="formData.name" placeholder="e.g. myVolume" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="类型 :" prop="category">
            <el-select v-model="formData.category" placeholder="请选择" class="defW">
              <el-option v-for="(v, i) in categoryOpt" :value="v" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <h2 class="u-header fl wp100" style="margin-top:10px;">驱动选项<a class="btn btn-addnew" @click="addDriver">+</a></h2>
        <el-col :span="16" class="env-bar" v-for="(v, i) in formData.drivers" :key="'driver_'+i">
          <el-form-item label="名称 :">
            <el-input v-model="v.key" placeholder="e.g.come.docker.network.bridge.enable_lcc" class="defW"></el-input>
          </el-form-item>
          <el-form-item label="变量 :">
            <el-input v-model="v.value" placeholder="e.g.true" style="display:inline-block;width:auto;" class="defW"></el-input>
            <a class="btn btn-remove" style="margin-left:5px;" @click="deleteDriver(i)"></a>
          </el-form-item>
        </el-col>
        <h2 class="u-header fl wp100" style="margin:16px 0;">
          是否启用访问控制
          <el-switch v-model="formData.access" active-color="#4d84fe" inactive-color="#c5c5c5" active-text="是" inactive-text="否"
          :active-value="true" :inactive-value="false" style="transform:translate(52px,-2px);"></el-switch>
        </h2>
        <el-col :span="16" style="font-size:0;">
          <div class="wp50 inline-block">
            <a :class="['btn', 'btn-giant', formData.authority==='admin'&&'selected']" @click="formData.authority='admin'">
              <em>管理员</em>
              设置成仅管理员拥有管理权限
            </a>
          </div>
          <div class="wp50 inline-block">
            <a :class="['btn', 'btn-giant', formData.authority==='group'&&'selected']" @click="formData.authority='group'">
              <em>成员</em>
              设置成用户和群组拥有管理权限
            </a>
          </div>
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
      transmitting: false,
      formData: {
        name: '',
        category: '',
        drivers: [{
          key: '',
          value: ''
        }],
        access: false,
        authority: 'admin'
      },
      categoryOpt: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        category: [{ required: true, message: '请输入类型', trigger: 'blur' }]
      }
    }
  },
  methods: {
    addDriver () {
      this.formData.drivers.push({
        key: '',
        value: ''
      })
    },
    deleteDriver (i) {
      this.formData.drivers.splice(i, 1)
    },
    reserve () {
      let vue = this
      this.$refs['form'].validate(valid => {
        if (valid) {
          let transfer = {
            name: vue.formData.name,
            driver: vue.formData.category,
            driverOpts: (() => {
              let res = []
              vue.formData.drivers.forEach(item => {
                item.key && item.value && res.push(item.key + '=' + item.value)
              })
              return res
            })()
          }
          httpRequest.postRequest(`${this.constants.BaseUrl}/volume/volumes/add`, transfer, res => {
            this.$message({
              message: '添加成功!',
              duration: 2000,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.push({name: 'hardware'})
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
    httpRequest.getRequest(`${this.constants.BaseUrl}/volume/volumes/drivers`, null, res => {
      this.categoryOpt = [...res.data]
    })
  }
}

</script>
