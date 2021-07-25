<template lang="pug">
div(class="flex text-sm")
  div(v-for="stage in stageWorkflow" class="w-1/4")
    div(class="relative mb-2")
      div(
        class="mx-auto rounded-full text-lg flex items-center"
        :class="{'bg-green-500 text-white': stage.id <= activeStageWorkflow, 'border-2 border-gray-500 text-gray-500': stage.id > activeStageWorkflow, 'bg-gray-200': (activeStageWorkflow + 1) - stage.id === 0, 'w-10 h-10': type == 'medium', 'w-4 h-4': type == 'small'}"
      )
        span(v-if="type == 'medium'" class="text-center w-full pr-[1px] pb-[2px]") {{ stage.id }}
        Popper(
          arrow
          class="popper-cust flex absolute"
          :style="getPopperStyle"
        )
          div(
            class="cursor-pointer"
            :class="{'w-4 h-4': type == 'small', 'w-10 h-10': type == 'medium'}"
          )
          template(#content)
            div
              span(class="text-gray-400") {{ $t('stage') }}: 
              span {{ getNameStage(stage) }}
            div
              span(class="text-gray-400") {{ $t('task') }}: 
              span {{ $t('agree') }} --.--.--
            div
              span(class="text-gray-400") {{ $t('performers') }}: 
              span username
      div(
        class="text-center font-semibold"
        :class="{'text-[14px]': type == 'medium', 'text-[10px] leading-[13px] pt-[5px]': type == 'small', 'text-green-500': (activeStageWorkflow + 1) - stage.id > 0}"
      ) {{ getNameStage(stage) }}
      div(
        v-if="stage.id > 1"
        class="h-1 rounded absolute"
        :class="{'bg-gray-300': (activeStageWorkflow + 1) - stage.id < 0, 'bg-green-500': (activeStageWorkflow + 1) - stage.id > 0, 'bg-yellow-200': (activeStageWorkflow + 1) - stage.id === 0, 'top-[20px] w-[calc(100%-2rem-1rem)]': type == 'medium', 'top-[8px] w-[calc(100%-.5rem-1rem)]': type == 'small'}"
        style="transform: translate(-50%, -50%);"
      )
</template>
<script>
import Popper from "vue3-popper";
export default {
  name: 'stage-workflow',
  components: {
    Popper
  },
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
  computed: {
    getPopperStyle() {
      return 'margin: -13.5px !important;'
    }
  },
  methods: {
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
    }
  },
}
</script>
<style>
  .popper {
    width: 250px;
  }
  .popper-cust {
    z-index: 1;
    font-size: 12px;
    font-weight: bold;
    line-height: 15px;
    --popper-theme-background-color: #ffffff;
    --popper-theme-background-color-hover: #ffffff;
    --popper-theme-text-color: #000000;
    --popper-theme-border-width: 1px;
    --popper-theme-border-style: solid;
    --popper-theme-border-color: #636363;
    --popper-theme-border-radius: 0px;
    --popper-theme-padding: 10px;
    --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
  }
</style>