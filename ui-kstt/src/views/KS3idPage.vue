<template lang="pug">
div
  //- toolbar
  div(class="flex items-center")
    def-button-back
    def-button(
        class="text-white bg-[#579bae] flex justify-between"
        @click="onRefresh"
      )
        svg-refresh(:class="{'animate-spin z-0' : getIsLoading || isLoadForRefresh}")
  //- загрузка схемы стадий согласования КС-3
  div(
    v-if="getIsLoadStageWorkflow"
    class="absolute w-[calc(100%-155px)] flex items-center justify-center"
  )
    svg-loading
    p {{ $t('ks3.get-stage-workflow') }}
  //- load
  div(
    v-if="getKS3id.length === 0 && !getIsLoading"
    class="absolute w-[calc(100%-155px)] flex justify-center"
  )
    p {{ $t('oops-data', {id: id}) }}
  div(v-if="getKS3id.length === 0 && getIsLoading" class="absolute w-[calc(100%-155px)] flex items-center justify-center")
    svg-loading
    p {{ $t('loading') }}
  //- body
  div(class="min-h-[calc(100vh-160px)]")
    metadata-ks3(ref="metadata_ks3")
    //- схема стадий согласования КС-3
    vue-collapsible-panel-group(v-if="getKS3id.length > 0 && !getIsLoading")
      vue-collapsible-panel(:expanded="expand" @click.prevent="onExpand()")
        template(#title)
          div(
            class="relative w-full flex items-center select-none"
          )
            div(class="min-w-[300px] absolute text-sm") {{ $t('stage') }}: {{ this.$i18n.locale == 'ru' ? getCurrentStageInfo.name_ru : getCurrentStageInfo.name_en }}
            div(class="flex w-full justify-center items-center font-bold ml-16")
              div(class="w-full md:w-auto")
                div(class="hidden md:flex") {{ $t('stage-agreement') }}
              def-button(
                v-if="workflowManagmentKS3"
                v-ttip="$t('correction-wf-route')"
                @click.stop="$router.push(`/workflowmanagment/${getKS3id[0].workflow_id}`)"
              )
                  svg-pencilalt
        template(#content)
          div(@click.stop)
            stage-workflow(
              v-if="!getIsLoadStageWorkflow"
              type="medium"
              class="py-4"
              :stageWorkflow="getStageWorkflow"
              :activeStageWorkflow="getActiveStageWorkflow"
            )
    ks2-form(
      ref="ks2form"
      :class="expand ? getExpandHeightClass : getNoExpandHeightClass"
    )
  //- bottom toolbar
  div.flex
    //- paginator ks-2 register
    def-pagination(
      class="pt-2 flex justify-end"
      getPageModule="ks2idModule/getPage"
      getTotalPageModule="ks2idModule/getTotalPage"
      setPageModule="ks2idModule/setPage"
      fetchStoreModule="ks2idModule/fetchKS2"
      :fetchStoreModuleParams="{ks3_id: this.id}"
      getLimitModule="ks2idModule/getLimit"
      setLimitModule="ks2idModule/setLimit"
      getTotalRecordsModule="ks2idModule/getKS2Total"
      alignInfo="start"
    )
    div(v-if="getKS3id.length > 0 && !getIsLoading && workflowManagmentKS3")
      div(class="pt-2 flex justify-end")
        def-button(
          class="flex text-white bg-[#06d6a0]"
          @click="onSave"
        )
          svg-save(class="md:hidden")
          span(class="hidden md:block") {{ $t('save') }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import toast from '@/mixins/toast'
import matchRoles from '@/mixins/matchRoles'
export default {
  name: 'ks3id-page',
  mixins: [toast, matchRoles],
  data() {
    return {
      workflowManagmentKS3: false,
      isLoadForRefresh: true,
      id: this.$route.params.id,
      expand: true
    }
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'ks3idModule/getIsLoading',
      getKS3id: 'ks3idModule/getKS3id',
      getStageWorkflow: 'ks3idModule/getStageWorkflow',
      getIsLoadStageWorkflow: 'ks3idModule/getIsLoadStageWorkflow',
      getActiveStageWorkflow: 'ks3idModule/getActiveStageWorkflow',
      getCurrentStageInfo: 'ks3idModule/getCurrentStageInfo',
      getExpandHeightClass: 'expandStageInKS3IdModule/getExpandHeightClass',
      getNoExpandHeightClass: 'expandStageInKS3IdModule/getNoExpandHeightClass'
    })
  },
  methods: {
    ...mapActions({
      fetchStageWorkflow: 'ks3idModule/fetchStageWorkflow',
      fetchKS3id: 'ks3idModule/fetchKS3id',
      saveMetadatKS3: 'ks3idModule/saveMetadatKS3'
    }),
    onExpand() {
      this.expand = !this.expand
    },
    async onSave() {
      const params = {
        id: this.$refs.metadata_ks3.form.id,
        certificate_number: this.$refs.metadata_ks3.form.certificate_number,
        document_number: this.$refs.metadata_ks3.form.document_number,
        date_preparation: this.$refs.metadata_ks3.form.date_preparation,
        reporting_period: this.$refs.metadata_ks3.form.reporting_period
      }
      await this.saveMetadatKS3(params)
      .then((data) => {
        if(data.success) {
          this.onToast('success', this.$t('success'))
        } else {
          this.onToast('danger', this.$t('error'), data.message)
        }
      })
      await this.onRefresh()
    },
    async onRefresh() {
      this.isLoadForRefresh = true
      await this.fetchKS3id(this.$refs.metadata_ks3.form.id)
      this.$refs.ks2form.onRefresh('parent')
      setTimeout(() => { this.isLoadForRefresh = false }, 500)
    }
  },
  async mounted() {
    await this.matchRole('workflowManagmentKS3')
    setTimeout(() => { this.isLoadForRefresh = false }, 500)
  }
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