<template lang="pug">
div(
  class="text-copy-primary hover:text-copy-hover cursor-pointer"
  @click="onLogout()"
)
  svg-logout(v-ttip="$t('logout')")
</template>
<script>
import axios from 'axios'
export default {
  name: 'logout',
  methods: {
    async onLogout() {
      this.$store.commit('authModule/setAuth', false)
      this.$store.commit('authModule/setUser', {})
      this.$router.push('/login')
      await axios.get('logout')
    }
  }
}
</script>