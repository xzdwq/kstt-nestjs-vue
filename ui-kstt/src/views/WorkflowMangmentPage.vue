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
    div(class="flex w-full justify-center")
      div {{ $t('approval-route', {document_number:getKs3ByWfId[0]?.document_number}) }}
  //- component
  div(class="relative h-[calc(100vh-130px)] overflow-scroll break-words bg-background-secondary rounded mt-2 mb-2 p-2 w-full")
    div(class="flex min-w-[980px] pr-2 text-center items-center bg-background-primary rounded-md")
      div(class="min-w-[100px]") #
      div(class="min-w-[180px] px-8") {{ $t('stage-agreement') }}
      div(class="min-w-[310px] px-8") {{ $t('groups') }}
      div(v-if="!hiddenUser" class="min-w-[350px] px-8") {{ $t('participants') }}
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
              span {{ getStageSort(stage, stage_idx+1) }}
            div.flex
              div(
                :ref="`stage_${stage_idx}`"
                class="relative flex items-center justify-start text-center border-4 border-[#85adc5] rounded-xl min-h-[90px] w-[180px]"
              )
                div(class="w-[40px]")
                //-   svg-selector(class="handle cursor-move")
                div(class="w-full pr-8") {{ this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }}
                div(
                  v-if="stage.code !== 'project' && stage.code !== 'ks3_complited'"
                  class="absolute right-0 top-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer"
                  @click="onAddGroup(stage)"
                )
                  svg-view-grid-plus
            //- Тип подписания
            draggable(
              class="ml-2 w-auto"
              v-model="stage.types"
              tag="transition-group"
              :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
              v-bind="dragType"
              :group="`type_${stage.id}`"
              handle=".handle"
              @start="drag=true"
              @end="drag=false"
              item-key="id"
              @change="logType"
            )
              template(#item="{element: type, index: type_idx}")
                div(
                  class="flex w-full mb-1 last:mb-0 rounded-lg"
                  :class="{'bg-green-200': type.type_id === 1, 'bg-red-200': type.type_id === 2, 'bg-yellow-200': type.type_id === 3}"
                )
                  div(
                    class="flex w-full text-gray-600 rounded-bl-lg border-[#85adc5]"
                  )
                    div(
                      class="relative flex items-center justify-start text-center"
                    )
                      div(class="w-[70px]")
                        svg-selector(class="handle cursor-move")
                      //- toolbar
                      div(class="absolute top-0 left-0 ")
                        ctx-menu(
                          class="absolute top-0 left-0 text-[#85adc5] hover:text-[#898ed2]"
                          listAlign="right"
                          listWidthClass="w-[220px]"
                        )
                          template(v-slot:icon)
                            svg-dots-vertical
                          template(v-slot:items)
                            div(
                              class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                              @click="onAddGroup(stage, type)"
                            )
                              svg-view-grid-plus
                              span {{ $t('add-group') }}
                            div(
                              class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                              @click="onEditType(stage, type)"
                            )
                              svg-pencilalt
                              span {{ $t('sign-type') }}
                            div(
                              class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                              @click="onDelType(stage, type)"
                            )
                              svg-trash
                              span {{ $t('del-block-group') }}
                      div(class="absolute bottom-5 left-[2px] text-sm w-[90px] overflow-hidden whitespace-nowrap truncate") {{ this.$i18n.locale == 'ru' ? type.type.name_ru : type.type.name_en }}
                      div(class="absolute bottom-0 left-1 text-sm") {{ getTypeSort(stage, stage_idx+1, type, type_idx+1) }}
                  //- группы
                  div(v-if="type.groups.length > 0")
                    draggable(
                      class="ml-6 min-h-[90px] w-[208px] border-4 border-[#85adc5] rounded-xl text-gray-700"
                      v-model="type.groups"
                      tag="transition-group"
                      :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                      v-bind="dragGroup"
                      :group="`group_${stage.id}_${type.id}`"
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
                              class="relative flex items-center justify-start text-center border-dashed border-2 border-[#85adc5] rounded-lg min-h-[90px] w-[200px]"
                            )
                              div(class="w-[40px]")
                                svg-selector(class="handle cursor-move")
                              div(class="w-full pr-4") {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
                              //- toolbar
                              div(
                                class="absolute top-0 right-7 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                                @click="onAddUserGroup(stage, type, group)"
                              )
                                svg-user-plus
                              //- div(
                              //-   class="absolute top-0 right-7 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                              //-   @click="onEditGroup(stage, group)"
                              //- )
                              //-   svg-pencilalt
                              div(
                                class="absolute top-0 right-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                                @click="onDelGroup(group, stage, type)"
                              )
                                svg-trash
                              //- метки
                              div(class="absolute bottom-0 left-1 py-1 pr-1 flex items-center justify-end text-center")
                                div(
                                  class="text-[10px] text-copy-secondary rounded-3xl bg-green-200"
                                )
                                  div(class="px-1") {{ this.$i18n.locale == 'ru' ? group.side.name_ru : group.side.name_en }}
                              div(class="absolute bottom-0 right-1 text-sm") {{ getGroupSort(stage, stage_idx+1, type, type_idx+1, group, group_idx+1) }}
                          //- пользователи
                          div(v-if="!hiddenUser")
                            draggable(
                              class="ml-8 min-h-[90px] w-[400px] border-4 border-[#85adc5] rounded-xl text-copy-primary"
                              v-model="group.users"
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
                                  div(class="relative flex items-center justify-start border-dashed border-2 border-[#85adc5] rounded-lg min-h-[20px] w-[400px]")
                                    div(class="w-[40px]")
                                      svg-selector(class="handle cursor-move")
                                    div(class="w-full pr-4")
                                      div {{user.full_name}}
                                      div(class="text-sm italic w-4/5 overflow-hidden whitespace-nowrap truncate") {{user.position || '-'}}
                                    div(class="absolute bottom-0 right-1 text-sm") {{ getUserSort(group, stage, stage_idx, group_idx, user_idx, user, type, type_idx) }}
                                    div(
                                      class="absolute top-0 right-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer"
                                      @click="onDelUser(user, group, group.id, user.id)"
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
let accum_type = 0, counter_type = 0, accum_group = 0, accum_user = 0, counter_group = 0, counter_user = 0;
import {
  mapGetters,
  mapActions
} from 'vuex'
import axios from "axios"
import toast from '@/mixins/toast'
export default {
  name: 'wf-managment',
  mixins: [toast],
  data() {
    return {
      hiddenUser: false,
      sortData: {},
      sorting: {
        workflow_id: +this.$route.params.workflow_id,
        stages: [],
        types: [],
        groups: [],
        users: []
      },
      drag: false,
      isLoadForRefresh: true,
      sort: {},
      modalCfg: {
        modalShow: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getStageWorkflow: 'workflowManagmentModule/getStageWorkflow',
      getIsLoadStageWorkflow: 'workflowManagmentModule/getIsLoadStageWorkflow',
      getLocales: 'localesSwitcherModule/getLocales',
      getKs3ByWfId: 'workflowManagmentModule/getKs3ByWfId',
      getAllTypesInWorkflow: 'workflowManagmentModule/getAllTypesInWorkflow',
      getAllGroupsInWorkflowStage: 'workflowManagmentModule/getAllGroupsInWorkflowStage',
      getAllUsersInWorkflowStage: 'workflowManagmentModule/getAllUsersInWorkflowStage'
    }),
    dragStage() {
      return {
        animation: 200,
        group: "stage",
        disabled: false,
        ghostClass: "opacity-50"
      }
    },
    dragType() {
      return {
        animation: 200,
        group: "type",
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
  },
  methods: {
    ...mapActions({
      fetchStageWorkflow: 'workflowManagmentModule/fetchStageWorkflow',
      setSortWorkflowElement: 'workflowManagmentModule/setSortWorkflowElement',
      correctStageGroup: 'workflowManagmentModule/correctStageGroup',
      updateGroupType: 'groupModule/updateGroupType',
      updateType: 'workflowManagmentModule/updateType'
    }),
    getStageSort(stage, s_idx) {
      //--
      this.sorting.stages.push({
        id: stage.id,
        name_en: stage.name_en,
        order_execution_stage: stage.order_execution_stage,
        hierarchy: stage.hierarchy,
        workflow_id: this.sorting.workflow_id
      })
      //--
      this.sortData[stage.id] = {
        id: stage.id,
        name_en: stage.name_en,
        order_execution_stage: stage.order_execution_stage,
        hierarchy: stage.hierarchy,
        workflow_id: this.$route.params.workflow_id
      }
      // Считаем типы
      accum_type = 0
      stage.types.forEach((type, t_idx) => {
        counter_type++
        if(type.type_id != 3) accum_type++
        //--
        this.sorting.types.push({
          id: type.id,
          order_execution_type: type.type_id != 3 ? accum_type : 0,
          hierarchy: type.type_id != 3 ? s_idx+'.'+accum_type : s_idx+'.0',
          stage_id: stage.id
        })
        //--
        this.sortData[stage.id][type.id] = {
          id: type.id,
          order_execution_type: type.type_id != 3 ? accum_type : 0,
          hierarchy: type.type_id != 3 ? s_idx+'.'+accum_type : s_idx+'.0',
          stage_id: stage.id
        }
        // считаем индекс групп
        if(type.type_id != 3) accum_group++
        type.groups.forEach((group, g_idx) => {
          counter_group++
          let hierarchy
          if(type.type.id === 2) {
            hierarchy = `${s_idx}.${accum_type}.${g_idx+1}`
            if(g_idx === 0) { accum_group = accum_group + g_idx }
            else { accum_group = accum_group + 1 }
          } else if(type.type.id === 3) {
            hierarchy = s_idx+'.0.0'
            accum_group = 0
          } else {
            hierarchy = `${s_idx}.${accum_type}.${1}`
          }
          this.sorting.groups.push({
            id: group.id,
            code: group.code,
            order_execution_group: accum_group,
            hierarchy: hierarchy,
            stage_id: stage.id,
            type_id: type.id
          })
          this.sortData[stage.id][type.id][group.id] = {
            id: group.id,
            code: group.code,
            order_execution_group: accum_group,
            hierarchy: hierarchy,
            stage_id: stage.id,
            type_id: type.id
          }
          if(type.type_id != 3) accum_user++
          group.users.forEach((user, u_idx) => {
            counter_user++
            // т.к. сортировка пользователей не имеет значения, потому что если их несколько, то в учет идет только первый успешвий, то просто перенимаем порядок из группы
            accum_user = this.sortData[stage.id][type.id][group.id].order_execution_group
            const hierarchy = this.sortData[stage.id][type.id][group.id].hierarchy+'.'+(type.type.id === 3 ? 0 : 1)
            this.sortData[stage.id][type.id][group.id][user.id] = {
              id: user.id,
              email: user.email,
              order_execution_user: accum_user,
              hierarchy: hierarchy,
              stage_id: stage.id,
              type_id: type.id,
              group_id: group.id
            }
            this.sorting.users.push({
              id: user.id,
              email: user.email,
              order_execution_user: accum_user,
              hierarchy: hierarchy,
              stage_id: stage.id,
              type_id: type.id,
              group_id: group.id
            })
          })
        })
      })
      return stage.order_execution_stage
    },
    getTypeSort(stage, s_idx, type, t_idx) {
      if(counter_type === this.getAllTypesInWorkflow.length) {
        counter_type = 0
        accum_type = 0
      }
      return this.sortData[stage.id][type.id].hierarchy+' ('+this.sortData[stage.id][type.id].order_execution_type+')'
    },
    getGroupSort(stage, s_idx, type, t_idx, group, g_idx) {
      if(counter_group === this.getAllGroupsInWorkflowStage.length) {
        accum_group = 0
        counter_group = 0
      }
      return this.sortData[stage.id][type.id][group.id].hierarchy+' ('+this.sortData[stage.id][type.id][group.id].order_execution_group+')'
    },
    getUserSort(group, stage, stage_idx, group_idx, user_idx, user, type, t_idx) {
      if(counter_user === this.getAllUsersInWorkflowStage.length) {
        accum_user = 0
        counter_user = 0
        accum_group = 0
        counter_group = 0
      }
      return this.sortData[stage.id][type.id][group.id][user.id].hierarchy+' ('+this.sortData[stage.id][type.id][group.id][user.id].order_execution_user+')'
    },
    logType(evt) {
      accum_type = 0
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.types = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.setSortWorkflowElement(this.sorting) }, 0)
    },
    logGroup(evt) {
      accum_type = 0
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.types = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.setSortWorkflowElement(this.sorting) }, 0)
    },
    logUser(evt) {
      accum_type = 0
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.types = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.setSortWorkflowElement(this.sorting) }, 0)
    },
    onAddGroup(stage, type) {
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
          type: type,
          group: null
        }
      }
    },
    // Редактирование типа подписания групп
    onEditType(stage, type) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('type-signing'),
        component: 'edit-group-in-stage',
        workflow_id: this.$route.params.workflow_id,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]',
        data: {
          type: 'edit-group-in-stage',
          stage: stage,
          type: type,
          cascade: false
        },
        typeTmp: type.type_id
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
    // Удаление единичной группы из стадии
    async onDelGroup(group, stage, type) {
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
          stage_id: stage.id
        }],
        stage_id: stage.id,
        workflow_id: this.$route.params.workflow_id,
        type_id: type.id
      }
      this.modalCfg.tmpDelGroup = params
    },
    // Удаление типа со всеми вложенными группами
    onDelType(stage, type) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('delete-all-group-in-type', {
          stage: this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en,
          type: this.$i18n.locale == 'ru' ? type.type.name_ru : type.type.name_en
        }),
        component: 'delete-group-in-stage',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]',
        type_id: type.id
      }
      let group = []
      type.groups.forEach(i => {
        group.push({
          id: i.id,
          code: i.code,
          check: false,
          stage_id: i.stage_id,
          type_id: i.type_id
        })
      })
      const params = {
        workflow_id: +this.$route.params.workflow_id,
        stage_id: stage.id,
        type_id: type.id,
        group: group
      }
      this.modalCfg.tmpDelGroup = params
    },
    // Добавление пользователя в группу
    onAddUserGroup(stage, type, group) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('add-user-in-group', {group:this.$i18n.locale == 'ru' ? group.name_ru : group.name_en}),
        component: 'add-user-in-group',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[60%]',
        workflow_id: +this.$route.params.workflow_id,
        data: {
          type: 'add-user-in-group',
          stage: stage,
          type, type,
          group: group
        }
      }
    },
    // Исключить пользователя из группы
    onDelUser(user, group, group_id, user_id) {
      this.modalCfg = {
        user_del_in_group: true,
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('delete-user-confirm', {
          user: user.full_name, group: this.$i18n.locale == 'ru' ? group.name_ru : group.name_en,
        }),
        component: 'delete-group-in-stage',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]'
      }
      const params = {
        _workflow_id: +this.$route.params.workflow_id,
        _stage_id: group.stage_id,
        _group_code: group.code,
        _group_id: group_id,
        _user_id: user_id
      }
      this.modalCfg.userDelInGroup = params
    },
    closeModal() {
      this.modalCfg.modalShow = false
    },
    async saveAndCloseModal() {
      if(this.modalCfg.component === 'add-group-in-stage') {
        const params = {
          group: this.modalCfg.tmpGroupCheck,
          stage_id: this.modalCfg.tmpGroupCheck[0].stage_id,
          workflow_id: +this.modalCfg.workflow_id,
          type_id: this.modalCfg.tmpGroupCheck[0].type_id
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
      if(
        this.modalCfg.component === 'delete-group-in-stage'
        && this.modalCfg.type_id
        && !this.modalCfg.user_del_in_group
      ) {
        const params = {
          group: this.modalCfg.tmpDelGroup.group,
          stage_id: this.modalCfg.tmpDelGroup.stage_id,
          workflow_id: this.modalCfg.tmpDelGroup.workflow_id,
          type_id: this.modalCfg.tmpDelGroup.type_id
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
      // Удаление единичной группы
      if(
        this.modalCfg.component === 'delete-group-in-stage'
        && !this.modalCfg.type_id
        && !this.modalCfg.user_del_in_group
      ) {
        const params = {
          group: this.modalCfg.tmpDelGroup.group,
          stage_id: this.modalCfg.tmpDelGroup.stage_id,
          workflow_id: this.modalCfg.tmpDelGroup.workflow_id,
          type_id: this.modalCfg.tmpDelGroup.type_id
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
          stage_id: +this.modalCfg.data.stage.id,
          type_id: +this.modalCfg.data.type.id,
          subtype_id: +this.modalCfg.typeTmp,
          workflow_id: +this.$route.params.workflow_id,
          cascade: this.modalCfg.data.cascade
        }
        await this.updateType(params)
        .then((data) => {
          if(data.success) {
            this.onToast('success', this.$t('success'))
          } else {
            this.onToast('danger', this.$t('error'), data.message)
          }
        })
      }
      // Добавление пользователя в группу
      if(this.modalCfg.component === 'add-user-in-group') {
        const params = {
          workflow_id: +this.modalCfg.workflow_id,
          group_id: +this.modalCfg.data.group.id,
          stage_id: +this.modalCfg.data.stage.id,
          type_id: +this.modalCfg.data.type.id,
          group_code: this.modalCfg.data.group.code,
          add_users: this.modalCfg.tmpAddUser
        }
        await axios.post('api/workflow/addusergroupworkflow', {
          params
        })
        .then((data) => {
          if(data?.data?.success) {
            this.onToast('success', this.$t('success'))
          } else {
            this.onToast('danger', this.$t('error'))
          }
        })
      }
      // Удаление пользователя из группы
      if(this.modalCfg.component === 'delete-group-in-stage' && this.modalCfg.user_del_in_group) {
        await axios.delete('api/workflow/delusergroupworkflow', {
          params: this.modalCfg.userDelInGroup
        })
      }
      this.closeModal()
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.onRefresh() }, 0)
      // await this.onRefresh()
    },
    async onRefresh() {
      this.isLoadForRefresh = true
      setTimeout(() => { this.isLoadForRefresh = false }, 500)
      await this.fetchStageWorkflow({ type: 'reload', workflow_id: this.$route.params.workflow_id })
      accum_type = 0
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.types = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.setSortWorkflowElement(this.sorting) }, 0)
    }
  },
  // watch: {
  //   getLocales() {
  //     setTimeout(() => { jsPlumbInstance.repaintEverything() }, 0)
  //   }
  // }
}
</script>