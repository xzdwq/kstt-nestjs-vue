<template lang="pug">
div(class="p-3 mb-2 rounded-lg bg-background-secondary border-2 border-transparent")
  div.flex
    div
      p {{ $t('ks3.certificate-number') }}: {{ item.certificate_number }}
      p {{ $t('ks3.document-number') }}: {{ item.document_number }}
      p {{ $t('status') }}: {{ this.$i18n.locale == 'ru' ? item.ks3_stage_workflow.name_ru : item.ks3_stage_workflow.name_en }}
      p {{ $t('ks3.date-preparation') }}: {{ formatDate(item.date_preparation, this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy') }}
      p {{ $t('ks3.period') }}: {{ formatDate(item.reporting_period, 'LLLL yyyy') }}
    div
      div(v-if="getIsLoadStageWorkflow" class="pl-20 flex items-center justify-center")
        svg-loading
        p {{ $t('ks3.get-stage-workflow') }}
      stage-workflow(
        class="pt-4"
        :stageWorkflow="getStageWorkflow"
        :activeStageWorkflow="item.ks3_stage_workflow.id"
      )
</template>
<script>
import { format } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'

import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'ks3-items',
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      ru: ru,
      en: enGB,
    }
  },
  computed: {
    ...mapGetters({
      getStageWorkflow: 'ks3Module/getStageWorkflow',
      getIsLoadStageWorkflow: 'ks3Module/getIsLoadStageWorkflow'
    })
  },
  async mounted() {
    /**
     * Получаем список этапов workflow справки КС-3
     */
    await this.fetchStageWorkflow()
  },
  methods: {
    ...mapActions({
      fetchStageWorkflow: 'ks3Module/fetchStageWorkflow'
    }),
    formatDate(date, formatType) {
      return format(
        new Date(date),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    }
  }
}
</script>