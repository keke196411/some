import Vue from 'vue'
import VueRouter from 'vue-router'
import mirrorTable from '@/components/views/mirror_table'
import mirrorInterview from '@/components/views/mirror_interview'
import mirrorUpload from '@/components/views/mirror_upload'
import mirrorDownload from '@/components/views/mirror_download'
import appTable from '@/components/views/app_table'
import appInterview from '@/components/views/app_interview'
import appOperate from '@/components/views/app_operate'
import proxyTable from '@/components/views/proxy_table'
import proxyInterview from '@/components/views/proxy_interview'
import proxyNew from '@/components/views/proxy_new'
import serviceTable from '@/components/views/service_table'
import serviceNew from '@/components/views/service_new'
import serviceStatus from '@/components/views/service_status'
import serviceInterview from '@/components/views/service_interview'
import hostTable from '@/components/views/host_table'
import hostInterview from '@/components/views/host_interview'
import hostNew from '@/components/views/host_new'
import netNew from '@/components/views/net_new'
import netInterview from '@/components/views/net_interview'
import diskTable from '@/components/views/disk_table'
import diskNew from '@/components/views/disk_new.vue'
import diskInterview from '@/components/views/disk_interview'
import netTable from '@/components/views/net_table'
import log from '@/components/views/log'
import bus from '@/vender/js/bus'

Vue.use(VueRouter)

const Routers = [
  {
    path: '/initial',
    name: 'initial',
    meta: {pageName: '配置主机'},
    component: (resolve) => require(['../components/libs/index.vue'], resolve)
  }, {
    path: '/pages',
    children: [
      {
        path: '/abstract',
        name: 'abstract',
        meta: {pageName: '资源概览'},
        component: (resolve) => require(['../components/views/abstract.vue'], resolve)
      },
      {
        path: '/host',
        meta: {pageName: '主机管理'},
        children: [
          {
            path: '/',
            name: 'host',
            meta: {pageName: '主机管理'},
            component: hostTable
          }, {
            path: 'interview',
            name: 'host_interview',
            meta: {pageName: '主机管理'},
            component: hostInterview
          }, {
            path: 'append',
            name: 'host_new',
            meta: {pageName: '主机管理'},
            component: hostNew
          }
        ],
        component: (resolve) => require(['../components/views/translator.vue'], resolve)
      },
      {
        path: '/mirror',
        meta: {pageName: '镜像管理'},
        children: [
          {
            path: '/',
            name: 'mirror',
            meta: {pageName: '镜像管理'},
            component: mirrorTable
          }, {
            path: 'interview',
            name: 'mirror_interview',
            meta: {pageName: '镜像管理'},
            component: mirrorInterview
          }, {
            path: 'extend',
            name: 'mirror_upload',
            meta: {pageName: '镜像管理'},
            component: mirrorUpload
          }, {
            path: 'download',
            name: 'mirror_download',
            meta: {pageName: '镜像管理'},
            component: mirrorDownload
          }, {
            path: '',
            meta: {pageName: '镜像管理'},
            component: mirrorTable
          }
        ],
        component: (resolve) => require(['../components/views/translator.vue'], resolve)
      },
      {
        path: '/app',
        meta: {pageName: '应用管理'},
        children: [
          {
            path: '/',
            name: 'app',
            meta: {pageName: '应用管理'},
            component: appTable
          }, {
            path: 'interview',
            name: 'app_interview',
            meta: {pageName: '应用管理'},
            component: appInterview
          }, {
            path: 'operate',
            name: 'app_operate',
            meta: {pageName: '应用管理'},
            component: appOperate
          }, {
            path: '',
            meta: {pageName: '应用管理'},
            component: appTable
          }
        ],
        component: (resolve) => require(['../components/views/translator.vue'], resolve)
      },
      {
        path: '/proxy',
        meta: {pageName: '服务代理'},
        children: [
          {
            path: '/',
            name: 'proxy',
            meta: {pageName: '服务代理'},
            component: proxyTable
          }, {
            path: 'interview',
            name: 'proxy_interview',
            meta: {pageName: '服务代理'},
            component: proxyInterview
          }, {
            path: 'append',
            name: 'proxy_new',
            meta: {pageName: '服务代理'},
            component: proxyNew
          }, {
            path: 'log',
            name: 'log',
            meta: {pageName: '日志详情'},
            component: log
          }
        ],
        component: (resolve) => require(['../components/views/translator.vue'], resolve)
      },
      {
        path: '/service',
        meta: {pageName: '服务管理'},
        children: [
          {
            path: '/',
            name: 'service',
            meta: {pageName: '服务管理'},
            component: serviceTable
          }, {
            path: 'append',
            name: 'service_new',
            meta: {pageName: '服务管理'},
            component: serviceNew
          }, {
            path: 'status',
            name: 'service_status',
            meta: {pageName: '服务管理'},
            component: serviceStatus
          }, {
            path: 'log',
            name: 'log',
            meta: {pageName: '日志详情'},
            component: log
          }, {
            path: 'interview',
            name: 'service_interview',
            meta: {pageName: '服务管理'},
            component: serviceInterview
          }
        ],
        component: (resolve) => require(['../components/views/translator.vue'], resolve)
      },
      {
        path: '/network',
        meta: {pageName: '网络管理'},
        children: [
          {
            path: '/',
            name: 'network',
            meta: {pageName: '网络管理'},
            component: netTable
          }, {
            path: '/append',
            name: 'net_new',
            meta: {pageName: '网络管理'},
            component: netNew
          }, {
            path: 'interview',
            name: 'net_interview',
            meta: {pageName: '网络管理'},
            component: netInterview
          }
        ],
        component: (resolve) => require(['../components/views/translator.vue'], resolve)
      },
      {
        path: '/hardware',
        meta: {pageName: '磁盘管理'},
        children: [
          {
            path: '/',
            name: 'hardware',
            meta: {pageName: '磁盘管理'},
            component: diskTable
          }, {
            path: '/append',
            name: 'disk_new',
            meta: {pageName: '磁盘管理'},
            component: diskNew
          }, {
            path: '/interview',
            name: 'disk_interview',
            meta: {pageName: '磁盘管理'},
            component: diskInterview
          }
        ],
        component: resolve => require(['../components/views/translator.vue'], resolve)
      }, {
        path: '/record',
        name: 'record',
        meta: {pageName: '用户日志'},
        component: resolve => require(['../components/views/record.vue'], resolve)
      }
    ],
    component: (resolve) => require(['../components/libs/pages.vue'], resolve)
  }, {
    path: '*',
    redirect: '/initial'
  }
]

const RouterConfig = {
  // 使用 HTML5 的 History 路由模式
  // mode: 'history',
  routes: Routers
}

const Router = new VueRouter(RouterConfig)

Router.beforeEach((to, from, next) => {
  window.document.title = `运维监控 - ${to.meta.pageName}`
  next()
})
Router.afterEach((to, from) => {
  bus.$emit('pageChange', {
    to: to.meta.pageName,
    from: from.meta.pageName
  })
})
export default Router
