<template lang="pug">
div(
  class="flex justify-center pr-2 text-copy-primary hover:text-copy-hover cursor-pointer font-bold select-none min-w-[30px]"
  @click.prevent="setLocales"
)
  div(v-ttip="$t('lang-switch')")
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
      const locale = this.$route.query.locale
      if(locale) {
        const query = Object.assign({}, this.$route.query);
        delete query.locale
        this.$router.replace({ query });
      }
      this.setLocalesMutation({ forced: true, locale: null });
      this.$i18n.locale = this.getLocales
    }
  }
}
</script>