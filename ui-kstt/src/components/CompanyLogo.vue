<template lang="pug">
div(
  class="flex text-copy-primary hover:text-copy-hover min-w-[100px] mr-10 cursor-pointer select-none"
  @click="goHome()"
)
  svg-logo
  div.font-bold.ml-2.text-xs.leading-none
    p {{ $t('logo-1') }}
    p {{ $t('logo-2') }}
</template>
<script>
export default {
  name: 'logo',
  methods: {
    goHome() {
      if(this.$store.getters['authModule/getAuth']) {
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    }
  },
}
</script>