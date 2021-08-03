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
  //- загрузка схемы стадий согласования КС-3
  div(
    v-if="getIsLoadStageWorkflow"
    class="absolute w-[calc(100%-55px)] flex items-center justify-center"
  )
    svg-loading
    p {{ $t('ks3.get-stage-workflow') }}
  //- схема стадий согласования КС-3
  div(class="bg-background-secondary rounded mt-2 mb-2")
    stage-workflow(
      v-if="!getIsLoadStageWorkflow"
      class="pt-4"
      :stageWorkflow="getStageWorkflow"
      :activeStageWorkflow="getActiveStageWorkflow"
    )
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
  mapGetters,
  mapActions
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
      getKS3id: 'ks3idModule/getKS3id',
      getStageWorkflow: 'ks3idModule/getStageWorkflow',
      getIsLoadStageWorkflow: 'ks3idModule/getIsLoadStageWorkflow',
      getActiveStageWorkflow: 'ks3idModule/getActiveStageWorkflow',
    })
  },
  methods: {
    ...mapActions({
      fetchStageWorkflow: 'ks3idModule/fetchStageWorkflow'
    }),
  },
  async mounted() {
    /**
     * Получаем список этапов workflow справки КС-3
     */
    await this.fetchStageWorkflow()
  },
}
</script>