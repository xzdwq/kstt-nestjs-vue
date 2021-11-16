<template lang="pug">
div(class="flex text-sm")
  div(v-for="stage in stageWorkflow" class="w-1/4")
    div(class="relative mb-2")
      div(
        class="mx-auto rounded-full text-lg flex items-center"
        :class="{'bg-transparent text-copy-primary rounded-none border-4 border-dotted border-green-500': stage.order_execution_stage == activeStageWorkflow && type != 'small', 'bg-green-500': stage.order_execution_stage == activeStageWorkflow && type == 'small', 'bg-green-500 text-white': stage.order_execution_stage < activeStageWorkflow, 'border-2 bg-gray-300 border-gray-300 text-gray-500': stage.order_execution_stage > activeStageWorkflow, 'bg-gray-300': (activeStageWorkflow + 1) - stage.order_execution_stage === 0, 'w-10 h-10': type == 'medium', 'w-4 h-4': type == 'small'}"
      )
        div(
          v-ttip="getStageInfo(stage), {trigger: 'click'}"
          class="cursor-pointer flex justify-center items-center"
          :class="{'w-4 h-4': type == 'small', 'w-10 h-10': type == 'medium'}"
        )
          span(v-if="type == 'medium'" class="text-center w-full pr-[1px] pb-[2px]") {{ stage.order_execution_stage }}
      div(
        class="text-center font-semibold"
        :class="{'text-[14px]': type == 'medium', 'text-[10px] leading-[13px] pt-[5px]': type == 'small', 'text-green-500': (activeStageWorkflow + 1) - stage.order_execution_stage > 0}"
      ) {{ getNameStage(stage) }}
      div(
        v-if="stage.order_execution_stage > 1"
        class="rounded absolute"
        :class="{'bg-gray-300': (activeStageWorkflow + 1) - stage.order_execution_stage <= 0, 'bg-green-500': (activeStageWorkflow + 1) - stage.order_execution_stage > 0, 'h-1 top-[20px] w-[calc(100%-2rem-1rem)]': type == 'medium', 'h-[2px] top-[8px] w-[calc(100%-.3rem-1rem)]': type == 'small'}"
        style="transform: translate(-50%, -50%);"
      )
</template>
<script>
import { format } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'
export default {
  name: 'stage-workflow',
  props: {
    stageWorkflow: {
      type: Array,
    },
    activeStageWorkflow: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'medium'
    }
  },
  data() {
    return {
      ru: ru,
      en: enGB,
    }
  },
  methods: {
    getStageInfo(stage) {
        let text = `
          <div>
            <div>
              <span class="text-gray-400"> ${this.$t('stage')}: </span>
              <span> ${this.getNameStage(stage)} </span>
            </div>
            <div>
              <span class="text-gray-400"> ${this.$t('task')}: </span>
              <span> ${this.$t('agree-date', {date: this.formatDate(stage.deadline) })} </span>
            </div>
            <div>
              <span class="text-gray-400"> ${this.$t('performers')}: </span>
              <span> ${this.getGroupUserStage(stage)} </span>
            </div>
          </div>
        `
      return text
    },
    getNameStage(stage) {
      if(this.$i18n.locale == 'ru') {
        if(this.type == 'small') {
          return stage.short_name_ru
        } else {
          return stage.name_ru
        }
      } else {
        if(this.type == 'small') {
          return stage.short_name_en
        } else {
          return stage.name_en
        }
      }
    },
    formatDate(date) {
      let formatType = this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
      return format(
        new Date(date),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    },
    getGroupUserStage(stage) {
      let executors = []
      stage.types.forEach((i) => {
        if(i.groups) {
          i.groups.forEach((g) => {
            const name = this.$i18n.locale == 'ru' ? g.name_ru : g.name_en
            executors.push(name)
          })
        }
      })
      return executors.length > 0 ? Array.from(new Set(executors)).join(', ') : '-'
    }
  },
}
</script>