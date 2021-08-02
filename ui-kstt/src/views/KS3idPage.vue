<template lang="pug">
div
  //- toolbar
  div(class="flex")
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="$router.go(-1)"
    )
      svg-left
      span(class="pr-2") {{ $t('back') }}
  metadata-ks3
  ks2-form
  //- load
  div(
    v-if="getKS3id.length === 0 && !getIsLoading"
    class="absolute w-[calc(100%-55px)] flex justify-center"
  )
    p {{ $t('oops-data', {id: id}) }}
  div(v-if="getKS3id.length === 0 && getIsLoading" class="absolute w-[calc(100%-55px)] flex items-center justify-center")
      svg-loading
      p {{ $t('loading') }}
</template>
<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'ks3id-page',
  data() {
    return {
      id: this.$route.params.id
    }
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'ks3idModule/getIsLoading',
      getKS3id: 'ks3idModule/getKS3id'
    })
  }
}
</script>