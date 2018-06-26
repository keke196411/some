<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span>
        <em @click="$router.push({name: 'app'})">应用管理</em> >
        <em>查看</em>
      </span>
      <a class="btn-edite" @click="handleEdit">编辑</a>
    </div>
    <div class="view-bar">
      <div class="u-header">基本信息</div>
      <div class="content infor">
        <div class="left">
          <i class="icon icon-petal"></i>
          <p>{{baseInfo.appAlias}}</p>
        </div>
        <div class="right">
          <div>
            <em>作者 :</em>
            <span>{{baseInfo.author}}</span>
          </div>
          <div>
            <em>版本号 :</em>
            <span>{{baseInfo.version}}</span>
          </div>
          <div>
            <em>英文名 :</em>
            <span>{{baseInfo.name}}</span>
          </div>
          <div>
            <em>发布时间 :</em>
            <span>{{baseInfo.issued}}</span>
          </div>
          <div class="wp66">
            <em>描述 :</em>
            <span>{{baseInfo.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="view-bar">
      <div class="u-header">具体内容</div>
      <div class="content details">
        <div class="u-coder">
          <p class="u-notify-sm">Web编辑器</p>
          <div>
            <ul>
              <li v-for="(v, i) in codeSort" :key="i">{{++i}}</li>
            </ul>
            <code class="decode">{{codeOri}}</code>
          </div>
        </div>
      </div>
      <div class="u-header" v-if="false">环境变量</div>
      <div class="content env" v-if="false">
        <ul class="ul-table-style">
          <li>
            <em>名称 :</em>
            <span>sonefawe</span>
            <em>变量 :</em>
            <span>fasdgasga</span>
          </li>
          <li>
            <em>名称 :</em>
            <span>sonefawe</span>
            <em>变量 :</em>
            <span>fasdgasga</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="view-bar">
      <div class="u-header">服务代理</div>
      <div class="content" style="padding-bottom:0;">
        <div class="m-wrap-table app-proxy" style="padding-top:0;">
          <el-table :data="proxyData" style="width: 100%" class="m-table cursor" stripe @row-click="handleProxyRow">
            <el-table-column label="序号" prop="sort" align="center" class-name="wp5"></el-table-column>
            <el-table-column label="名称" prop="name" align="center" class-name="wp15"></el-table-column>
            <el-table-column label="所属应用" prop="belong" align="center"></el-table-column>
            <el-table-column label="镜像" prop="label" align="center" class-name="wp25">
              <template slot-scope="scope">
                <div :title="scope.row.label" class="ellipsis">{{scope.row.label}}</div>
              </template>
            </el-table-column>
            <el-table-column label="副本" prop="copy" align="center"></el-table-column>
            <el-table-column label="端口" prop="port" align="center"></el-table-column>
            <el-table-column label="更新时间" prop="date" align="center" class-name="wp15"></el-table-column>
          </el-table>

          <el-pagination :current-page.sync="currentPage_1" :page-size="3" layout="prev, pager, next,total" :total="totalPage_1" class="m-paginator"
            v-if="totalPage_1>0">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="view-bar">
      <div class="u-header">服务列表</div>
      <div class="content" style="padding-bottom:0;">
        <div class="m-wrap-table app-service" style="padding-top:0;">
          <el-table :data="serviceData" style="width: 100%" class="m-table cursor" stripe @row-click="handleServiceRow">
            <el-table-column label="序号" prop="sort" align="center" class-name="wp5"></el-table-column>
            <el-table-column label="名称" prop="name" align="center">
              <template slot-scope="scope">
                <div :title="scope.row.name" class="ellipsis">{{scope.row.name}}</div>
              </template>
            </el-table-column>
            <el-table-column label="所属代理" prop="belong" align="center"></el-table-column>
            <el-table-column label="镜像" prop="label" align="center"></el-table-column>
            <el-table-column label="地址" prop="ip" align="center" class-name="wp10"></el-table-column>
            <el-table-column label="端口" prop="port" align="center" class-name="wp10"></el-table-column>
            <el-table-column label="状态" prop="status" align="center" class-name="wp10"></el-table-column>
            <el-table-column label="所有者" prop="owner" align="center" class-name="wp10"></el-table-column>
          </el-table>

          <el-pagination :current-page.sync="currentPage_2" :page-size="3" layout="prev, pager, next,total" :total="totalPage_2" class="m-paginator"
            v-if="totalPage_2>0">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
import utils from '@/vender/js/utils'

export default {
  data () {
    return {
      codeOri: '',
      baseInfo: {},
      oriProxy: [],
      oriService: [],
      currentPage_1: this.constants.PAGE_SETTING.pageNum,
      currentPage_2: this.constants.PAGE_SETTING.pageNum
    }
  },
  methods: {
    handleEdit () {
      this.$router.push({
        name: 'app_operate',
        query: {mode: 0}
      })
      this.$store.commit('appDeleiver', this.baseInfo)
    },
    handleProxyRow (r, e) {
      this.$router.push({name: 'proxy_interview', query: {serviceId: r.id}})
    },
    handleServiceRow (r) {
      this.$router.push({
        name: 'service_interview',
        query: {
          paraPort: r.paraPort,
          paraIp: r.paraIp,
          hostId: r.hostId,
          contId: r.containerId
        }
      })
    }
  },
  created () {
    let appId = this.$route.query.appId
    let appAlias = this.$route.query.appAlias
    let appName = this.$route.query.appName
    let vue = this
    // 基本信息
    httpRequest.getRequest(`${this.constants.BaseUrl}/app/apps/inspect/baseInfo?appId=${encodeURIComponent(appId)}`, null, (res) => {
      let data = res.data
      vue.codeOri = data.fileContent
      vue.baseInfo = {
        name: appName,
        appAlias,
        id: appId,
        author: data.appauthor,
        issued: utils.formatDateFromLong(data.apptime, 'yyyy-MM-dd hh:mm:ss'),
        version: data.appversion,
        desc: data.desc,
        file: data.fileContent
      }
    })
    // 服务代理
    httpRequest.getRequest(`${this.constants.BaseUrl}/app/apps/list/services?appId=${encodeURIComponent(appId)}`, null, (res) => {
      res.data && res.data.forEach((item, index) => {
        vue.oriProxy.push({
          sort: ++index,
          name: item.Spec.Name,
          belong: appName,
          label: item.Spec.TaskTemplate.ContainerSpec.Image,
          copy: item.Spec.Mode.Replicated ? item.Spec.Mode.Replicated.Replicas : '-',
          port: item.Endpoint.Ports ? item.Endpoint.Ports[0].PublishedPort + ':' + item.Endpoint.Ports[0].TargetPort : '-',
          date: utils.formatDateFromLong(item.UpdatedAt, 'yy-MM-dd hh:mm:ss'),
          id: item.ID
        })
      })
    })
    // 服务列表
    httpRequest.getRequest(`${this.constants.BaseUrl}/app/apps/list/containers?appId=${encodeURIComponent(appId)}`, null, (res) => {
      res.data && res.data.forEach((item, index) => {
        vue.oriService.push({
          sort: ++index,
          name: item.container,
          belong: item.servicename,
          label: item.imagename,
          ip: item.ipAddress || '-',
          port: item.ports.length ? item.ports[0] + item.ports[1] : '-',
          status: item.state === 'running' ? '运行中' : '暂停',
          owner: item.auth || '-',

          paraPort: item.hostPort,
          paraIp: item.hostIp,
          hostId: item.hostId,
          containerId: item.containerId
        })
      })
    })
  },
  computed: {
    codeSort () {
      return this.codeOri.split(/\n/)
    },
    proxyData () {
      return this.oriProxy.slice((this.currentPage_1 - 1) * 3, (this.currentPage_1 - 1) * 3 + 3)
    },
    serviceData () {
      return this.oriService.slice((this.currentPage_2 - 1) * 3, (this.currentPage_2 - 1) * 3 + 3)
    },
    totalPage_1 () {
      return this.oriProxy.length
    },
    totalPage_2 () {
      return this.oriService.length
    }
  }
}

</script>

<style lang="less">
  .m-wrap-table {
    &.app-proxy {
      tr {
        th,
        td {
          width: (100%-60%)/3;
        }
      }
      .m-paginator {
        padding-bottom: 16px;
        text-align: right;
      }
    }
    &.app-service {
      tr {
        th,
        td {
          width: (100%-45%)/3;
        }
      }
      .m-paginator {
        padding-bottom: 16px;
        text-align: right;
      }
    }
  }

</style>
