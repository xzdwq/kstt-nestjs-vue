<template lang="pug">
div(class="flex text-sm")
  div(v-for="stage in stageWorkflow" class="w-1/4")
    div(class="relative mb-2")
      div(
        class="w-10 h-10 mx-auto rounded-full text-lg flex items-center"
        :class="{'bg-green-500 text-white': stage.id <= activeStageWorkflow, 'border-2 border-gray-500 text-gray-500': stage.id > activeStageWorkflow, 'bg-yellow-100': (activeStageWorkflow + 1) - stage.id === 0}"
      )
        span(class="text-center w-full pr-[1px] pb-[2px]") {{ stage.id }}
      div(class="text-center text-[14px]") {{ this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }}
      div(
        v-if="stage.id > 1"
        class="h-1 bg-green-500 rounded absolute top-[20px] w-[calc(100%-2rem-1rem)]"
        :class="{'bg-gray-300': (activeStageWorkflow + 1) - stage.id < 0}"
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
    }
  },
}
</script>