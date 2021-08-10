<template lang="pug">
div
  //- toolbar
  div(class="flex")
    def-button-back
  //- body
  //- загрузка схемы стадий согласования КС-3
  div(
    v-if="getIsLoadStageWorkflow"
    class="absolute w-[calc(100%-55px)] flex items-center justify-center mt-2"
  )
    svg-loading
    p {{ $t('ks3.get-stage-workflow') }}
  //- схема стадий согласования КС-3
  div(
    ref="usergroup_graph"
    class="break-words overflow-x-scroll bg-background-secondary rounded mt-2 mb-2 p-2 w-full h-full"
  )
    div(v-for="stage in getStageWorkflow")
      div(class="flex min-w-[750px]")
        div(class="relative grid w-1/5")
          div(
            :ref="`stage_${stage.id}`"
            class="flex items-center justify-center text-center border-4 border-dotted border-gray-400 min-h-[70px] min-w-[150px]"
          )
            span {{ this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }}
          div(class="flex items-center justify-center w-full py-1 h-full")
            div(
              v-if="stage.id < getStageWorkflow.length"
              class="w-[2px] bg-gray-400 min-h-[20px] h-full rounded-md"
            )
        div(class="w-full items-center justify-center ml-20")
          div(v-for="group in stage?.group" class="flex pb-2")
            div(
              :ref="`group_${group.id}`"
              class="flex items-center justify-center text-center border-2 border-green-300 min-h-[70px] w-[200px]"
            )
              span {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
            div(class="w-full items-center justify-center border-2 border-red-300")
              div(v-if="group?.user")
                div(v-for="user in group.user")
                  div {{ user.full_name }}
</template>
<script>
import { jsPlumb } from "jsplumb";
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'user-group-page',
  data() {
    return {
      defaultJsPlumbSettings: {
        Connector: [
          "Flowchart", // 连线的类型，流程图 Flowchart、贝塞尔曲线 Bezier 等
          {
            alwaysRespectStubs: true,
            cornerRadius: 20,
            midpoint: 0.2,
            stub: [10, 15]
          }
        ],
        DragOptions: {
          cursor: "pointer",
          zIndex: 2000
        },
        PaintStyle: {
          stroke: "gray",
          strokeStyle: "gray",
          lineWidth: 2,
          radius: 5
        },
        EndpointStyle: {
          radius: 5,
          fill: "gray",
          fillStyle: "gray"
        },
        HoverPaintStyle: {
          stroke: "orange",
          strokeStyle: "orange"
        },
        EndpointHoverStyle: {
          fill: "orange",
          fillStyle: "orange"
        },
        ConnectionOverlays: [
          // 箭头样式
          [
            "Arrow",
            {
              location: 1
            },
            {
              foldback: 0.5,
              fill: "gray",
              fillStyle: "gray",
              width: 14
            }
          ]
        ]
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
    })
  },
  async mounted() {
    /**
     * Получаем список этапов workflow справки КС-3
     */
    await this.fetchStageWorkflow()
    jsPlumb.ready(() => {
      const jsPlumbInstance = jsPlumb.getInstance({
        ...this.defaultJsPlumbSettings
      });

      jsPlumbInstance.setContainer(this.$refs.usergroup_graph);

      jsPlumbInstance.connect({
          source: this.$refs.stage_1,
          target: this.$refs.group_1,
          endpoint: "Rectangle"
      })

      window.onresize = function() {
        jsPlumbInstance.repaintEverything();
      };
    })
  },
}
</script>