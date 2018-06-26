<template>
  <div class="m-content pg-mirror" ref="container" v-loading.fullscreen.lock="transmitting">
    <div class="u-notify">
      <span><em @click="$router.push({name: 'network'})">网络管理</em> > <em>新增</em></span>
      <a class="btn-edite" @click="reserve">保存</a>
    </div>
    <div class="wrapper">
      <!-- 基本信息 -->
      <el-form  :model="formData" ref="form" label-width="80px" label-position="top" :rules="rules" class="standard-form"
      style="width:100%;padding-bottom:20px;">
        <h2 class="u-header">基本信息</h2>
        <el-col :span="8">
          <el-form-item label="名称 :" prop="name">
            <el-input v-model="formData.name" placeholder="mynet" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="子网掩码 :" prop="subnetMask">
            <el-input v-model="formData.subnetMask" placeholder="e.g. 172.20.0.0/16" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="网关 :" prop="gateway">
            <el-input v-model="formData.gateway" placeholder="e.g. 172.20.10.11" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="类型 :" prop="category">
            <el-select v-model="formData.category" placeholder="请选择" class="defW">
              <el-option v-for="(v, i) in categoryOpt" :value="v.value" :key="i"></el-option>
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
        <h2 class="u-header fl wp100" style="margin-top:10px;">标签<a class="btn btn-addnew" @click="addLabel">+</a></h2>
        <el-col :span="16" class="env-bar" v-for="(v, i) in formData.labels" :key="'label_'+i">
          <el-form-item label="名称 :">
            <el-input v-model="v.key" placeholder="e.g.come.example.foo" class="defW"></el-input>
          </el-form-item>
          <el-form-item label="变量 :">
            <el-input v-model="v.value" placeholder="e.g.bar" style="display:inline-block;width:auto;" class="defW"></el-input>
            <a class="btn btn-remove" style="margin-left:5px;" @click="deleteLabel(i)"></a>
          </el-form-item>
        </el-col>
        <h2 class="u-header fl wp100" style="margin-top:16px;">
          是否限制外部访问网络
          <el-switch v-model="formData.restrict" active-color="#4d84fe" inactive-color="#c5c5c5" active-text="是" inactive-text="否"
          :active-value="true" :inactive-value="false" style="transform:translate(20px,-2px);"></el-switch>
        </h2>
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
        subnetMask: '',
        gateway: '',
        category: '',
        drivers: [{
          key: '',
          value: ''
        }],
        labels: [{
          key: '',
          value: ''
        }],
        restrict: false,
        access: false,
        authority: 'admin'
      },
      categoryOpt: [{
        value: 'bridge'
      }, {
        value: 'host'
      }, {
        value: 'macvlan'
      }, {
        value: 'null'
      }, {
        value: 'overlay'
      }],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        subnetMask: [{ required: true, message: '请输入子网掩码', trigger: 'blur' }],
        gateway: [{ required: true, message: '请输入网关', trigger: 'blur' }],
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
    addLabel () {
      this.formData.labels.push({
        key: '',
        value: ''
      })
    },
    deleteLabel (i) {
      this.formData.labels.splice(i, 1)
    },
    reserve () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let transfer = {
            name: this.formData.name,
            subnet: this.formData.subnetMask,
            gateway: this.formData.gateway,
            driver: this.formData.category,
            internal: this.formData.restrict,
            opts: (() => {
              let res = []
              this.formData.drivers.forEach(item => {
                res.push(item.key + '=' + item.value)
              })
              return res
            })(),
            labels: (() => {
              let res = []
              this.formData.labels.forEach(item => {
                res.push(item.key + '=' + item.value)
              })
              return res
            })()
          }
          httpRequest.postRequest(`${this.constants.BaseUrl}/network/networks/add`, transfer, res => {
            this.$message({
              message: '添加成功!',
              duration: 2000,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.push({name: 'network'})
            }, 2200)
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
