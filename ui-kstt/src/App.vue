<template lang="pug">
div(
  class="pt-1 xl:px-4 md:px-2 sm:px-2 min-h-screen content-wrapper text-copy-primary bg-background-primary"
  :class="getTheme"
)
  header-navbar
  div(class="md:container py-2 xl:px-4 md:px-2 sm:px-2")
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