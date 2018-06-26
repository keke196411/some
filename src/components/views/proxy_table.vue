<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em>服务代理</em></span>
      <a class="btn btn-addnew" @click="newTerm">+</a>
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

    <div class="m-wrap-table proxy" ref="tableWrapper" v-loading.fullscreen.lock="changeAppStatus">
      <el-table :data="tableData" style="width: 100%" class="m-table" ref="table">
        <el-table-column label="序号" prop="sort" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="名称" prop="name" align="center"></el-table-column>
        <el-table-column label="所属应用" prop="belonging" align="center"></el-table-column>
        <el-table-column label="镜像" prop="mirror" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="副本" prop="duplicate" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="端口" prop="port" align="center" class-name="wp10"></el-table-column>
        <el-table-column label="类型" prop="cate" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="状态" prop="status" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="更新时间" prop="updated" align="center" class-name="wp15"></el-table-column>
        <el-table-column label="操作" class-name="op-column wp15" align="center">
          <template slot-scope="scope">
            <a class="btn btn-active" @click="handleActive(scope.$index, scope.row)" title="运行" v-show="scope.row.status!=='运行中'"></a>
            <a class="btn btn-suspend" @click="handleSuspend(scope.$index, scope.row)" title="停止" v-show="scope.row.status==='运行中'"></a>
            <a :class="['btn', 'btn-view', scope.row.status!=='运行中'&&'disabled']" @click="scope.row.status==='运行中'&&interview(scope.$index, scope.row)" title="查看"></a>
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
import utils from '@/vender/js/utils'
export default {
  data () {
    return {
      tableData: [],
      seriesStatus: [{
        label: '运行中',
        value: '01'
      }, {
        label: '停止',
        value: '02'
      }, {
        label: '全部状态',
        value: ''
      }],
      searcher: {
        searchingStatus: '',
        searchingInput: '',
        currentPage: undefined
      },
      paginatorData: {
        totalPage: 1,
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
    newTerm () {
      this.$router.push({name: 'proxy_new'})
    },
    interview (i, r) {
      this.$router.push({name: 'proxy_interview', query: {serviceId: r.id}})
    },
    handleActive (i, r) {
      this.changeAppStatus = true
      httpRequest.postRequest(`${this.constants.BaseUrl}/service/services/start?serviceName=${encodeURIComponent(r.name)}`, null, (res) => {
        this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
        this.$message.success('启动成功!')
        this.changeAppStatus = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.changeAppStatus = false
      })
    },
    handleSuspend (i, r) {
      this.changeAppStatus = true
      httpRequest.postRequest(`${this.constants.BaseUrl}/service/services/stop?serviceId=${encodeURIComponent(r.name)}`, null, (res) => {
        console.log(this.searcher.currentPage, this.paginatorData.pageSize)
        this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
        this.$message.success('停止成功!')
        this.changeAppStatus = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.changeAppStatus = false
      })
    },
    handleDelete (i, r) {
      if (r.belonging !== '-') {
        this.$message.warning('所属应用非空，无法删除!')
        return
      }
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let name = encodeURIComponent(r.name)
        httpRequest.postRequest(`${this.constants.BaseUrl}/service/services/delete?serviceName=${name}`, null, (res) => {
          this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
          this.$message({
            type: 'success',
            message: ' 删除成功！'
          })
        })
      }).catch(() => {})
    },
    getlistData (pageNum, pageSize, txt = '', st = '') {
      httpRequest.getRequest(`${this.constants.BaseUrl}/service/services/list/${pageNum}/${pageSize}?textFilter=${txt}&status=${st}`, null, (res) => {
        this.tableData = []
        let list = res.data.list
        if (!list) return
        this.paginatorData.totalPage = res.data.totalRecord
        try {
          list.forEach((item, index) => {
            let status = item.status === '01' ? '运行中' : '停止'
            this.tableData.push({
              sort: ++index + this.paginatorData.pageSize * (this.searcher.currentPage - 1),
              version: item.version,
              id: item.serviceId,
              name: item.name ? item.name : '-',
              belonging: item.appname ? item.appname : '-',
              mirror: item.image,
              duplicate: item.replica ? item.replica : '-',
              port: item.ports[0] ? item.ports[0] : '-',
              cate: item.type ? item.type : '-',
              status,
              issued: utils.formatDateFromLong(item.createTime, 'yyyy-MM-dd hh:mm:ss'),
              updated: utils.formatDateFromLong(item.updateTime, 'yyyy-MM-dd hh:mm:ss')
            })
          })
        } catch (e) {
          console.log(e)
        }
      })
    }
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
.m-wrap-table.proxy {
  tr {
    th,
    td {
      width: (100%-60%)/3;
    }
  }
}
</style>
