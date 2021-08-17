<template lang="pug">
div(class="flex text-sm")
  div(v-for="stage in stageWorkflow" class="w-1/4")
    div(class="relative mb-2")
      div(
        class="mx-auto rounded-full text-lg flex items-center"
        :class="{'bg-transparent text-copy-primary rounded-none border-4 border-dotted border-green-500': stage.order_execution_stage == activeStageWorkflow && type != 'small', 'bg-green-500': stage.order_execution_stage == activeStageWorkflow && type == 'small', 'bg-green-500 text-white': stage.order_execution_stage < activeStageWorkflow, 'border-2 bg-gray-300 border-gray-300 text-gray-500': stage.order_execution_stage > activeStageWorkflow, 'bg-gray-300': (activeStageWorkflow + 1) - stage.order_execution_stage === 0, 'w-10 h-10': type == 'medium', 'w-4 h-4': type == 'small'}"
      )
        span(v-if="type == 'medium'" class="text-center w-full pr-[1px] pb-[2px]") {{ stage.order_execution_stage }}
        popper(
          arrow
          placement="top"
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
              span {{ getGroupUserStage(stage) }}
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
    },
    getGroupUserStage(stage) {
      const groups = stage?.group
      let executors = []
      if(groups) {
        groups.forEach((group) => {
          if(group.users) {
            const users = group.users
            users.forEach((user) => {
              // executors.push(user.full_name)
              executors.push(user.uuid)
            })
          }
        })
      }
      return executors.length > 0 ? Array.from(new Set(executors)).join() : '-'
    }
  },
}
</script>
<style>
  .popper-cust .popper {
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
    --popper-theme-border-color: #7a7a7a;
    --popper-theme-border-radius: 5px;
    --popper-theme-padding: 10px;
  }
</style>