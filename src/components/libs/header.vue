<template>
  <div class="g-head">
    <div class="head-notify">
      <i class="icon icon-logo"></i>
      <h2>运维监控</h2>
    </div>
    <div class="about-login">
      <img src="@/assets/pic_user.png" width="34" height="34">
      <a class="btn" @click="handleDrop">
        {{loginMess.name}}
        <span v-show="dropdown">
          <i class="fas fa-chevron-down"></i>
        </span>
        <span v-show="!dropdown">
          <i class="fas fa-chevron-up"></i>
        </span>
      </a>
    </div>
    <div class="about-notify">
      <a class="btn btn-notify" :news-num="loginMess.news"></a>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    loginMess: {
      type: Object,
      default: () => ({ // 如果没有定义loginMess，默认值
        news: 0,
        name: 'Admin'
      })
    }
  },
  data () {
    return {
      dropdown: true
    }
  },
  methods: {
    handleDrop () {
      this.dropdown = !this.dropdown
    }
  }
}

</script>
