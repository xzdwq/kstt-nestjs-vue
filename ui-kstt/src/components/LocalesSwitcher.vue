<template lang="pug">
div(
  class="text-copy-primary hover:text-copy-hover cursor-pointer pt-[2px] pr-[4px]"
  @click.prevent="setLocales"
)
  svg(
    v-if="getLocales === 'ru'"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  )
    g(
      aria-label="EN"
      style="font-style:normal;font-weight:normal;font-size:11.2893px;line-height:1.25;font-family:sans-serif;fill:currentColor;fill-opacity:1;stroke:none;stroke-width:1"
    )
      path(
        style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:11.2893px;font-family:'Microsoft Tai Le';-inkscape-font-specification:'Microsoft Tai Le Bold';fill:currentColor;stroke-width:1"
        d="M 16.331611,14.058787 H 14.534584 L 11.276783,9.0921568 q -0.286642,-0.4354759 -0.396889,-0.65597 h -0.02205 q 0.0441,0.4189388 0.0441,1.278866 V 14.058787 H 9.2206754 V 6.1540724 h 1.9182986 l 3.13653,4.8122846 q 0.214981,0.325229 0.396889,0.644945 h 0.02205 q -0.0441,-0.275617 -0.0441,-1.085933 V 6.1540724 h 1.681267 z m -8.3787769,0 H 3.2122101 V 6.1540724 h 4.5587164 v 1.449749 H 4.9927003 V 9.3622622 H 7.5779941 V 10.806499 H 4.9927003 v 1.808052 H 7.9528341 Z M 10.008084,0.33687423 c -5.3442373,0 -9.67658694,4.33235767 -9.67658694,9.67659077 0,5.344234 4.33234964,9.676592 9.67658694,9.676592 5.344237,0 9.676588,-4.332358 9.676588,-9.676592 0,-5.3442331 -4.332351,-9.67659077 -9.676588,-9.67659077 z"
      )
  svg(
    v-else
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  )
    g(
      aria-label="RU"
      style="font-style:normal;font-weight:normal;font-size:11.2893px;line-height:1.25;font-family:sans-serif;fill:currentColor;fill-opacity:1;stroke:none;stroke-width:1"
    )
      path(
        style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:11.2893px;font-family:'Microsoft Tai Le';-inkscape-font-specification:'Microsoft Tai Le Bold';fill:currentColor;stroke-width:1"
        d="m 17.026168,10.635616 q 0,3.56098 -3.318437,3.56098 -3.219214,0 -3.219214,-3.478295 V 6.1540724 h 1.786002 v 4.5862786 q 0,1.918299 1.49936,1.918299 1.471799,0 1.471799,-1.852151 V 6.1540724 h 1.78049 z M 9.8435714,14.058787 H 7.7984882 L 6.5692334,12.024729 Q 6.4314246,11.79321 6.3046404,11.611302 6.1778563,11.429395 6.0455598,11.302611 5.9187757,11.170314 5.7754545,11.104166 5.6376457,11.032505 5.4722751,11.032505 H 4.9927003 v 3.026282 H 3.2122101 V 6.1540724 h 2.822325 q 2.8774485,0 2.8774485,2.1498179 0,0.4134265 -0.1267841,0.7662171 -0.1267841,0.3472783 -0.358303,0.6284083 -0.2315188,0.2811301 -0.56226,0.4850873 -0.3252289,0.203957 -0.7276307,0.319716 v 0.02205 q 0.1763953,0.05512 0.3417659,0.181907 0.1653706,0.121272 0.3197165,0.286643 0.1543459,0.16537 0.2921548,0.358303 0.1433212,0.18742 0.2590806,0.369327 z M 4.9927003,7.488062 v 2.199429 h 0.7717295 q 0.5732848,0 0.920563,-0.3307412 0.3527906,-0.3362536 0.3527906,-0.8323654 0,-1.0363224 -1.2402795,-1.0363224 z M 10.008084,0.33687423 c -5.3442373,0 -9.67658694,4.33235767 -9.67658694,9.67659077 0,5.344234 4.33234964,9.676592 9.67658694,9.676592 5.344237,0 9.676588,-4.332358 9.676588,-9.676592 0,-5.3442331 -4.332351,-9.67659077 -9.676588,-9.67659077 z"
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