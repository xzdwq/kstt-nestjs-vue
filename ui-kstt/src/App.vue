<template lang="pug">
div(
  v-if="ready"
  class="pt-1 px-2 min-h-screen content-wrapper text-copy-primary bg-background-primary"
  :class="getTheme"
)
  header-navbar
  div(class="p-2")
    router-view
</template>

<script>
import {
  mapGetters,
  mapMutations
} from 'vuex'
import toast from '@/mixins/toast'
import axios from 'axios'
export default {
  name: 'App',
  mixins: [toast],
  data() {
    return {
      ready: false
    }
  },
  computed: {
    ...mapGetters({
      getTheme: 'themeSwitcherModule/getTheme',
      getAuth: 'authModule/getAuth',
      getLocales: 'localesSwitcherModule/getLocales'
    })
  },
  methods: {
    ...mapMutations({
      setLocalesMutation: 'localesSwitcherModule/localesSwitch'
    }),
  },
  async mounted() {
    await axios.interceptors.response.use(
      (response) => {
        const locale = this.$route.query.locale
        if(locale) {
          this.setLocalesMutation({ forced: false, locale: locale })
          this.$i18n.locale = this.getLocales
        }
        this.$store.commit('authModule/setAuth', true)
        return response
      },
      (err) => {
        if(err.response.status === 401) {
          const locale = this.$route.query.locale
          if(locale) {
            this.setLocalesMutation({ forced: false, locale: locale })
            this.$i18n.locale = this.getLocales
          }
          const queryJump = this.$route.query.jump
          const jump = queryJump
                          ? '?jump='+queryJump
                          : (this.$route.path === '/login' ? '' : '?jump='+this.$route.path)
          this.$store.commit('authModule/setAuth', false)
          this.$store.commit('authModule/setUser', {})
          this.$router.push(`/login${jump}`)
        }
        else if(err.response.status === 403) {
          const msg = this.$i18n.locale === 'ru' ? 'Недостаточно прав. Ошибка роли.' : 'Insufficient rights. Role error'
          this.onToast('danger', err.message || err.response.message, msg)
        }
        else {
          this.onToast('danger', err.message || err.response.message)
        }
      },
    )
    // Информация об авторизованном пользователе
    await axios.get('api/userinfo')
    .then((data) => {
      if(data?.data.success) {
        this.$store.commit('authModule/setUser', data.data.data)
      }
    })
    this.ready = true
  },
  watch: {
    getAuth(val) {
      if(!val) {
        const queryJump = this.$route.query.jump
        const jump = queryJump
                        ? '?jump='+queryJump
                        : (this.$route.path === '/login' ? '' : '?jump='+this.$route.path)
        this.$router.push(`/login${jump}`)
      }
    }
  }
}
</script>