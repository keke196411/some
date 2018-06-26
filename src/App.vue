<template>
  <div id="app" class="root-container">
    <router-view></router-view>
  </div>
</template>

<script>
import store from '@/vender/js/store'
export default {
  name: 'App',
  store,
  created () {
    let ww = document.documentElement.offsetWidth
    document.documentElement.style.fontSize = (ww / 1366) * 100 + 'px'
    window.onresize = () => {
      let ww = document.documentElement.offsetWidth
      document.documentElement.style.fontSize = (ww / 1366) * 100 + 'px'
    }
  }
}
</script>
