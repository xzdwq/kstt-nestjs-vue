<template lang="pug">
div.relative
  //- toolbar
  div(class="flex items-center")
    def-button-back
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="onRefresh"
    )
      svg-refresh(:class="{'animate-spin z-0' : getIsLoadWorkflowDefault || isLoadForRefresh}")
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="onGetSort"
    ) GET
    div(class="flex w-full justify-center")
      div {{ $t('route-default') }}
  //- component
  div(class="relative h-[calc(100vh-130px)] overflow-scroll break-words bg-background-secondary rounded mt-2 mb-2 p-2 w-full")
    div(class="flex min-w-[980px] pr-2 text-center items-center bg-background-primary rounded-md")
      div(class="min-w-[100px]") #
      div(class="min-w-[180px] px-8") {{ $t('stage-agreement') }}
      div(class="min-w-[310px] px-8") {{ $t('groups') }}
      div(class="min-w-[350px] px-8") {{ $t('participants') }}
      div(class="w-full px-8")
    div(
      ref="group_mangment_default"
      class="relative"
    )
      //- загрузка схемы стадий согласования КС-3
      div(
        v-if="getWorkflowDefault.data.length === 0 && getIsLoadWorkflowDefault"
        class="absolute z-10 w-[calc(100%-55px)] flex items-center justify-center mt-2"
      )
        svg-loading
        p {{ $t('ks3.get-stage-workflow') }}
      div(
        v-if="getWorkflowDefault.data.length === 0 && !getIsLoadWorkflowDefault"
        class="py-2"
      )
        p {{ $t('no-data') }}
      //- стадии
      draggable(
        class="relative"
        v-model="getWorkflowDefault.data"
        tag="transition-group"
        :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
        v-bind="dragStage"
        group="stageDefault"
        handle=".handle"
        @start="drag=true"
        @end="drag=false"
        item-key="id"
        @change="logStage"
      )
        template(#item="{element: stage, index: stage_idx}")
          div(class="p-1 flex mb-6 even:bg-background-primary rounded-md min-w-[980px]")
            div(class="h-hull flex items-center px-8 text-[50px] font-bold opacity-40 select-none")
              span {{ getStageSort(stage, stage_idx+1) }}
            div.flex
              div(
                class="relative flex items-center justify-start text-center border-4 border-[#9CA3FF] rounded-xl min-h-[90px] w-[185px]"
              )
                div(class="w-[40px]")
                  svg-selector(class="handle cursor-move")
                div(class="w-full pr-8") {{ this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }}
                div(
                  class="absolute right-0 top-0 text-[#9CA3FF] hover:text-[#898ed2] duration-100 cursor-pointer"
                  @click="onAddGroup(stage)"
                )
                  svg-view-grid-plus
            //- группы
            div(v-if="stage.ks3_stage_workflow_group.length > 0")
              draggable(
                class="ml-14 min-h-[90px] w-[208px] border-4 border-[#9CA3FF] rounded-xl"
                v-model="stage.ks3_stage_workflow_group"
                tag="transition-group"
                :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                v-bind="dragGroup"
                :group="`group_${stage.id}`"
                handle=".handle"
                @start="drag=true"
                @end="drag=false"
                item-key="id"
                @change="logGroup"
              )
                template(#item="{element: group, index: group_idx}")
                  div(class="flex mb-2 last:mb-0")
                    div.flex
                      div(
                        class="relative flex items-center justify-start text-center border-dashed border-2 border-[#9CA3FF] rounded-lg min-h-[90px] w-[200px]"
                      )
                        div(class="w-[40px]")
                          svg-selector(class="handle cursor-move")
                        div(class="w-full pr-4") {{ this.$i18n.locale == 'ru' ? group.group.name_ru : group.group.name_en }}
                        //- toolbar
                        div(
                          class="absolute top-0 right-7 text-[#9CA3FF] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                          @click="onEditGroup(stage, group)"
                        )
                          svg-pencilalt
                        div(
                          class="absolute top-0 right-0 text-[#9CA3FF] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                          @click="onDelGroup(group, stage)"
                        )
                          svg-trash
                        //- метки
                        div(class="absolute bottom-0 left-1 py-1 pr-1 flex items-center justify-end text-center")
                          div(
                            class="text-[10px] text-copy-secondary rounded-3xl"
                            :class="group.group.type.id == 1 ? 'bg-green-200' : 'bg-red-200'"
                          )
                            div(class="px-1") {{ this.$i18n.locale == 'ru' ? group.group.type.name_ru : group.group.type.name_en }}
                        div(class="absolute bottom-0 right-1 text-sm") {{ getGroupSort(stage, stage_idx+1, group, group_idx+1) }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

var accum_group = 0
export default {
  name: 'workflow-default',
  data() {
    return {
      isLoadForRefresh: true,
      drag: false,
      sortData: {},
      sorting: {
        stages: [],
        groups: [],
        users: []
      },
    }
  },
  computed: {
    ...mapGetters({
      getLocales: 'localesSwitcherModule/getLocales',
      getIsLoadWorkflowDefault: 'workflowDefaultManagmentModule/getIsLoadWorkflowDefault',
      getWorkflowDefault: 'workflowDefaultManagmentModule/getWorkflowDefault'
    }),
    dragStage() {
      return {
        animation: 200,
        group: "stageDefault",
        disabled: false,
        ghostClass: "opacity-50"
      }
    },
    dragGroup() {
      return {
        animation: 200,
        group: "groupsDefault",
        disabled: false,
        ghostClass: "opacity-50"
      }
    },
  },
  methods: {
    ...mapActions({
      fetchWorkflowDefault: 'workflowDefaultManagmentModule/fetchWorkflowDefault'
    }),
    async onRefresh() {
      this.isLoadForRefresh = true
      setTimeout(() => { this.isLoadForRefresh = false }, 500)
      await this.fetchWorkflowDefault()
    },
    //- Логирование сортировки
    logStage(evt) {
      accum_group = 0
      this.sorting.stages = [], this.sorting.groups = [], this.sorting.users = []
    },
    logGroup(evt) {
      accum_group = 0
      this.sorting.stages = [], this.sorting.groups = [], this.sorting.users = []
    },
    //- Вычисление глобальных индексов сортировки стадий
    getStageSort(stage, s_idx) {
      //--
      this.sorting.stages.push({
        id: stage.id,
        name_en: stage.name_en,
        order_execution_stage: s_idx,
        hierarchy: s_idx
      })
      //--
      this.sortData[stage.id] = {
        id: stage.id,
        name_en: stage.name_en,
        order_execution_stage: s_idx,
        hierarchy: s_idx
      }
      return s_idx
    },
    //- Вычисление глобальных индексов сортировки групп
    getGroupSort(stage, s_idx, group, g_idx) {
      accum_group++
      // console.log(accum_group)
    },
    onGetSort() {
      console.log(this.sorting)
    }
  },
  async mounted() {
    setTimeout(() => { this.isLoadForRefresh = false }, 500)
    await this.fetchWorkflowDefault()
  }
}
</script>