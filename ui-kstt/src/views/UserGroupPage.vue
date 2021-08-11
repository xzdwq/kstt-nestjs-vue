<template lang="pug">
div
  //- toolbar
  div(class="flex")
    def-button-back
    def-button(
        class="text-white bg-[#579bae] flex justify-between"
        @click="onRefreshUsergroup"
      )
        svg-refresh(:class="{'animate-spin z-0' : getIsLoadStageWorkflow || isLoadForRefresh}")
    def-button(
      :class="{'bg-background-secondary': activeGrid === 'grid'}"
      @click="onChancheViewGrid('grid')"
    )
      svg-view-grid
    def-button(
      :class="{'bg-background-secondary': activeGrid === 'list'}"
      @click="onChancheViewGrid('list')"
    )
      svg-view-list
  //- body
  //- загрузка схемы стадий согласования КС-3
  div(
    v-if="getIsLoadStageWorkflow"
    class="absolute w-[calc(100%-55px)] flex items-center justify-center mt-2"
  )
    svg-loading
    p {{ $t('ks3.get-stage-workflow') }}
  div(
    v-if="getStageWorkflow.length === 0 && !getIsLoadStageWorkflow"
    class="py-2"
  )
    p {{ $t('no-data') }}
  //- схема стадий согласования КС-3
  div(
    v-show="activeGrid == 'grid'"
    ref="usergroup_graph"
    class="break-words overflow-x-scroll bg-background-secondary rounded mt-2 mb-2 p-2 w-full h-full"
  )
    div(
      v-for="(stage, stage_idx) in getStageWorkflow"
      :key="stage_idx"
      class="flex min-w-[750px] mb-10"
    )
      div(class="relative grid w-1/5")
        div(
          :ref="`stage_${stage_idx}`"
          class="flex items-center justify-center text-center border-4 border-[#9CA3FF] min-h-[70px] min-w-[150px]"
        )
          div.w-full {{ this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }}
          div(
            class="absolute right-[-25px] top-0 text-[#9CA3FF] cursor-pointer"
          )
            svg-plus
        div(class="flex items-center justify-center w-full py-1 h-full")
          div(
            v-if="stage.id < getStageWorkflow.length"
            class="w-[2px] bg-transparent min-h-[20px] h-full rounded-md"
          )
      div(class="w-full ml-20")
        div(
          v-for="(group, group_idx) in stage?.group"
          :key="`${stage_idx}_${group_idx}`"
          class="flex pb-2"
        )
          div(
            :ref="`group_${stage_idx}_${group_idx}`"
            class="flex items-center justify-center text-center border-4 border-[#9CA3FF] min-h-[70px] w-[200px]"
          )
            div {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
          div(
            class="pl-1 pt-1 text-[#9CA3FF] cursor-pointer"
          )
            svg-user-plus
          div(
            :ref="`user_${stage_idx}_${group_idx}`"
            class="mr-2 p-2 ml-20 w-[300px] flex items-center border-4 border-[#9CA3FF] rounded-md"
          )
            div(v-if="group?.user" class="w-full")
              div(
                v-for="(user, user_idx) in group.user"
                :key="`${stage_idx}_${group_idx}_${user_idx}`"
                class="flex justify-between w-full"
              )
                div {{ user_idx + 1 }}. {{ user.full_name }}
                div(class="text-[#9CA3FF] cursor-pointer")
                  svg-user-minus
  //- схема управления группами и пользователями
  div(
    v-show="activeGrid == 'list'"
    class="break-words overflow-x-scroll bg-background-secondary rounded mt-2 mb-2 p-2 w-full h-full"
  )
</template>
<script>
var jsPlumbInstance;

import { jsPlumb } from "jsplumb";
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'user-group-page',
  data() {
    return {
      isLoadForRefresh: true,
      activeGrid: 'grid',
      defaultJsPlumbSettings: {
        Connector: ['Flowchart', {
          alwaysRespectStubs: true,
          midpoint: 0.2,
          stub: [10, 15],
          cornerRadius: 20
        } ],
        PaintStyle: {
          stroke: '#9CA3FF',
          strokeWidth: 2
        },
        EndpointStyles: [{ fill: '#9CA3FF' }, { fill: '#9CA3FF' }],
        HoverPaintStyle: { stroke: 'red' },
        EndpointHoverStyle: { fill: 'red' }
      }
    }
  },
  computed: {
    ...mapGetters({
      getStageWorkflow: 'ks3idModule/getStageWorkflow',
      getIsLoadStageWorkflow: 'ks3idModule/getIsLoadStageWorkflow',
      getActiveStageWorkflow: 'ks3idModule/getActiveStageWorkflow',
    })
  },
  methods: {
    ...mapActions({
      fetchStageWorkflow: 'ks3idModule/fetchStageWorkflow'
    }),
    async onRefreshUsergroup() {
      this.isLoadForRefresh = true
      setTimeout(() => { this.isLoadForRefresh = false }, 500)
      if(this.activeGrid === 'grid') {
        jsPlumbInstance.deleteEveryConnection();
        await this.fetchStageWorkflow('reload')
        await this.onConnection()
      }
    },
    onChancheViewGrid(type) {
      if(this.activeGrid != type) {
        this.activeGrid = type
      }
    },
    async onConnection() {
      await jsPlumb.ready(() => {
        const usergroup_graph = this.$refs.usergroup_graph;
        jsPlumbInstance = jsPlumb.getInstance({
          ...this.defaultJsPlumbSettings
        });

        jsPlumbInstance.setContainer(usergroup_graph);

        // jsPlumbInstance.deleteEveryConnection();

        this.getStageWorkflow.forEach((stage, stage_idx) => {
          if(stage?.group) {
            stage.group.forEach((group, group_idx) => {
              // Связь стадия - группа
              jsPlumbInstance.connect({
                source: this.$refs[`stage_${stage_idx}`],
                target: this.$refs[`group_${stage_idx}_${group_idx}`],
                endpoints: [ [ 'Dot', { radius: 5 } ], [ 'Dot', { radius: 5 } ] ],
                anchors:[
                  [ "Right" ],
                  [ "Left" ]
                ]
              })
              // Связь группа - пользователь
              if(group?.user) {
                jsPlumbInstance.connect({
                  source: this.$refs[`group_${stage_idx}_${group_idx}`],
                  target: this.$refs[`user_${stage_idx}_${group_idx}`],
                  endpoints: [ [ 'Dot', { radius: 5 } ], [ 'Dot', { radius: 5 } ] ],
                  anchors:[
                    [ "Right" ],
                    [ "Left" ]
                  ]
                })
              }
            })
          }
        })

        window.onresize = () => { jsPlumbInstance.repaintEverything() };
        usergroup_graph.onscroll = () => { jsPlumbInstance.repaintEverything() };
      })
    }
  },
  async mounted() {
    setTimeout(() => { this.isLoadForRefresh = false }, 500)
    /**
     * Получаем список этапов workflow справки КС-3
     */
    await this.fetchStageWorkflow()
    /**
     * Отрисовка коннект-линий между блоками
     */
    await this.onConnection()
  },
}
</script>