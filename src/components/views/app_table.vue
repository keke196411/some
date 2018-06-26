<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em>应用管理</em></span>
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
    <div class="m-wrap-table app" ref="tableWrapper" v-loading.fullscreen.lock="changeAppStatus">
      <el-table :data="tableData" style="width: 100%" class="m-table" ref="table">
        <el-table-column label="序号" prop="sort" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="名称" prop="appAlias" align="center"></el-table-column>
        <el-table-column label="英文名称" prop="name" align="center"></el-table-column>
        <el-table-column label="作业" prop="id" align="center" class-name="wp15" show-overflow-tooltip></el-table-column>
        <el-table-column label="版本号" prop="version" align="center"></el-table-column>
        <el-table-column label="作者" prop="author" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center"></el-table-column>
        <el-table-column label="发布时间" prop="issued" align="center" class-name="wp15"></el-table-column>
        <el-table-column label="操作" class-name="op-column wp15" align="center">
          <template slot-scope="scope">
            <a class="btn btn-active" @click="handleActive(scope.$index, scope.row)" title="运行" v-show="scope.row.status!=='运行中'"></a>
            <a class="btn btn-suspend" @click="handleSuspend(scope.$index, scope.row)" title="暂停" v-show="scope.row.status==='运行中'"></a>
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
import utils from '@/vender/js/utils'
export default {
  data () {
    return {
      seriesStatus: [{
        label: '运行中',
        value: '01'
      }, {
        label: '暂停',
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
      let id = r.id
      this.changeAppStatus = true
      httpRequest.postRequest(`${this.constants.BaseUrl}/app/apps/start?appid=${encodeURIComponent(id)}`, null, (res) => {
        if (res.data.status !== 0) this.$message.error('启动失败!')
        else this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
        this.changeAppStatus = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.changeAppStatus = false
      })
    },
    handleSuspend (i, r) {
      let id = r.id
      this.changeAppStatus = true
      httpRequest.postRequest(`${this.constants.BaseUrl}/app/apps/stop?appid=${encodeURIComponent(id)}`, null, (res) => {
        if (res.data.status !== 0) this.$message.error('暂停失败!')
        else this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
        this.changeAppStatus = false
      }, (error) => {
        this.$message.error(error.response ? error.response.data.message : error.message)
        this.changeAppStatus = false
      })
    },
    appendApp () {
      this.$router.push({
        name: 'app_operate',
        query: {mode: 1}
      })
    },
    detactDelete (e) {
      Reflect.apply(this.searchByInput, null, [])
    },
    interview (index, row) {
      this.$router.push({name: 'app_interview', query: {appId: row.id, appAlias: row.appAlias, appName: row.name}})
    },
    handleDelete (index, row, column) {
      if (row.status === '运行中') {
        this.$message({
          message: '无法删除正在运行的应用!',
          type: 'warning'
        })
        return
      }
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let appId = encodeURIComponent(row.id)
        httpRequest.postRequest(`${this.constants.BaseUrl}/app/apps/delete?appid=${appId}`, null, (res) => {
          this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
          this.$message({
            type: 'success',
            message: ' 删除成功！'
          })
        })
      }).catch(() => {})
    },
    getlistData (pageNum, pageSize, txt = '', st = '') {
      httpRequest.getRequest(`${this.constants.BaseUrl}/app/apps/list/${pageNum}/${pageSize}?textFilter=${txt}&status=${st}`, null, (res) => {
        this.tableData = []
        let list = res.data.list
        if (!list) return
        this.paginatorData.totalPage = res.data.totalRecord
        list.forEach((item, index) => {
          let status = item.status === '01' ? '运行中' : '暂停'
          this.tableData.push({
            sort: ++index + this.paginatorData.pageSize * (this.searcher.currentPage - 1),
            name: item.appname ? item.appname : '-',
            appAlias: item.appalias,
            id: item.appid,
            version: item.appversion,
            author: item.appauthor,
            status,
            issued: utils.formatDateFromLong(item.apptime, 'yyyy-MM-dd hh:mm:ss')
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
  .m-wrap-table.app {
    tr {
      th,
      td {
        width: (100%-50%)/5;
      }
    }
  }

</style>
