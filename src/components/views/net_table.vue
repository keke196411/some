<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em>网络管理</em></span>
      <a class="btn btn-addnew" @click="addTerm">+</a>
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
      <el-select v-model="searcher.searchingStatus" placeholder="类型" style="width:120px;">
        <el-option v-for="(item,index) in seriesStatus" :key="index" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
    </div>
    <div class="m-wrap-table network" ref="tableWrapper">
      <el-table :data="tableData" style="width: 100%" class="m-table" ref="table">
        <el-table-column label="名称" prop="name" align="center" class-name="pl10" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属应用" prop="belonging" align="center"></el-table-column>
        <el-table-column label="主机名称" prop="hostName" align="center"></el-table-column>
        <el-table-column label="范围" prop="scope" align="center"></el-table-column>
        <el-table-column label="类型" prop="category" align="center"></el-table-column>
        <el-table-column label="驱动" prop="driver" align="center"></el-table-column>
        <el-table-column label="子网掩码" prop="mask" align="center"></el-table-column>
        <el-table-column label="网关" prop="gateway" align="center"></el-table-column>
        <el-table-column label="所有者" prop="owner" align="center"></el-table-column>
        <el-table-column label="操作" class-name="op-column" align="center">
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
      seriesStatus: [],
      searcher: {
        searchingApp: '',
        searchingStatus: '',
        searchingInput: '',
        currentPage: undefined
      },
      tableData: [],
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
    addTerm () {
      this.$router.push({name: 'net_new'})
    },
    interview (index, row) {
      this.$router.push({name: 'net_interview', query: {hostId: row.hostId, net: row.networkId}})
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
    getlistData (pageNum, pageSize, txt = '', dr = '', app = '') {
      httpRequest.getRequest(`${this.constants.BaseUrl}/network/networks/list/${pageNum}/${pageSize}?textFilter=${txt}&driver=${dr}&app=${app}`, null, (res) => {
        this.tableData = []
        let list = res.data.list
        if (!list) return
        this.paginatorData.totalPage = res.data.totalRecord
        list.forEach((item, index) => {
          this.tableData.push({
            hostId: item.hostid,
            hostName: item.host,
            networkId: item.networkid,
            name: item.name,
            belonging: item.stack || '-',
            scope: item.scope || '-',
            category: item.driver,
            driver: item.ipamdriver || '-',
            mask: item.subnet || '-',
            gateway: item.gateway || '-',
            owner: item.ownerShip || '-'
          })
        })
      })
    }
  },
  created () {
    // 类型
    httpRequest.getRequest(`${this.constants.BaseUrl}/network/networks/drivers`, null, res => {
      let arr = []
      res.data.forEach(item => {
        arr.push({
          label: item,
          value: item
        })
      })
      arr.push({
        label: '全部类型',
        value: ''
      })
      this.seriesStatus = arr
    })
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
.m-wrap-table.network {
  tr {
    th,
    td {
      width: (100%)/10;
    }
  }
}
</style>
