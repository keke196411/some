<template>
  <div class="g-body">
    <div class="m-leftside">
      <el-row class="top">
        <el-menu default-active="0" class="side-nav" @select="changeRouter">
          <div v-for="(menu,index) in menus" :key="index">
            <el-submenu v-if="menu.childTerm.length" :index="menu.name">
              <template slot="title">
                <i :class="['icon', menu.iconName]"></i>
                <span>{{menu.name}}</span>
              </template>
              <el-menu-item v-for="(term, subIndex) in menu.childTerm" :key="subIndex" :index="term.page">
                <span>{{term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="menu.page" :class="menu.selected?'active':''">
              <i :class="['icon', menu.iconName]"></i>
              <span>{{menu.name}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-row>
      <el-row class="bottom">
        <div class="copy-rights">ENJOYOR
          Copyright © 2018</div>
      </el-row>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menus: [
        {
          name: '资源概览',
          iconName: 'icon-opened-book',
          page: 'abstract',
          childTerm: []
        },
        {
          name: '主机管理',
          iconName: 'icon-displayer',
          page: 'host',
          childTerm: []
        },
        {
          name: '镜像管理',
          iconName: 'icon-beveled-paper',
          page: 'mirror',
          childTerm: []
        },
        {
          name: '应用管理',
          iconName: 'icon-four-rect',
          page: 'app',
          childTerm: []
        },
        {
          name: '服务代理',
          iconName: 'icon-paper',
          page: 'proxy',
          childTerm: []
        },
        {
          name: '服务管理',
          iconName: 'icon-filled-faper',
          page: 'service',
          childTerm: []
        },
        {
          name: '网络管理',
          iconName: 'icon-net-grid',
          page: 'network',
          childTerm: []
        },
        {
          name: '磁盘管理',
          iconName: 'icon-hard-disk',
          page: 'hardware',
          childTerm: []
        },
        {
          name: '日志管理',
          iconName: 'icon-half-paper',
          page: 'record',
          childTerm: []
        }
      ]
    }
  },
  methods: {
    changeRouter (index, indexPath) {
      this.$router.push({name: index})
    }
  },
  created () {
    this.$bus.$on('pageChange', (pageInfo) => {
      if (pageInfo.to === '日志详情') return
      this.menus.forEach((item) => {
        if (item.name === pageInfo.to) item.selected = true
        else if (item.selected) {
          item.selected = false
        }
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('pageChange', function (param) {})
  }
}
</script>
