<template lang="pug">
div
  div(class="flex")
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="$router.go(-1)"
    )
      svg-left
      span(class="pr-2") {{ $t('back') }}
  div
    span KS3 id {{ id }}
</template>
<script>
export default {
  name: 'ks3-page',
  data() {
    return {
      id: this.$route.params.id
    }
  },
  mounted() {
    console.log(this.id);
  }
}
</script>