<template lang="pug">
div(class="p-1 pb-4 rounded-md bg-background-secondary border-2 border-transparent")
  div(class="grid grid-cols-2 gap-1 grid-rows-4 w-full h-36")
    //- header
    div(class="col-span-2 w-full")
      div.flex
        //- section-1(number)
        div(class="w-60 pl-2 ")
          span(class="text-gray-400") # {{ item.certificate_number }}
        //- section-2
        div(class="w-full text-center ")
          span(class="text-gray-400")
        //- section-3(icons)
        div(class="pr-2 w-80 flex justify-end ")
          svg-papperclip(
            class="p-1 cursor-pointer"
          )
          svg-star(
            class="p-1 cursor-pointer"
          )
    //- middle-block
    div(class="pl-4 mt-[-10px] col-span-2 w-full ")
      span {{ $t('ks3.document') }}: 
      span(class="font-semibold") {{ item.document_number }}/{{ item.certificate_number }}  
      span {{ $t('ks3.document-dated') }} 
      span(class="font-semibold") {{ formatDate(item.date_preparation, this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy') }}
    //- left-bottom-block
    div(class="w-full h-20 pl-4 ")
      span {{ $t('ks3.reporting-period') }}: 
      span(class="font-semibold") {{ formatDate(item.reporting_period, 'LLLL yyyy') }}
      br
      span {{ $t('ks3.created') }}: 
      span(class="font-semibold") {{ formatDate(item.create_at, this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy') }}
      br
      span(class="text-xs") {{ $t('ks3.author') }}: 
      span(class="text-xs font-semibold") {{ item.user.full_name }}
    //- right-bottom-block
    div(class="flex justify-end h-20 ")
      stage-workflow(
        class="pt-4"
        type="small"
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