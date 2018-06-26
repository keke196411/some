// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import constants from '@/vender/js/constants'
import bus from '@/vender/js/bus'
import verifier from '@/vender/js/regExp'
import store from '@/vender/js/store'
import VeeValidate from 'vee-validate'
import 'element-ui/lib/theme-chalk/index.css'
import '@/vender/fontawesome-free-5.0.6/svg-with-js/js/fontawesome-all.min.js'
import '@/less/style.less'

Vue.use(ElementUI)
Vue.use(VeeValidate, {
  aria: true,
  classNames: {},
  classes: false,
  delay: 0,
  dictionary: null,
  errorBagName: 'errors', // change if property conflicts
  events: 'input|blur',
  fieldsBagName: 'veefields',
  i18n: null, // the vue-i18n plugin instance
  i18nRootKey: 'validations', // the nested key under which the validation messsages will be located
  inject: true,
  locale: 'zh-CN',
  strict: true,
  validity: false
})
Vue.config.productionTip = false
Vue.prototype.$bus = bus
Vue.prototype.$echarts = echarts
Vue.prototype.verifier = verifier
Vue.prototype.constants = constants

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => {
    return h(App)
  },
  store
})
