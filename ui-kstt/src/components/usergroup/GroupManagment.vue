<template lang="pug">
div.relative
  div(class="flex min-w-[920px] pr-2 text-center items-center bg-background-primary rounded-md")
    div(class="min-w-[100px]") #
    div(class="min-w-[180px] px-8") {{ $t('stage-agreement') }}
    div(class="min-w-[230px] px-8") {{ $t('groups') }}
    div(class="min-w-[400px] px-8") {{ $t('participants') }}
    div(class="w-full px-8")
  //- стадии
  draggable(
    class="relative"
    v-model="getStageWorkflowList"
    tag="transition-group"
    :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
    v-bind="dragStage"
    group="stage"
    :disabled="true"
    handle=".handle"
    @start="drag=true"
    @end="drag=false"
    item-key="id"
  )
    template(#item="{element: stage, index: stage_idx}")
      div(class="p-1 flex mb-6 even:bg-background-primary rounded-md min-w-[920px]")
        div(class="h-hull flex items-center px-8 text-[50px] font-bold opacity-40 select-none")
          span {{ stage_idx+1 }}
        div.flex
          div(class="flex items-center justify-start text-center border-4 border-[#9CA3FF] min-h-[80px] w-[180px]")
            div(class="w-[40px]")
            //-   svg-selector(class="handle cursor-move")
            div(class="w-full pr-8") {{stage.name_ru}}
        //- группы
        div
          draggable(
            class="ml-4 min-h-[80px] w-[208px] border-4 border-[#9CA3FF]"
            v-model="stage.group"
            tag="transition-group"
            :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
            v-bind="dragGroup"
            :group="`group_${stage.id}`"
            handle=".handle"
            @start="drag=true"
            @end="drag=false"
            item-key="id"
            @change="logGroup"
            :move="moveGroup"
          )
            template(#item="{element: group, index: group_idx}")
              div(class="flex mb-2 last:mb-0")
                div.flex
                  div(class="relative flex items-center justify-start text-center border-dashed border-2 border-[#9CA3FF] min-h-[80px] w-[200px]")
                    div(class="w-[40px]")
                      svg-selector(class="handle cursor-move")
                    div(class="w-full pr-4") {{group.name_ru}}
                    div(class="absolute bottom-0 right-1") {{ stage_idx+1 }}.{{ group_idx+1 }}
                //- пользователи
                div
                  draggable(
                    class="ml-4 min-h-[80px] w-[400px] border-4 border-[#9CA3FF]"
                    v-model="group[getProp(group)]"
                    tag="transition-group"
                    :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                    v-bind="dragUser"
                    :group="`user_${group.id}`"
                    handle=".handle"
                    @start="drag=true"
                    @end="drag=false"
                    item-key="id"
                    @change="logUser"
                  )
                    template(#item="{element: user, index: user_idx}")
                      div(class="flex mb-1 last:mb-0")
                        div(class="relative flex items-center justify-start border-dashed border-2 border-[#9CA3FF] min-h-[20px] w-[400px]")
                          div(class="w-[40px]")
                            svg-selector(class="handle cursor-move")
                          div(class="w-full pr-4") {{user.full_name}}
                          div(class="absolute bottom-0 right-1") {{ getUserOrder(group, stage_idx, group_idx, user_idx) }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'group-managment',
  data() {
    return {
      drag: false,
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
      },
    }
  },
  computed: {
    ...mapGetters({
      getStageWorkflow: 'usergroupModule/getStageWorkflow',
      getIsLoadStageWorkflow: 'usergroupModule/getIsLoadStageWorkflow',
      getLocales: 'localesSwitcherModule/getLocales',
      getKs3ByWfId: 'usergroupModule/getKs3ByWfId',
    }),
    dragStage() {
      return {
        animation: 200,
        group: "stage",
        disabled: false,
        ghostClass: "opacity-50"
      }
    },
    dragGroup() {
      return {
        animation: 200,
        group: "groups",
        disabled: false,
        ghostClass: "opacity-50"
      }
    },
    dragUser() {
      return {
        animation: 200,
        group: "user",
        disabled: false,
        ghostClass: "opacity-50"
      }
    },
    getStageWorkflowList: {
      get() {
        return this.getStageWorkflow
      },
      set(value) {
        value.forEach((i, idx) => {
          console.log(`${idx+1} - order: ${i.order_execution_stage} : ${i.name_ru}`)
        })
        // this.$store.commit('updateList', value)
      }
    }
  },
  async mounted() {
    await this.fetchStageWorkflow({ type: '', workflow_id: this.$route.params.workflow_id })
  },
  methods: {
    ...mapActions({
      fetchStageWorkflow: 'usergroupModule/fetchStageWorkflow'
    }),
    getProp(element) {
      return element.user ? 'user' : 'users'
    },
    async onRefreshConnect() {
      await this.onConnection()
    },
    logGroup: function(evt) {
      console.log(evt);
    },
    logUser: function(evt) {
      console.log(evt);
    },
    moveGroup(e) {
      // console.log(e.draggedContext.futureIndex);
    },
    getUserOrder(group, stage_idx, group_idx, user_idx) {
      if(group.type_id === 2) {
        return `${stage_idx+1}.${group_idx+1}.${user_idx+1}`
      } else {
        return `${stage_idx+1}.${group_idx+1}.${1}`
      }
    }
  }
}
</script>