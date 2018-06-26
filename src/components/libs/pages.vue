<template>
  <div class="pg-components">
    <v-header :login-mess="loginMess"></v-header>
    <v-body></v-body>
  </div>
</template>

<script>
import vHeader from '@/components/libs/header.vue'
import vBody from '@/components/libs/body.vue'
export default {
  components: {
    vHeader,
    vBody
  },
  data () {
    return {
      loginMess: {
        news: 5,
        name: 'admin'
      }
    }
  }
}
</script>
