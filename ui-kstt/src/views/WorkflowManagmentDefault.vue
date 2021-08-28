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
            div(v-if="stage.groups.length > 0")
              draggable(
                class="ml-14 min-h-[90px] w-[208px] border-4 border-[#9CA3FF] rounded-xl"
                v-model="stage.groups"
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
                    //- пользователи
                    div
                      draggable(
                        class="ml-8 min-h-[90px] w-[400px] border-4 border-[#9CA3FF] rounded-xl"
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
                            div(class="relative flex items-center justify-start border-dashed border-2 border-[#9CA3FF] rounded-lg min-h-[20px] w-[400px]")
                              div(class="w-[40px]")
                                svg-selector(class="handle cursor-move")
                              div(class="w-full pr-4")
                                div {{user.user.full_name}}
                                div(class="text-sm italic") {{user.user.position}}
                              div(class="absolute bottom-0 right-1 text-sm") {{ getUserSort(group, stage, stage_idx, group_idx, user_idx, user) }}
                              div(
                                class="absolute top-0 right-0 text-[#9CA3FF] hover:text-[#898ed2] duration-100 cursor-pointer"
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
import {
  mapGetters,
  mapActions
} from 'vuex'
import toast from '@/mixins/toast'

let accum_group = 0, accum_user = 0, counter_user = 0;
export default {
  name: 'workflow-default',
  mixins: [toast],
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
      modalCfg: {
        modalShow: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getLocales: 'localesSwitcherModule/getLocales',
      getIsLoadWorkflowDefault: 'workflowDefaultManagmentModule/getIsLoadWorkflowDefault',
      getWorkflowDefault: 'workflowDefaultManagmentModule/getWorkflowDefault',
      getAllGroupInWorkflow: 'workflowDefaultManagmentModule/getAllGroupInWorkflow',
      getAllUsersInWorkflow: 'workflowDefaultManagmentModule/getAllUsersInWorkflow',
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
    dragUser() {
      return {
        animation: 200,
        group: "userDefault",
        disabled: false,
        ghostClass: "opacity-50"
      }
    }
  },
  methods: {
    ...mapActions({
      fetchWorkflowDefault: 'workflowDefaultManagmentModule/fetchWorkflowDefault',
      setDefaultSortWorkflowElement: 'workflowDefaultManagmentModule/setDefaultSortWorkflowElement',
      defCorrectStageGroup: 'workflowDefaultManagmentModule/defCorrectStageGroup',
      defUpdateGroupType: 'workflowDefaultManagmentModule/defUpdateGroupType'
    }),
    async onRefresh() {
      this.isLoadForRefresh = true
      setTimeout(() => { this.isLoadForRefresh = false }, 500)
      await this.fetchWorkflowDefault()
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.setDefaultSortWorkflowElement(this.sorting) }, 0)
    },
    //- Логирование сортировки
    logStage(evt) {
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.setDefaultSortWorkflowElement(this.sorting) }, 0)
    },
    logGroup(evt) {
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.setDefaultSortWorkflowElement(this.sorting) }, 0)
    },
    logUser(evt) {
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.setDefaultSortWorkflowElement(this.sorting) }, 0)
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
      //--
      this.sorting.groups.push({
        id: group.id,
        code: group.group.code,
        order_execution_group: accum_group,
        hierarchy: s_idx+'.'+g_idx,
        stage_id: stage.id
      })
      //--
      this.sortData[stage.id][group.id] = {
        id: group.id,
        code: group.group.code,
        order_execution_group: accum_group,
        hierarchy: s_idx+'.'+g_idx,
        stage_id: stage.id
      }
      accum_user++
      group.users.forEach((user, user_idx) => {
        counter_user++
        if(group.group.type_id === 2) accum_user = accum_user + user_idx
        const hierarchy = this.getUserOrder(group, s_idx-1, g_idx-1, user_idx)
        this.sortData[stage.id][group.id][user.id] = {
          id: user.id,
          email: user.user.email,
          order_execution_user: accum_user,
          hierarchy: hierarchy,
          stage_id: stage.id,
          group_id: group.id
        }
        this.sorting.users.push({
          id: user.id,
          email: user.user.email,
          order_execution_user: accum_user,
          hierarchy: hierarchy,
          stage_id: stage.id,
          group_id: group.id
        })
      })
      if(accum_group === this.getAllGroupInWorkflow.length) accum_group = 0
      return (s_idx+'.'+g_idx)+' ('+this.sortData[stage.id][group.id].order_execution_group+')'
    },
    //- Вычисление глобальных индексов сортировки пользователей
    getUserSort(group, stage, stage_idx, group_idx, user_idx, user) {
      if(counter_user === this.getAllUsersInWorkflow.length) {
        accum_user = 0
        counter_user = 0
      }
      return this.sortData[stage.id][group.id][user.id].hierarchy+' ('+this.sortData[stage.id][group.id][user.id].order_execution_user+')'
    },
    getUserOrder(group, stage_idx, group_idx, user_idx) {
      if(group.group.type_id === 2) {
        return `${stage_idx+1}.${group_idx+1}.${user_idx+1}`
      } else {
        return `${stage_idx+1}.${group_idx+1}.${1}`
      }
    },
    // Добавление группы в стадию
    onAddGroup(stage) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('manager-stage-group', { stage: this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }),
        component: 'def-add-group-in-stage',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[80%] sm:h-[70%] lg:h-4/6 ',
        tmpGroupCheck: [],
        data: {
          type: 'def-add-group-in-stage',
          stage: stage,
          group: null
        }
      }
    },
    // Редактирование типа группы
    onEditGroup(stage, group) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('edit-group', { group: this.$i18n.locale == 'ru' ? group.group.name_ru : group.group.name_en, stage: this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en }),
        component: 'def-edit-group-in-stage',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]',
        data: {
          type: 'def-edit-group-in-stage',
          stage: stage,
          group: group,
          cascade: false
        }
      }
    },
    // Удаление единичной группы из стадии
    async onDelGroup(group, stage) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('delete-confirm', {
          group: this.$i18n.locale == 'ru' ? group.group.name_ru : group.group.name_en, stage: this.$i18n.locale == 'ru' ? stage.name_ru : stage.name_en 
        }),
        component: 'delete-group-in-stage',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]'
      }
      const params = {
        group: [{
          id: group.id,
          code: group.group.code,
          check: false,
          stage_id: stage.id
        }],
        stage_id: stage.id
      }
      this.modalCfg.tmpDelGroup = params
    },
    // Исключить пользователя из группы
    onDelUser(group_id, user_id) {
      console.log('group_id: '+group_id+' user_id: '+user_id);
    },
    closeModal() {
      this.modalCfg.modalShow = false
    },
    async saveAndCloseModal() {
      if(this.modalCfg.component === 'def-add-group-in-stage') {
        const params = {
          group: this.modalCfg.tmpGroupCheck,
          stage_id: this.modalCfg.tmpGroupCheck[0].stage_id
        }
        await this.defCorrectStageGroup(params)
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
          stage_id: this.modalCfg.tmpDelGroup.stage_id
        }
        await this.defCorrectStageGroup(params)
          .then((data) => {
            if(data.success) {
              this.onToast('success', this.$t('success'))
            } else {
              this.onToast('danger', this.$t('error'), data.message)
            }
          })
      }
      if(this.modalCfg.component === 'def-edit-group-in-stage') {
        const params = {
          group_id: +this.modalCfg.data.group.id,
          group_type: +this.modalCfg.data.group.group.type_id,
          stage_id: +this.modalCfg.data.stage.id,
          cascade: this.modalCfg.data.cascade
        }
        await this.defUpdateGroupType(params)
        .then((data) => {
            if(data.success) {
              this.onToast('success', this.$t('success'))
            } else {
              this.onToast('danger', this.$t('error'), data.message)
            }
        })
      }
      this.closeModal()
      counter_user = 0
      accum_group = 0
      accum_user = 0
      this.sorting.stages = [], this.sorting.groups = [], this.sorting.users = []
      setTimeout(() => { this.onRefresh() }, 0)
    }
  },
  async mounted() {
    setTimeout(() => { this.isLoadForRefresh = false }, 500)
    await this.fetchWorkflowDefault()
  }
}
</script>