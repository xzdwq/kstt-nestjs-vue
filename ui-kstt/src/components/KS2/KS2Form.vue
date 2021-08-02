<template lang="pug">
div
  div(v-if="getKS3id.length > 0 && !getIsLoading")
    fieldset(class="border-2 border-gray-400 rounded p-3")
      legend(class="text-sm px-2 font-bold") {{ $t("ks2.acts") }}
      //- toolbar
      div.flex
        def-button(
          class="text-white bg-[#579bae] flex justify-between pl-[10px] py-[2px]"
        )
          span(class="pr-2") {{ $t('ks2.create') }}
          svg-down
</template>
<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'ks2-form',
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