<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em>日志管理</em></span>
      <div class="u-top-search">
        <input type="text" v-model="searcher.content" placeholder="日志内容">
        <a class="btn btn-search" @click="searchList({
          num: searcher.currentPage,
          size: paginatorData.pageSize,
          left: searcher.beginning,
          right: searcher.ending,
          type: searcher.type,
          cont: searcher.content,
          user: searcher.user
        })">
          <i class="icon icon-magnify"></i>
        </a>
      </div>
      <el-input type="text" v-model="searcher.user" placeholder="用户名" style="width:120px;"></el-input>
      <el-select placeholder="操作类型" style="width:100px;" v-model="searcher.type">
        <el-option v-for="(item,index) in seriesType" :key="index" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
      <el-date-picker v-model="searcher.ending" type="datetime" placeholder="不晚于" value-format="timestamp" style="width:180px;" :picker-options="tRight"></el-date-picker>
      <el-date-picker v-model="searcher.beginning" type="datetime" placeholder="不早于" value-format="timestamp" style="width:180px;" :picker-options="tLeft"></el-date-picker>
    </div>
    <div class="m-wrap-table log" ref="tableWrapper" v-loading.fullscreen.lock="changeAppStatus">
      <el-table :data="tableData" style="width: 100%" class="m-table" ref="table">
        <el-table-column label="序号" prop="sort" align="center" class-name="wp5"></el-table-column>
        <el-table-column label="登录名" prop="userName" align="center"></el-table-column>
        <el-table-column label="模块名称" prop="sysName" align="center"></el-table-column>
        <el-table-column label="用户IP" prop="userIP" align="center"></el-table-column>
        <el-table-column label="操作类型" prop="type" align="center">
          <template slot-scope="area">
            <span :class="['typper', 'typper-'+typeCluster[area.row.type]]">{{area.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作内容" prop="dowhat" align="center" class-name="wp20" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作时间" prop="time" align="center" class-name="wp20"></el-table-column>
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
    let vue = this
    return {
      seriesType: [{
        label: '查看',
        value: '查看'
      }, {
        label: '修改',
        value: '修改'
      }, {
        label: '新增',
        value: '新增'
      }, {
        label: '删除',
        value: '删除'
      }, {
        label: '全部类型',
        value: ''
      }],
      tableData: [],
      searcher: {
        beginning: '',
        ending: '',
        type: '',
        user: '',
        content: '',
        currentPage: undefined
      },
      paginatorData: {
        totalPage: 0,
        pageSize: this.constants.PAGE_SETTING.pageSize
      },
      changeAppStatus: false,
      tRight: {
        disabledDate (t) {
          if (vue.searcher.beginning) return t < new Date(vue.searcher.beginning) || t > Date.now()
          else return t > Date.now()
        }
      },
      tLeft: {
        disabledDate (t) {
          if (vue.searcher.ending) return t > new Date(vue.searcher.ending) || t > Date.now()
          else return t > Date.now()
        }
      }
    }
  },
  watch: {
    searcher: {
      handler (v) {
        let vue = this
        this.searchList({
          num: v.currentPage,
          size: vue.paginatorData.pageSize,
          left: v.beginning,
          right: v.ending,
          type: v.type,
          cont: v.content,
          user: v.user
        })
      },
      deep: true
    }
  },
  methods: {
    searchList (opt) {
      opt = {...{num: 0, size: 0, left: '', right: '', type: '', cont: '', user: ''}, ...opt}
      httpRequest.getRequest(`${this.constants.BaseUrl}/log/searchLogInfo/${opt.num}/${opt.size}?beginDate=${opt.left}&endDate=${opt.right}&logType=${opt.type}&logContent=${opt.cont}&sysuserName=${opt.user}`, null, res => {
        this.tableData = []
        let list = res.data.list
        let totalPage = res.data.totalRecord
        if (!list) return
        this.paginatorData.totalPage = totalPage
        list.forEach((item, index) => {
          this.tableData.push({
            sort: ++index + this.paginatorData.pageSize * (this.searcher.currentPage - 1),
            userName: item.username,
            sysName: item.sysusername || '-',
            userIP: item.userip,
            type: item.logtype,
            dowhat: item.logcontent,
            time: utils.formatDateFromLong(item.logdate, 'yyyy-MM-dd hh:mm:ss')
          })
        })
      })
    }
  },
  created () {

  },
  computed: {
    typeCluster () {
      return {
        '查看': 'blue',
        '修改': 'green',
        '新增': 'orange',
        '删除': 'red'
      }
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
.m-wrap-table.log {
  tr {
    th,
    td {
      width: (100%-45%)/4;
    }
  }
}
</style>
