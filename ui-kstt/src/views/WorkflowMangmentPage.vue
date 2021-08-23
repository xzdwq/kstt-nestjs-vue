<template lang="pug">
div.relative
  //- toolbar
  div(class="flex items-center")
    def-button-back
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="onRefresh"
    )
      svg-refresh(:class="{'animate-spin z-0' : getIsLoadStageWorkflow || isLoadForRefresh}")
  //- component
  div(class="relative h-[calc(100vh-130px)] overflow-scroll break-words bg-background-secondary rounded mt-2 mb-2 p-2 w-full")
    div(class="flex min-w-[980px] pr-2 text-center items-center bg-background-primary rounded-md")
      div(class="min-w-[100px]") #
      div(class="min-w-[180px] px-8") {{ $t('stage-agreement') }}
      div(class="min-w-[310px] px-8") {{ $t('groups') }}
      div(class="min-w-[350px] px-8") {{ $t('participants') }}
      div(class="w-full px-8")
    div(
      ref="group_mangment"
      class="relative"
    )
      //- загрузка схемы стадий согласования КС-3
      div(
        v-if="getStageWorkflow.length === 0 && getIsLoadStageWorkflow"
        class="absolute z-10 w-[calc(100%-55px)] flex items-center justify-center mt-2"
      )
        svg-loading
        p {{ $t('ks3.get-stage-workflow') }}
      div(
        v-if="getStageWorkflow.length === 0 && !getIsLoadStageWorkflow"
        class="py-2"
      )
        p {{ $t('no-data') }}
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
          div(class="p-1 flex mb-6 even:bg-background-primary rounded-md min-w-[980px]")
            div(class="h-hull flex items-center px-8 text-[50px] font-bold opacity-40 select-none")
              span {{ stage_idx+1 }}
            div.flex
              div(
                :ref="`stage_${stage_idx}`"
                class="relative flex items-center justify-start text-center border-4 border-[#9CA3FF] min-h-[90px] w-[180px]"
              )
                div(class="w-[40px]")
                //-   svg-selector(class="handle cursor-move")
                div(class="w-full pr-8") {{ this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }}
                div(
                  class="absolute right-0 top-0 text-[#9CA3FF] cursor-pointer"
                  @click="onAddGroup(stage)"
                )
                  svg-view-grid-plus
            //- группы
            div(v-if="stage.group.length > 0")
              draggable(
                class="ml-14 min-h-[90px] w-[208px] border-4 border-[#9CA3FF]"
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
                      div(
                        :ref="`group_${stage_idx}_${group_idx}`"
                        class="relative flex items-center justify-start text-center border-dashed border-2 border-[#9CA3FF] min-h-[90px] w-[200px]")
                        div(class="w-[40px]"
                      )
                          svg-selector(class="handle cursor-move")
                        div(class="w-full pr-4") {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
                        //- toolbar
                        div(
                          class="absolute top-0 right-7 text-[#9CA3FF] cursor-pointer h-6"
                          @click="onEditGroup(stage, group)"
                        )
                          svg-pencilalt
                        div(
                          class="absolute top-0 right-0 text-[#9CA3FF] cursor-pointer h-6"
                          @click="onDelGroup(group, stage)"
                        )
                          svg-trash
                        //- метки
                        div(class="absolute bottom-0 left-1 py-1 pr-1 flex items-center justify-end text-center")
                          div(
                            class="text-[10px] text-copy-secondary rounded-3xl"
                            :class="group.type.id == 1 ? 'bg-green-200' : 'bg-red-200'"
                          )
                            div(class="px-1") {{ this.$i18n.locale == 'ru' ? group.type.name_ru : group.type.name_en }}
                        div(class="absolute bottom-0 right-1") {{ stage_idx+1 }}.{{ group_idx+1 }}
                    //- пользователи
                    div
                      draggable(
                        :id="`user_${stage_idx}_${group_idx}`"
                        class="ml-8 min-h-[90px] w-[400px] border-4 border-[#9CA3FF]"
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
                              div(class="w-full pr-4")
                                div {{user.full_name}}
                                div(class="text-sm italic") {{user.position}}
                              div(class="absolute bottom-0 right-1") {{ getUserOrder(group, stage_idx, group_idx, user_idx) }}
                              div(
                                class="absolute top-0 right-6 text-[#9CA3FF] cursor-pointer h-6"
                                @click="onAddUser(group.id)"
                              )
                                svg-user-plus
                              div(
                                class="absolute top-0 right-0 text-[#9CA3FF] cursor-pointer"
                                @click="onDelUser(group.id, user.id)"
                              )
                                svg-trash
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
</template>
<script>
var jsPlumbInstance;
import {
  mapGetters,
  mapActions
} from 'vuex'
import { jsPlumb } from "jsplumb";

import toast from '@/mixins/toast'

export default {
  name: 'wf-managment',
  mixins: [toast],
  data() {
    return {
      drag: false,
      isLoadForRefresh: true,
      modalCfg: {
        modalShow: false
      },
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
      getStageWorkflow: 'workflowManagmentModule/getStageWorkflow',
      getIsLoadStageWorkflow: 'workflowManagmentModule/getIsLoadStageWorkflow',
      getLocales: 'localesSwitcherModule/getLocales',
      getKs3ByWfId: 'workflowManagmentModule/getKs3ByWfId',
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
    setTimeout(() => { this.isLoadForRefresh = false }, 500)
    await this.fetchStageWorkflow({ type: '', workflow_id: this.$route.params.workflow_id })
    await this.onConnection()
  },
  methods: {
    ...mapActions({
      fetchStageWorkflow: 'workflowManagmentModule/fetchStageWorkflow',
      correctStageGroup: 'groupModule/correctStageGroup',
      updateGroupType: 'groupModule/updateGroupType'
    }),
    async onConnection() {
      await jsPlumb.ready(() => {
        const group_mangment = this.$refs.group_mangment;
        jsPlumbInstance = jsPlumb.getInstance({
          ...this.defaultJsPlumbSettings
        });
        jsPlumbInstance.setContainer(group_mangment);

        this.getStageWorkflowList.forEach((stage, stage_idx) => {
          //- Связь стадия - стадия
          if(stage_idx < (this.getStageWorkflowList.length - 1)) {
            jsPlumbInstance.connect({
              source: this.$refs[`stage_${stage_idx}`],
              target: this.$refs[`stage_${stage_idx+1}`],
              endpoints: [ [ 'Dot', { radius: 5 } ], [ 'Dot', { radius: 5 } ] ],
              anchors:[
                [ "Bottom" ],
                [ "Top" ]
              ]
            })
          }
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
              if(group?.user || group?.users) {
                jsPlumbInstance.connect({
                  source: this.$refs[`group_${stage_idx}_${group_idx}`],
                  target: document.getElementById(`user_${stage_idx}_${group_idx}`),
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
      })
    },
    getProp(element) {
      return element.user ? 'user' : 'users'
    },
    logGroup: function(evt) {
      console.log(evt);
      jsPlumbInstance.repaintEverything()
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
    },
    onAddGroup(stage) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('manager-stage-group', { stage: this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }),
        component: 'add-group-in-stage',
        workflow_id: this.$route.params.workflow_id,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[80%] sm:h-[70%] lg:h-4/6 ',
        tmpGroupCheck: [],
        data: {
          type: 'add-group-in-stage',
          stage: stage,
          group: null
        }
      }
    },
    onEditGroup(stage, group) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('edit-group', { group: this.$i18n.locale == 'ru' ? group.name_ru : group.name_en, stage: this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }),
        component: 'edit-group-in-stage',
        workflow_id: this.$route.params.workflow_id,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: this.$route.params.workflow_id ? 'h-[40%] ' : 'h-[30%]',
        data: {
          type: 'edit-group-in-stage',
          stage: stage,
          group: group,
          cascade: false
        }
      }
    },
    async onDelGroup(group, stage) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('delete-confirm', {
          group: this.$i18n.locale == 'ru' ? group.name_ru : group.name_en, stage: this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en 
        }),
        component: 'delete-group-in-stage',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]'
      }
      const params = {
        group: [{
          id: group.id,
          code: group.code,
          check: false,
          stage_id: stage.id,
          workflow_id: this.$route.params.workflow_id ? +this.$route.params.workflow_id : null
        }],
        stage_id: stage.id,
        workflow_id: this.$route.params.workflow_id ? +this.$route.params.workflow_id : null
      }
      this.modalCfg.tmpDelGroup = params
    },
    onAddUser(group_id) {
      console.log('group_id: '+group_id);
    },
    onDelUser(group_id, user_id) {
      console.log('group_id: '+group_id+' user_id: '+user_id);
    },
    closeModal() {
      this.modalCfg.modalShow = false
    },
    async saveAndCloseModal() {
      if(this.modalCfg.component === 'add-group-in-stage') {
        const params = {
          group: this.modalCfg.tmpGroupCheck,
          stage_id: this.modalCfg.tmpGroupCheck[0].stage_id,
          workflow_id: this.modalCfg.tmpGroupCheck[0].workflow_id
        }
        await this.correctStageGroup(params)
          .then((data) => {
            if(data.success) {
              this.onToast('success', this.$t('success'))
            } else {
              this.onToast('danger', this.$t('error'), data.message)
            }
          })
      }
      if(this.modalCfg.component === 'delete-group-in-stage') {
        const params = {
          group: this.modalCfg.tmpDelGroup.group,
          stage_id: this.modalCfg.tmpDelGroup.stage_id,
          workflow_id: this.modalCfg.tmpDelGroup.workflow_id
        }
        await this.correctStageGroup(params)
          .then((data) => {
            if(data.success) {
              this.onToast('success', this.$t('success'))
            } else {
              this.onToast('danger', this.$t('error'), data.message)
            }
          })
      }
      if(this.modalCfg.component === 'edit-group-in-stage') {
        const params = {
          group_id: +this.modalCfg.data.group.id,
          group_type: +this.modalCfg.data.group.type_id,
          stage_id: +this.modalCfg.data.stage.id,
          workflow_id: +this.$route.params.workflow_id || null,
          cascade: this.modalCfg.data.cascade
        }
        await this.updateGroupType(params)
      }
      this.closeModal()
      setTimeout(() => { this.onRefresh() }, 0)
    },
    async onRefresh() {
      this.isLoadForRefresh = true
      setTimeout(() => { this.isLoadForRefresh = false }, 500)
      jsPlumbInstance.deleteEveryConnection();
      await this.fetchStageWorkflow({ type: 'reload', workflow_id: this.$route.params.workflow_id })
      await this.onConnection()
    }
  },
  watch: {
    getLocales() {
      setTimeout(() => { jsPlumbInstance.repaintEverything() }, 0)
    }
  }
}
</script>