<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'hardware'})">磁盘管理</em> >
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
          <p v-text="labelName" :title="labelName" class="ellipsis"></p>
        </div>
        <div class="right">
          <div>
            <em>类型 :</em>
            <span>{{type}}</span>
          </div>
          <div class="wp100">
            <em>挂载点 :</em>
            <span>{{volume}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="view-bar">
      <div class="u-header">控制权限</div>
      <div class="content resource">
        <ul class="u-ul-standard">
          <li>
            <div class="cell al-lefti">所有者 :</div>
            <div class="cell">
              <el-select v-model="ownership" class="multipleMode input-lih-24 defW" :disabled="!editMode">
                <el-option v-for="item in ownerOpt" :key="item.value" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </li>
        </ul>
      </div>
      <div class="u-header">驱动选项</div>
      <div class="content" v-if="drivers.length">
        <ul class="table-style striped">
          <li></li>
          <li v-for="(item, index) in drivers" :key="index">
            <span class="wp50">
              <input v-model="item.name" :readonly="true"
              class="multipleMode el-input__inner input-lih-28 al-lefti" type="text" placeholder="请输入">
            </span>
            <span class="wp50">
              <input v-model="item.value" :readonly="true"
              class="multipleMode el-input__inner input-lih-28" type="text" placeholder="请输入">
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
export default {
  data () {
    return {
      editMode: false,
      labelName: '',
      code: '',
      type: '',
      volume: '',
      ownership: 'Public',
      drivers: [],
      ownerOpt: [{
        value: 'Public'
      }, {
        value: 'Restricted'
      }, {
        value: 'Administrators'
      }]
    }
  },
  methods: {
    deleteService () {
      let querier = this.$route.query
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest.postRequest(`${this.constants.BaseUrl}/volume/volumes/delete?hostid=${querier.hostId}&volumeName=${querier.name}`, null, (res) => {
          this.$message({
            message: '删除成功!',
            type: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.$router.push({name: 'hardware'})
          }, 2200)
        })
      })
    },
    updateService () {
      this.$message.error('暂未开通用户权限相关功能!')
    }
  },
  created () {
    let querier = this.$route.query
    let vue = this
    httpRequest.getRequest(`${this.constants.BaseUrl}/volume/volumes/inspect?hostid=${querier.hostId}&volumeName=${querier.name}`, null, res => {
      this.labelName = res.data.Name || '-'
      // this.code = res.data.Name
      this.type = res.data.Driver
      this.volume = res.data.Mountpoint
      for (let i in res.data.Options) {
        vue.drivers.push({
          name: i,
          value: res.data.Options[i]
        })
      }
    })
  }
}
</script>
