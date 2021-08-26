<template lang="pug">
div
  //- toolbar
  div(class="flex")
    def-button-back
  metadata-ks3
  //- загрузка схемы стадий согласования КС-3
  div(
    v-if="getIsLoadStageWorkflow"
    class="absolute w-[calc(100%-55px)] flex items-center justify-center"
  )
    svg-loading
    p {{ $t('ks3.get-stage-workflow') }}
  //- load
  div(
    v-if="getKS3id.length === 0 && !getIsLoading"
    class="absolute w-[calc(100%-55px)] flex justify-center"
  )
    p {{ $t('oops-data', {id: id}) }}
  div(v-if="getKS3id.length === 0 && getIsLoading" class="absolute w-[calc(100%-55px)] flex items-center justify-center")
    svg-loading
    p {{ $t('loading') }}
  //- схема стадий согласования КС-3
  vue-collapsible-panel-group(v-if="getKS3id.length > 0 && !getIsLoading")
    vue-collapsible-panel(
      :expanded="false"
    )
      template(#title)
        div(class="w-full flex items-center select-none")
          div(class="min-w-[300px] absolute text-sm") {{ $t('stage') }}: {{ this.$i18n.locale == 'ru' ? getCurrentStageInfo.name_ru : getCurrentStageInfo.name_en }}
          div(class="flex w-full justify-center items-center font-bold ml-16")
            div(class="w-full md:w-auto")
              div(class="hidden md:flex") {{ $t('stage-agreement') }}
            popper(arrow :hover="true" placement="top"
              class="flex popper-tips font-normal"
              :content="$t('correction-wf-route')"
            )
              def-button(
                @click="$router.push(`/workflowmanagment/${getKS3id[0].workflow_id}`)"
              )
                svg-pencilalt
      template(#content)
        div
          stage-workflow(
            v-if="!getIsLoadStageWorkflow"
            type="medium"
            class="py-4"
            :stageWorkflow="getStageWorkflow"
            :activeStageWorkflow="getActiveStageWorkflow"
          )
  ks2-form
  //- bottom toolbar
  div(
    v-if="getKS3id.length > 0 && !getIsLoading"
    class=""
  )
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="onSave"
    ) Save
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
      getCurrentStageInfo: 'ks3idModule/getCurrentStageInfo'
    })
  },
  methods: {
    ...mapActions({
      fetchStageWorkflow: 'ks3idModule/fetchStageWorkflow'
    }),
    onSave() {}
  },
  async mounted() {
    /**
     * Получаем список этапов workflow справки КС-3
     */
    // await this.fetchStageWorkflow()
  },
}
</script>
<style>
.vcpg {
  --border-color: none !important;
  --bg-color-body: var(--bg-background-secondary) !important;
}
.vcp {
  border-radius: 5px;
  background-color: var(--bg-background-secondary);
}
.vcp__header {
  border-radius: 5px;
  background-color: var(--bg-background-secondary) !important;
}
.vcp__body {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.vcp__body-content {
  padding: 0 !important;
}
</style>