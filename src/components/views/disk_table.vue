<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em>磁盘管理</em></span>
      <a class="btn btn-addnew" @click="addDisk">+</a>
      <div class="u-top-search">
        <input type="text" placeholder="请输入关键字" v-model="searcher.searchingInput">
        <a class="btn btn-search" @click="getlistData(searcher.currentPage,paginatorData.pageSize,searcher.searchingInput,searcher.searchingStatus,searcher.searchingApp)">
          <i class="icon icon-magnify"></i>
        </a>
      </div>
      <el-select v-model="searcher.searchingApp" placeholder="所属应用" style="width:120px;" filterable>
        <el-option v-for="(item,index) in seriesApp" :key="index" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
      <el-select v-model="searcher.searchingStatus" placeholder="状态" style="width:120px;">
        <el-option v-for="(item,index) in seriesStatus" :key="index" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
    </div>
    <div class="m-wrap-table disk" ref="tableWrapper">
      <el-table :data="tableData" style="width: 100%" class="m-table" ref="table">
        <el-table-column label="名称" prop="name" align="center" class-name="wp20 pl10" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="status" align="center"></el-table-column>
        <el-table-column label="所属应用" prop="stack" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="主机名称" prop="hostName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" prop="category" align="center"></el-table-column>
        <el-table-column label="挂载点" prop="mounted" align="center" class-name="wp20" show-overflow-tooltip></el-table-column>
        <el-table-column label="驱动选项" prop="drivers" align="center" class-name="wp10" show-overflow-tooltip></el-table-column>
        <el-table-column label="所有者" prop="owner" align="center"></el-table-column>
        <el-table-column label="操作" class-name="op-column wp10" align="center">
          <template slot-scope="scope">
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
      seriesApp: [],
      seriesStatus: [{
        label: 'used',
        value: true
      }, {
        label: 'unused',
        value: false
      }, {
        label: '全部状态',
        value: ''
      }],
      searcher: {
        searchingApp: '',
        searchingStatus: '',
        searchingInput: '',
        currentPage: undefined
      },
      tableData: [],
      tableDataCopy: [],
      paginatorData: {
        totalPage: 0,
        pageSize: this.constants.PAGE_SETTING.pageSize
      }
    }
  },
  watch: {
    searcher: {
      handler (v) {
        this.getlistData(v.currentPage, this.paginatorData.pageSize, v.searchingInput, v.searchingStatus, v.searchingApp)
      },
      deep: true
    }
  },
  methods: {
    addDisk () {
      this.$router.push({name: 'disk_new'})
    },
    interview (index, row) {
      this.$router.push({name: 'disk_interview', query: {hostId: row.belonging, name: row.name}})
    },
    handleDelete (index, row, column) {
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest.postRequest(`${this.constants.BaseUrl}/volume/volumes/delete?hostid=${row.belonging}&volumeName=${row.name}`, null, (res) => {
          this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
          this.$message({
            type: 'success',
            message: ' 删除成功！'
          })
        })
      }).catch(() => {})
    },
    getlistData (pageNum, pageSize, txt = '', st = '', app = '') {
      httpRequest.getRequest(`${this.constants.BaseUrl}/volume/volumes/list/${pageNum}/${pageSize}?textFilter=${txt}&status=${st}&app=${app}`, null, (res) => {
        this.tableData = []
        let list = res.data.list
        if (!list) return
        this.paginatorData.totalPage = res.data.totalRecord
        list.forEach((item, index) => {
          let status = item.used ? 'used' : 'unused'
          this.tableData.push({
            name: item.name,
            status,
            belonging: item.hostid,
            hostName: item.host,
            stack: item.stack || '-',
            category: item.driver,
            mounted: item.mountPoint,
            drivers: (() => {
              return item.opts ? item.opts : '-'
            })(),
            owner: item.ownerShip || '-'
          })
        })
      })
    }
  },
  created () {
    // 所属应用
    httpRequest.getRequest(`${this.constants.BaseUrl}/app/apps/list/apps`, null, res => {
      let arr = []
      res.data.forEach(item => {
        arr.push({
          label: item,
          value: item
        })
      })
      arr.push({label: '全部应用', value: ''})
      this.seriesApp = arr
    })
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
.m-wrap-table.disk {
  tr {
    th,
    td {
      width: (100%-60%)/5;
    }
  }
}
</style>
