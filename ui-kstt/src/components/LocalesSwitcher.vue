<template lang="pug">
div(
  class="flex justify-center text-copy-primary hover:text-copy-hover cursor-pointer font-bold select-none min-w-[30px]"
  @click.prevent="setLocales"
)
  span(
    v-if="getLocales === 'ru'"
  ) EN
  span(
    v-else
  ) RU
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