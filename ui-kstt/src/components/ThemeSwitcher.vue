<template lang="pug">
div(
  class="text-copy-primary hover:text-copy-hover mr-2 cursor-pointer"
  @click.prevent="setTheme"
)
  svg-sun(v-if="getTheme === 'theme-light'")
  svg-moon(v-else)
</template>

<script>
import {
  mapGetters,
  mapMutations
} from 'vuex'
export default {
  name: 'theme-switcher',
  computed: {
    ...mapGetters({
      getTheme: 'themeSwitcherModule/getTheme'
    })
  },
  methods: {
    ...mapMutations({
      setTheme: 'themeSwitcherModule/themeSwitch'
    })
  }
}
</script>