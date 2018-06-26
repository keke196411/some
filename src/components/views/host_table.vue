<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em>主机管理</em></span>
      <a class="btn btn-addnew" @click="$router.push({name: 'host_new'})">+</a>
      <div class="u-top-search">
        <input type="text" placeholder="请输入关键字" v-model="searcher.searchingInput">
        <a class="btn btn-search" @click="getlistData(searcher.currentPage,paginatorData.pageSize,searcher.searchingInput,searcher.searchingRole)">
          <i class="icon icon-magnify"></i>
        </a>
      </div>
      <el-select v-model="searcher.searchingRole" placeholder="角色" style="width:120px;">
        <el-option v-for="(item,index) in seriesRole" :key="index" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
    </div>
    <div class="m-wrap-table host" ref="tableWrapper" v-loading.fullscreen.lock="changeAppStatus">
      <el-table :data="tableData" class="m-table wp100" ref="table">
        <el-table-column label="序号" prop="sort" align="center"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="角色" prop="role" align="center"></el-table-column>
        <el-table-column label="cpu" prop="cpu" align="center"></el-table-column>
        <el-table-column label="内存" prop="ram" align="center"></el-table-column>
        <el-table-column label="硬盘" prop="dist" align="center"></el-table-column>
        <el-table-column label="IP" prop="ip" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center"></el-table-column>
        <el-table-column label="操作" class-name="op-column wp15" align="center">
          <template slot-scope="scope">
            <a class="btn btn-view" @click="handleInterview(scope.$index, scope.row)"></a>
            <a class="btn btn-delete" @click="handleDelete(scope.$index, scope.row,scope.column)"></a>
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
      seriesRole: [
        {label: '管理者', value: 'manager'},
        {label: '工作节点', value: 'worker'},
        {label: '全部角色', value: ''}
      ],
      searcher: {
        searchingRole: '',
        searchingInput: '',
        currentPage: -1
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
        this.getlistData(v.currentPage, this.paginatorData.pageSize, v.searchingInput, v.searchingRole)
      },
      deep: true
    }
  },
  methods: {
    // filterKeywords (v) {
    //   let toFilte = this.tableDataCopy
    //   let statusKey = v.searchingRole === '全部角色' ? '.*' : v.searchingRole
    //   toFilte = toFilte.filter((item) => {
    //     return item.role.match(new RegExp(`^${statusKey}$`))
    //   })
    //   let nameKey = v.searchingName === '全部名称' ? '.*' : v.searchingName
    //   toFilte = toFilte.filter((item) => {
    //     return item.name.match(new RegExp(`^${nameKey}$`))
    //   })
    //   let inputKey = v.searchingInput ? v.searchingInput : '.*'
    //   toFilte = toFilte.filter((item) => {
    //     let res
    //     for (let i of Object.keys(item)) {
    //       if (String(item[i]).match(new RegExp(inputKey))) {
    //         res = true
    //         break
    //       }
    //     }
    //     return res
    //   })
    //   return toFilte
    // },
    handleInterview (i, r) {
      this.$router.push({
        name: 'host_interview',
        query: {hostId: r.hostId, status: r.status}
      })
    },
    handleDelete (i, r) {
      this.$confirm('删除该主机将影响该主机上的所有服务、镜像及应用, 确认删除吗?', '警告', {
        confirmButtonText: '确定删除',
        cancelButtonText: '再考虑一下',
        type: 'warning'
      }).then(() => {
        httpRequest.postRequest(`${this.constants.BaseUrl}/host/deleteHost?hostid=${encodeURIComponent(r.hostId)}`, null, (res) => {
          this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
          this.$message({
            type: 'success',
            message: ' 删除成功！'
          })
        })
      }).catch(() => {})
    },
    getlistData (pageNum, pageSize, txt = '', role = '') {
      let vue = this
      httpRequest.getRequest(`${this.constants.BaseUrl}/host/info/${pageNum}/${pageSize}?textFilter=${txt}&role=${role}`, null, (res) => {
        vue.tableData = []
        let list = res.data.list
        if (!list) return
        vue.paginatorData.totalPage = res.data.totalRecord
        list.forEach((item, index) => {
          vue.tableData.push({
            sort: ++index + vue.paginatorData.pageSize * (vue.searcher.currentPage - 1),
            name: item.hostName,
            role: item.role === 'manager' ? '管理者' : '工作节点',
            cpu: item.cpu,
            ram: (() => {
              let v = item.memory * 1
              if (v >= 1024) return (v / 1024).toFixed(2) + ' TB'
              else return v + ' GB'
            })(),
            dist: (() => {
              let v = item.disk * 1
              if (v >= 1024) return (v / 1024).toFixed(2) + ' TB'
              else return v + ' GB'
            })(),
            ip: item.ip,
            status: item.status === 'ready' ? '可用' : '不可用',

            hostId: item.hostid
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
      this.$route.query.searchwords && (this.searcher.searchingRole = this.$route.query.searchwords.role)
      this.searcher.currentPage = this.constants.PAGE_SETTING.pageNum
    })
  }
}

</script>
<style lang="less">
.m-wrap-table.host{
  tr{
    th,td{
      width:(100%-15%)/8;
    }
  }
}
</style>
