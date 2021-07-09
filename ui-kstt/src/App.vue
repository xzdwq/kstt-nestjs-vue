<template>
  <div
    class="min-h-screen content-wrapper text-copy-primary bg-background-primary"
    :class="getTheme"
  >
    <div class="container">
      <header-navbar />
      <router-view />
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters({
      getTheme: 'themeSwitcherModule/getTheme'
    })
  }
}
</script>