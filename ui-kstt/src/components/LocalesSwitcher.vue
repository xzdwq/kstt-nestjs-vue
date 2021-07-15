<template lang="pug">
div(
  class="text-copy-primary hover:text-copy-hover cursor-pointer select-none pt-[3px] pl-[2px] pr-[9px]"
  @click.prevent="setLocales"
)
  svg(
    v-if="getLocales === 'ru'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke-linecap="round"
    stroke-linejoin="round"
  )
    circle(
      style="fill:#f0f0f0;stroke-width:1"
      cx="12"
      cy="12"
      id="circle2"
      r="12"
    )
    g(
      transform="scale(0.046875)"
      style="stroke-width:21.3333"
    )
      path(
        style="fill:rgb(38 105 184);stroke-width:98.5343"
        d="M 52.92,100.142 C 32.811,126.305 17.648,156.46 8.819,189.219 h 133.178 z"
      )
      path(
        style="fill:rgb(38 105 184);stroke-width:98.5343"
        d="m 503.181,189.219 c -8.829,-32.758 -23.993,-62.913 -44.101,-89.076 l -89.075,89.076 z"
      )
      path(
        style="fill:rgb(38 105 184);stroke-width:98.5343"
        d="m 8.819,322.784 c 8.83,32.758 23.993,62.913 44.101,89.075 l 89.074,-89.075 z"
      )
      path(
        style="fill:rgb(38 105 184);stroke-width:98.5343"
        d="M 411.858,52.921 C 385.695,32.812 355.541,17.649 322.782,8.819 v 133.177 z"
      )
      path(
        style="fill:rgb(38 105 184);stroke-width:98.5343"
        d="m 100.142,459.079 c 26.163,20.109 56.318,35.272 89.076,44.102 V 370.005 Z"
      )
      path(
        style="fill:rgb(38 105 184);stroke-width:98.5343"
        d="m 189.217,8.819 c -32.758,8.83 -62.913,23.993 -89.075,44.101 l 89.075,89.075 z"
      )
      path(
        style="fill:rgb(38 105 184);stroke-width:98.5343"
        d="m 322.783,503.181 c 32.758,-8.83 62.913,-23.993 89.075,-44.101 l -89.075,-89.075 z"
      )
      path(
        style="fill:rgb(38 105 184);stroke-width:98.5343"
        d="m 370.005,322.784 89.075,89.076 c 20.108,-26.162 35.272,-56.318 44.101,-89.076 z"
      )
    g(
      transform="scale(0.046875)"
      style="stroke-width:21.3333"
    )
      path(
        style="fill:rgb(228 83 109);stroke-width:98.5343"
        d="m 509.833,222.609 h -220.44 -10e-4 V 2.167 C 278.461,0.744 267.317,0 256,0 244.681,0 233.539,0.744 222.609,2.167 v 220.44 0.001 H 2.167 C 0.744,233.539 0,244.683 0,256 c 0,11.319 0.744,22.461 2.167,33.391 h 220.44 0.001 V 509.833 C 233.539,511.256 244.681,512 256,512 c 11.317,0 22.461,-0.743 33.391,-2.167 v -220.44 -10e-4 H 509.833 C 511.256,278.461 512,267.319 512,256 c 0,-11.317 -0.744,-22.461 -2.167,-33.391 z"
      )
      path(
        style="fill:rgb(228 83 109);stroke-width:98.5343"
        d="m 322.783,322.784 v 0 L 437.019,437.02 c 5.254,-5.252 10.266,-10.743 15.048,-16.435 l -97.802,-97.802 h -31.482 z"
      )
      path(
        style="fill:rgb(228 83 109);stroke-width:98.5343"
        d="m 189.217,322.784 h -0.002 L 74.98,437.019 c 5.252,5.254 10.743,10.266 16.435,15.048 l 97.802,-97.804 z"
      )
      path(
        style="fill:rgb(228 83 109);stroke-width:98.5343"
        d="m 189.217,189.219 v -0.002 L 74.981,74.98 C 69.727,80.232 64.715,85.723 59.933,91.415 l 97.803,97.803 h 31.481 z"
      )
      path(
        style="fill:rgb(228 83 109);stroke-width:98.5343"
        d="m 322.783,189.219 v 0 L 437.02,74.981 C 431.768,69.727 426.277,64.715 420.585,59.934 l -97.802,97.803 z"
      )
  svg(
    v-else
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke-linecap="round"
    stroke-linejoin="round"
  )
    circle(
      style="fill:#f0f0f0;stroke-width:1"
      cx="12"
      cy="12"
      id="circle2"
      r="12"
    )
    path(
      style="fill:rgb(38 105 184);stroke-width:1"
      d="M 23.253609,16.173891 C 23.736,14.873906 24,13.467844 24,12 24,10.532156 23.736,9.1260937 23.253609,7.8261094 H 0.74639062 C 0.26404688,9.1260937 0,10.532156 0,12 c 0,1.467844 0.26404688,2.873906 0.74639062,4.173891 L 12,17.217375 Z"
    )
    path(
      style="fill:rgb(228 83 109);stroke-width:1"
      d="m 12,24 c 5.159578,0 9.558094,-3.2565 11.253609,-7.826109 H 0.74639062 C 2.4419063,20.7435 6.8404219,24 12,24 Z"
    )
</template>
<script>
import {
  mapGetters,
  mapMutations
} from 'vuex'

export default {
  name: 'locales-switcher',
  computed: {
    ...mapGetters({
      getLocales: 'localesSwitcherModule/getLocales'
    })
  },
  methods: {
    ...mapMutations({
      setLocalesMutation: 'localesSwitcherModule/localesSwitch'
    }),
    setLocales() {
      this.setLocalesMutation();
      this.$i18n.locale = this.getLocales
    }
  }
}
</script>