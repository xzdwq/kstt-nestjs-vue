<template lang="pug">
div(
  class="pt-1 min-h-screen content-wrapper text-copy-primary bg-background-primary"
  :class="getTheme"
)
  header-navbar
  div(class="md:container md:px-0 py-2")
    router-view
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