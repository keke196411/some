<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em>服务管理</em></span>
      <a class="btn btn-addnew" @click="appendApp">+</a>
      <div class="u-top-search">
        <input type="text" placeholder="请输入关键字" v-model="searcher.searchingInput">
        <a class="btn btn-search" @click="getlistData(searcher.currentPage,paginatorData.pageSize,searcher.searchingInput,searcher.searchingStatus)">
          <i class="icon icon-magnify"></i>
        </a>
      </div>
      <el-select v-model="searcher.searchingStatus" placeholder="状态" style="width:120px;">
        <el-option v-for="(item,index) in seriesStatus" :key="index" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
    </div>
    <div class="m-wrap-table service" ref="tableWrapper" v-loading.fullscreen.lock="changeAppStatus">
      <el-table :data="tableData" style="width: 100%" class="m-table" ref="table">
        <el-table-column label="序号" prop="sort" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属代理" prop="proxy" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属主机名称" prop="host" align="center"></el-table-column>
        <el-table-column label="所属主机ip" prop="hostIp" align="center"></el-table-column>
        <el-table-column label="镜像" prop="mirror" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="地址" prop="ip" align="center"></el-table-column>
        <el-table-column label="端口" prop="port" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="所有者" prop="owner" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="操作" class-name="op-column wp15" align="center">
          <template slot-scope="scope">
            <a class="btn btn-active" @click="handleActive(scope.$index, scope.row)" title="启动" v-if="scope.row.status!=='running'"></a>
            <a class="btn btn-suspend" @click="handleSuspend(scope.$index, scope.row)" title="停止" v-if="scope.row.status==='running'"></a>
            <a :class="['btn', 'btn-restart', scope.row.status!=='running'&&'disabled']" @click="scope.row.status==='running'&&handleRestart(scope.$index, scope.row)" title="重启"></a>
            <a class="btn btn-view" @click="interview(scope.$index, scope.row)" title="查看"></a>
            <a class="btn btn-delete" @click="handleDelete(scope.$index, scope.row)" title="删除"></a>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :current-page.sync="searcher.currentPage" :page-size="paginatorData.pageSize"
        layout="prev, pager, next,total" :total="paginatorData.totalPage" class="m-paginator" v-if="paginatorData.totalPage>0">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
export default {
  data () {
    return {
      seriesStatus: [
        {label: 'created', value: 'created'},
        {label: 'running', value: 'running'},
        {label: 'exited', value: 'exited'},
        {label: '全部状态', value: ''}
      ],
      searcher: {
        searchingStatus: '',
        searchingInput: '',
        currentPage: undefined
      },
      tableData: [],
      paginatorData: {
        totalPage: 0,
        pageSize: this.constants.PAGE_SETTING.pageSize
      },
      changeAppStatus: false
    }
  },
  watch: {
    searcher: {
      handler (v) {
        this.getlistData(v.currentPage, this.paginatorData.pageSize, v.searchingInput, v.searchingStatus)
      },
      deep: true
    }
  },
  methods: {
    handleActive (i, r) {
      let qr1 = r.hostId
      let qr2 = r.containerId
      this.changeAppStatus = true
      httpRequest.postRequest(`${this.constants.BaseUrl}/container/containers/startContainer?hostId=${qr1}&containerId=${qr2}`, null, (res) => {
        this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
        this.$message.success('启动成功!')
        this.changeAppStatus = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.changeAppStatus = false
      })
    },
    handleSuspend (i, r) {
      let qr1 = r.hostId
      let qr2 = r.containerId
      this.changeAppStatus = true
      httpRequest.postRequest(`${this.constants.BaseUrl}/container/containers/stopContainer?hostId=${qr1}&containerId=${qr2}`, null, (res) => {
        this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
        this.$message.success('停止成功!')
        this.changeAppStatus = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.changeAppStatus = false
      })
    },
    handleRestart (i, r) {
      let qr1 = r.hostId
      let qr2 = r.containerId
      this.changeAppStatus = true
      httpRequest.postRequest(`${this.constants.BaseUrl}/container/containers/restartContainer?hostId=${qr1}&containerId=${qr2}`, null, (res) => {
        this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
        this.$message.success('重启成功!')
        this.changeAppStatus = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.changeAppStatus = false
      })
    },
    appendApp () {
      this.$router.push({name: 'service_new'})
    },
    interview (index, row) {
      this.$router.push({name: 'service_interview',
        query: {
          paraPort: row.paraPort,
          paraIp: row.paraIp,
          hostId: row.hostId,
          hostName: row.host,
          hostIP: row.hostIp,
          contId: row.containerId
        }})
    },
    handleDelete (index, row, column) {
      if (row.status === 'running') {
        this.$message({
          message: '无法删除正在运行的应用!',
          type: 'warning'
        })
        return
      }
      if (row.proxy !== '-') {
        this.$message({
          message: '所属代理非空，无法删除!',
          type: 'warning'
        })
        return
      }
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest.postRequest(`${this.constants.BaseUrl}/container/containers/deleteContainer?hostId=${row.hostId}&containerId=${row.containerId}`, null, (res) => {
          this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
          this.$message({
            type: 'success',
            message: ' 删除成功！'
          })
        })
      }).catch(() => {})
    },
    getlistData (pageNum, pageSize, txt = '', st = '') {
      let vue = this
      httpRequest.getRequest(`${this.constants.BaseUrl}/container/containers/list/${pageNum}/${pageSize}?textFilter=${txt}&state=${st}`, null, (res) => {
        vue.tableData = []
        let list = res.data.list
        if (!list) return
        vue.paginatorData.totalPage = res.data.totalRecord
        list.forEach((item, index) => {
          // let status = item.state === 'running' ? '运行中' : '暂停'
          vue.tableData.push({
            sort: ++index + vue.paginatorData.pageSize * (vue.searcher.currentPage - 1),
            proxy: item.serviceName ? item.serviceName : '-',
            name: item.containerName ? item.containerName : '-',
            mirror: item.imageName,
            ip: item.containerIp ? item.containerIp : '-',
            port: item.portMap.length ? item.portMap.join(',') : '-',
            host: item.hostname,
            hostIp: item.hostip,
            status: item.state,
            owner: item.author ? item.author : '-',

            paraPort: item.port,
            paraIp: item.ip,
            hostId: item.hostId,
            containerId: item.containerId
          })
        })
      })
    }
  },
  created () {

  },
  mounted () {
    new Promise((resolve) => {
      resolve(this.paginatorData.pageSize = Math.floor((this.$refs['tableWrapper'].clientHeight - 20 - 70 - 30) / 35))
    }).then(() => {
      this.searcher.currentPage = this.constants.PAGE_SETTING.pageNum
    })
  }
}
</script>

<style lang="less">
.m-wrap-table.service {
  tr {
    th,
    td {
      width: (100%-30%)/7;
    }
  }
}
</style>
