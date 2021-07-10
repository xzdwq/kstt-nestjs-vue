<template>
  <div
    class="pt-1 min-h-screen content-wrapper text-copy-primary bg-background-primary"
    :class="getTheme"
  >
    <header-navbar />
    <div class="container pt-4">
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