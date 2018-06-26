<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em @click="$router.push({name: 'mirror'})">镜像管理</em> > <em>查看</em></span>
      <a class="btn-edite" @click="editMode = true" v-if="libPath">编辑</a>
    </div>
    <div class="view-bar">
      <h2 class="u-header">更新标签<a :class="['btn','btn-refresh',updating&&'rotating']" @click="upload" v-if="libPath&&editMode"></a></h2>
      <div class="content">
        <div class="td-style wp34 custom-input">
          <label>名称:</label>
          <el-input type="text" name="userName" placeholder="请输入用户名" v-model="detail.name" :readonly="!editMode" class="multipleMode"></el-input>
        </div>
        <div class="td-style wp34 custom-input" v-if="libPath"><em>仓库地址:</em><span>{{libPath}}</span></div>
        <div class="td-style wp34 custom-input" v-show="editMode"><label>用户名:</label><el-input type="text" placeholder="请输入用户名" v-model="newUser"></el-input></div>
        <div class="td-style wp34 custom-input" v-show="editMode"><label>密码:</label><el-input type="password" placeholder="请输入密码" v-model="userPassword"></el-input></div>
      </div>
    </div>
    <div class="view-bar">
      <h2 class="u-header">镜像详情<a class="btn btn-delete" @click="deleteThis"></a></h2>
      <div class="content">
        <div class="td-style"><em>编号:</em><span>{{detail.series}}</span></div>
        <div class="td-style"><em>大小:</em><span>{{mirrorSize}}</span></div>
        <div class="td-style"><em>创建时间:</em><span>{{mirrorCreated}}</span></div>
        <div class="td-style"><em>构建基础:</em><span>{{detail.build}}</span></div>
      </div>
    </div>
    <div class="view-bar" v-if="(()=>{for(let i in docker){if(docker[i]) return true}})()">
      <h2 class="u-header">Dockerfile详情</h2>
      <div class="content">
        <ul class="table-style striped">
          <li><span>名称</span><span>内容</span></li>
          <li v-if="docker.cmd"><span>CMD</span><span>{{docker.cmd}}</span></li>
          <li v-if="docker.entryPoint"><span>ENTERPOINT</span><span>{{docker.entryPoint}}</span></li>
          <li v-if="docker.exposedPorts"><span>EXPOSE</span><span>{{docker.exposedPorts}}</span></li>
          <li v-for="(item, index) in  docker.env" :key="index"><span>ENV</span><span>{{item}}</span></li>
        </ul>
      </div>
    </div>
    <div class="view-bar" v-if="layer.length">
      <h2 class="u-header">镜像图层</h2>
      <div class="content">
        <ul class="table-style striped">
          <li><span>大小</span><span>内容</span></li>
          <li v-for="(item, index) in layer" :key="index">
            <span>{{item.size}}</span>
            <span v-if="item.content.length<=collapseW" v-text="item.content"></span>
            <el-collapse v-if="item.content.length>collapseW">
              <el-collapse-item :title="item.content.slice(0,collapseW)">
                <div>{{item.content.slice(collapseW)}}</div>
              </el-collapse-item>
            </el-collapse>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/vender/js/utils'
import httpRequest from '@/vender/js/httpUtils'
export default {
  data () {
    return {
      newUser: '',
      userPassword: '',
      editMode: false,
      libPath: '',
      libPathCode: '',
      detail: {},
      docker: {},
      layer: [],
      updating: false,
      collapseW: 95
    }
  },
  created () {
    let vue = this
    let hostId = this.$route.query.hostId
    let imgName = this.$route.query.name
    let queryName = encodeURIComponent(imgName)

    httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/inspect?hostId=${hostId}&image=${queryName}`, null, (res) => {
      let data = res.data
      vue.detail = {
        name: imgName,
        hostId: hostId,
        series: data.Id,
        size: Math.round(data.Size / 1024),
        created: data.Created,
        build: 'Docker' + data.DockerVersion + ' on ' + data.Os + ',' + data.Architecture
      }
      vue.docker = {
        cmd: data.Config.Cmd ? data.Config.Cmd[0] : '',
        entryPoint: data.Config.Entrypoint,
        exposedPorts: data.Config.ExposedPorts,
        env: data.Config.Env
      }
    })
    httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/regInfo?hostId=${hostId}&image=${queryName}`, null, (res) => {
      vue.libPath = (!res.data.dicname || res.data.dicname === '' || res.data.dicname.match(/^\s+$/)) ? undefined : res.data.dicname
      vue.libPathCode = res.data.diccode
    })
    httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/history?hostId=${hostId}&imageName=${queryName}`, null, (res) => {
      res.data.forEach((item) => {
        vue.layer.push({
          size: item.size,
          content: item.layer.replace(/"/g, '')
        })
      })
    })
  },
  computed: {
    mirrorSize () {
      return this.detail.size > 1024 ? (this.detail.size / 1024).toFixed(0) + 'MB' : this.detail.size + 'KB'
    },
    mirrorCreated () {
      return utils.formatDateFromLong(this.detail.created, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    deleteThis () {
      this.$confirm('此操作将永久删除该镜像, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/remove?hostId=${this.$route.query.hostId}&imageName=${encodeURIComponent(this.$route.query.name)}`, null, (res) => {
          this.$message({
            message: '删除成功!',
            type: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.$router.push({name: 'mirror'})
          }, 2200)
        })
      })
    },
    upload () {
      this.updating = true
      let query = {
        'iamgeRegistry': this.libPath,
        'image': this.detail.name,
        'passwd': this.userPassword,
        'user': this.newUser
      }
      httpRequest.postRequest(`${this.constants.BaseUrl}/image/images/tag?hostId=${this.$route.query.hostId}&image=${encodeURIComponent(this.$route.query.name)}`, query, (res) => {
        this.$message.success('更新成功!')
        this.updating = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.updating = false
      })
    }
  }
}
</script>

<style lang="less">

</style>
