<template lang="pug">
div(
  class="text-copy-primary hover:text-copy-hover mr-2 cursor-pointer"
  @click.prevent="animateScale($event)"
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
    }),
    animateScale(event) {
      let el
      event.target.localName != 'svg' ? el = event.target.parentElement : el = event.target

      // setTimeout(() => {
      //   // document.querySelector('.wave').classList.toggle('active');
      //   document.querySelector('.app').classList.toggle('app--animation');
      // }, 100);

      el.classList.add('animate-scale')
      setTimeout(() => {
        el.classList.remove('animate-scale')
        this.setTheme()
      }, 300);
    }
  }
}
</script>
<style>
  .animate-scale {
    animation: animate-scale .3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  @keyframes animate-scale {
    0%   { transform: scale(1); }
    50%  { transform: scale(0); }
    100% { transform: scale(1); }
  }
</style>