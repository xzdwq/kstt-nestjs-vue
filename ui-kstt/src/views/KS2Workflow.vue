<template lang="pug">
div.relative.h-full
  //- toolbar
  div(class="flex items-center")
    def-button-back
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="onRefresh"
    )
      svg-refresh(:class="{'animate-spin z-0' :isLoadForRefresh}")
    div(class="flex w-full justify-center")
      div {{ $t('ks2-approval-route', {document_number:ks2info?.document_number}) }}
  //- load
  div(v-if="!data[0]?.id && isLoad && isLoadForRefresh" class="mt-32 h-full w-[calc(100%-55px)] flex items-center justify-center")
    div(class="flex w-56 h-20 justify-center items-center bg-background-secondary rounded-md")
      svg-loading
      p {{ $t('loading') }}
  //- body
  div(v-else class="relative h-[calc(100vh-130px)] overflow-scroll break-words bg-background-secondary rounded mt-2 mb-2 p-2 w-full")
    //- Согласование
    div(v-if="data[0]" class="p-1 flex")
      div(class="relative flex items-center justify-start text-center border-4 border-[#85adc5] rounded-xl min-h-[90px] w-[185px]")
        div(class="w-full p-1 text-sm") {{ $t(data[0]?.code) }}
        div(
          v-if="!ks2wfApproveStarted && !ks2wfApproveCompile"
          class="absolute right-0 top-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer"
          @click="onAddGroup(data[0])"
        )
          svg-view-grid-plus
      //- Тип подписания
      draggable(
        class="relative p-1"
        v-model="data[0].ks2_types"
        tag="transition-group"
        :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
        v-bind="ks2_dragType"
        group="ks2_type_approve"
        handle=".handle"
        @start="drag=true"
        @end="drag=false"
        item-key="id"
        @change="logType"
      )
        template(#item="{element: type, index: type_idx}")
          div(
            class="flex w-full mb-1 last:mb-0 rounded-lg min-h-[100px] min-w-[300px]"
            :class="{'bg-green-200': type.type_id === 1, 'bg-red-200': type.type_id === 2, 'bg-yellow-200': type.type_id === 3}"
          )
            div(
              class="flex w-full text-gray-600 rounded-bl-lg border-[#85adc5]"
            )
              div(
                class="relative flex items-center justify-start text-center"
              )
                div(v-if="!ks2wfApproveStarted && !ks2wfApproveCompile" class="w-[70px]")
                  svg-selector(class="handle cursor-move")
                //- toolbar
                div(class="absolute top-0 left-0 ")
                  ctx-menu(
                    v-if="!ks2wfApproveStarted && !ks2wfApproveCompile"
                    class="text-[#85adc5] hover:text-[#898ed2]"
                    listAlign="right"
                    listWidthClass="w-[220px]"
                  )
                    template(v-slot:icon)
                      svg-dots-vertical
                    template(v-slot:items)
                      div(
                        class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                        @click="onAddGroup(data[0], type)"
                      )
                        svg-view-grid-plus
                        span {{ $t('add-group') }}
                      div(
                        class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                        @click="onEditType(data[0], type)"
                      )
                        svg-pencilalt
                        span {{ $t('sign-type') }}
                      div(
                        class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                        @click="onDelType(data[0], type)"
                      )
                        svg-trash
                        span {{ $t('del-block-group') }}
                div(class="absolute bottom-5 left-[2px] text-sm w-[90px] overflow-hidden whitespace-nowrap truncate") {{ this.$i18n.locale == 'ru' ? type.type.name_ru : type.type.name_en }}
                div(class="absolute bottom-0 left-1 text-sm") {{ getTypeSort(type, type_idx+1) }}
            //- группы
            div(v-if="type.ks2_groups.length > 0")
              draggable(
                class="ml-6 min-h-[90px] w-[208px] border-4 border-[#85adc5] rounded-xl text-gray-700"
                v-model="type.ks2_groups"
                tag="transition-group"
                :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list': null }"
                v-bind="ks2_dragGroup"
                :group="`ks2_group_${type.id}`"
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
                        div(v-if="!ks2wfApproveStarted && !ks2wfApproveCompile" class="w-[40px]")
                          svg-selector(class="handle cursor-move")
                        div(class="w-full pr-4") {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
                        //- toolbar
                        div(
                          v-if="!ks2wfApproveStarted && !ks2wfApproveCompile"
                          class="absolute top-0 right-7 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                          @click="onAddUserGroup(type, group)"
                        )
                          svg-user-plus
                        div(
                          v-if="!ks2wfApproveStarted && !ks2wfApproveCompile"
                          class="absolute top-0 right-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                          @click="onDelGroup(group, type)"
                        )
                          svg-trash
                        //- метки
                        div(class="absolute bottom-0 left-1 py-1 pr-1 flex items-center justify-end text-center")
                          div(
                            class="text-[10px] text-copy-secondary rounded-3xl bg-green-200"
                          )
                            div(class="px-1") {{ this.$i18n.locale == 'ru' ? group.side.name_ru : group.side.name_en }}
                        div(class="absolute bottom-0 right-1 text-sm") {{ getGroupSort(type, type_idx+1, group, group_idx+1) }}
                    div
                      draggable(
                        class="ml-8 min-h-[90px] w-[400px] border-4 border-[#85adc5] rounded-xl text-copy-primary"
                        v-model="group.ks2_users"
                        tag="transition-group"
                        :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                        v-bind="ks2_dragUser"
                        :group="`ks2_user_${group.id}`"
                        handle=".handle"
                        @start="drag=true"
                        @end="drag=false"
                        item-key="id"
                        @change="logUserSign"
                      )
                        template(#item="{element: user, index: user_idx}")
                          div(class="flex mb-1 last:mb-0")
                            div(class="relative flex items-center justify-start border-dashed border-2 border-[#85adc5] rounded-lg min-h-[20px] w-[400px]")
                              div(v-if="!ks2wfApproveStarted && !ks2wfApproveCompile" class="w-[40px]")
                                svg-selector(class="handle cursor-move")
                              div(class="w-full pr-4")
                                div {{user.full_name}}
                                div(class="text-sm italic w-4/5 overflow-hidden whitespace-nowrap truncate") {{user.position || '-'}}
                              div(class="absolute bottom-0 right-1 text-sm") {{ getUserSort(group, group_idx, user_idx, user, type, type_idx) }}
                              div(
                                v-if="!ks2wfApproveStarted && !ks2wfApproveCompile"
                                class="absolute top-0 right-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer"
                                @click="onDelUser(user, group, group.id, user.id)"
                              )
                                svg-trash
    //- Подписание
    div(v-if="data[1]" class="p-1 flex")
      div(class="relative flex items-center justify-start text-center border-4 border-[#85adc5] rounded-xl min-h-[90px] w-[185px]")
        div(class="w-full p-1 text-sm") {{ $t(data[1]?.code) }}
        div(
          v-if="!ks2wfSignStarted && !ks2wfSignCompile"
          class="absolute right-0 top-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer"
          @click="onAddGroup(data[1])"
        )
          svg-view-grid-plus
      //- Тип подписания
      draggable(
        class="relative p-1"
        v-model="data[1].ks2_types"
        tag="transition-group"
        :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
        v-bind="ks2_dragType"
        group="ks2_type_sign"
        handle=".handle"
        @start="drag=true"
        @end="drag=false"
        item-key="id"
        @change="logTypeSign"
      )
        template(#item="{element: type, index: type_idx}")
          div(
            class="flex w-full mb-1 last:mb-0 rounded-lg min-h-[100px] min-w-[300px]"
            :class="{'bg-green-200': type.type_id === 1, 'bg-red-200': type.type_id === 2, 'bg-yellow-200': type.type_id === 3}"
          )
            div(
              class="flex w-full text-gray-600 rounded-bl-lg border-[#85adc5]"
            )
              div(
                class="relative flex items-center justify-start text-center"
              )
                div(v-if="!ks2wfSignStarted && !ks2wfSignCompile" class="w-[70px]")
                  svg-selector(class="handle cursor-move")
                //- toolbar
                div(class="absolute top-0 left-0 ")
                  ctx-menu(
                    v-if="!ks2wfSignStarted && !ks2wfSignCompile"
                    class="text-[#85adc5] hover:text-[#898ed2]"
                    listAlign="right"
                    listWidthClass="w-[220px]"
                  )
                    template(v-slot:icon)
                      svg-dots-vertical
                    template(v-slot:items)
                      div(
                        class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                        @click="onAddGroup(data[1], type)"
                      )
                        svg-view-grid-plus
                        span {{ $t('add-group') }}
                      div(
                        class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                        @click="onEditType(data[1], type)"
                      )
                        svg-pencilalt
                        span {{ $t('sign-type') }}
                      div(
                        class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
                        @click="onDelType(data[1], type)"
                      )
                        svg-trash
                        span {{ $t('del-block-group') }}
                div(class="absolute bottom-5 left-[2px] text-sm w-[90px] overflow-hidden whitespace-nowrap truncate") {{ this.$i18n.locale == 'ru' ? type.type.name_ru : type.type.name_en }}
                div(class="absolute bottom-0 left-1 text-sm") {{ getTypeSignSort(type, type_idx+1) }}
            //- группы
            div(v-if="type.ks2_groups.length > 0")
              draggable(
                class="ml-6 min-h-[90px] w-[208px] border-4 border-[#85adc5] rounded-xl text-gray-700"
                v-model="type.ks2_groups"
                tag="transition-group"
                :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list': null }"
                v-bind="ks2_dragGroup"
                :group="`ks2_group_${type.id}`"
                handle=".handle"
                @start="drag=true"
                @end="drag=false"
                item-key="id"
                @change="logGroupSign"
              )
                template(#item="{element: group, index: group_idx}")
                  div(class="flex mb-2 last:mb-0")
                    div.flex
                      div(
                        class="relative flex items-center justify-start text-center border-dashed border-2 border-[#85adc5] rounded-lg min-h-[90px] w-[200px]"
                      )
                        div(v-if="!ks2wfSignStarted && !ks2wfSignCompile" class="w-[40px]")
                          svg-selector(class="handle cursor-move")
                        div(class="w-full pr-4") {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
                        //- toolbar
                        div(
                          v-if="!ks2wfSignStarted && !ks2wfSignCompile"
                          class="absolute top-0 right-7 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                          @click="onAddUserGroup(type, group)"
                        )
                          svg-user-plus
                        div(
                          v-if="!ks2wfSignStarted && !ks2wfSignCompile"
                          class="absolute top-0 right-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
                          @click="onDelGroup(group, type)"
                        )
                          svg-trash
                        //- метки
                        div(class="absolute bottom-0 left-1 py-1 pr-1 flex items-center justify-end text-center")
                          div(
                            class="text-[10px] text-copy-secondary rounded-3xl bg-green-200"
                          )
                            div(class="px-1") {{ this.$i18n.locale == 'ru' ? group.side.name_ru : group.side.name_en }}
                        div(class="absolute bottom-0 right-1 text-sm") {{ getGroupSignSort(type, type_idx+1, group, group_idx+1) }}
                    div
                      draggable(
                        class="ml-8 min-h-[90px] w-[400px] border-4 border-[#85adc5] rounded-xl text-copy-primary"
                        v-model="group.ks2_users"
                        tag="transition-group"
                        :component-data="{tag: 'div', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                        v-bind="ks2_dragUser"
                        :group="`ks2_user_${group.id}`"
                        handle=".handle"
                        @start="drag=true"
                        @end="drag=false"
                        item-key="id"
                        @change="logUserSign"
                      )
                        template(#item="{element: user, index: user_idx}")
                          div(class="flex mb-1 last:mb-0")
                            div(class="relative flex items-center justify-start border-dashed border-2 border-[#85adc5] rounded-lg min-h-[20px] w-[400px]")
                              div(v-if="!ks2wfSignStarted && !ks2wfSignCompile" class="w-[40px]")
                                svg-selector(class="handle cursor-move")
                              div(class="w-full pr-4")
                                div {{user.full_name}}
                                div(class="text-sm italic w-4/5 overflow-hidden whitespace-nowrap truncate") {{user.position || '-'}}
                              div(class="absolute bottom-0 right-1 text-sm") {{ getUserSignSort(group, group_idx, user_idx, user, type, type_idx) }}
                              div(
                                v-if="!ks2wfSignStarted && !ks2wfSignCompile"
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
let accum_type = 0, counter_type = 0, accum_group = 0, counter_group = 0
let accum_type_sign = 0, counter_type_sign = 0, accum_group_sign = 0, counter_group_sign = 0
import axios from 'axios'
import toast from '@/mixins/toast'
export default {
  name: 'ksid-workflow',
  mixins: [toast],
  data() {
    return {
      drag: false,
      isLoad: true,
      isLoadForRefresh: true,
      ks2_id: null,
      data: {},
      ks2info: {},
      ks2wfApproveStarted: false,
      ks2wfApproveCompile: false,
      ks2wfSignStarted: false,
      ks2wfSignCompile: false,
      allGroup: [],
      allGroupSign: [],
      sortData: {},
      sorting: {
        types: [],
        groups: [],
        users: []
      },
      sortDataSign: {},
      sortingSign: {
        types: [],
        groups: [],
        users: []
      },
      modalCfg: {
        modalShow: false
      }
    }
  },
  computed: {
    ks2_dragType() {
      return {
        animation: 200,
        group: "typeDefault",
        disabled: false,
        ghostClass: "opacity-50"
      }
    },
    ks2_dragGroup() {
      return {
        animation: 200,
        group: "groupDefault",
        disabled: false,
        ghostClass: "opacity-50"
      }
    },
    ks2_dragUser() {
      return {
        animation: 200,
        group: "userDefault",
        disabled: false,
        ghostClass: "opacity-50"
      }
    }
  },
  methods: {
    async onLoad() {
      await axios.get(`/api/ks2workflow/${this.$route.params.id}`)
        .then((data) => {
          this.data = data.data.data
          this.ks2info = data.data.ks2info
          this.ks2wfApproveStarted = data.data.ks2info.ks2_workflow[0].started
          this.ks2wfApproveCompile = data.data.ks2info.ks2_workflow[0].complete
          this.ks2wfSignStarted = data.data.ks2info.ks2_workflow[1].started
          this.ks2wfSignCompile = data.data.ks2info.ks2_workflow[1].complete
          this.allGroup = data.data.allGroup
          this.allGroupSign = data.data.allGroupSign
          this.isLoad = false
        })
    },
    onAddGroup(data, type) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('add-group'),
        component: 'add-group-in-stage',
        ks2_id: this.ks2info.id,
        type_id: type?.id,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[80%] sm:h-[70%] lg:h-4/6 ',
        tmpGroupCheck: [],
        data: {
          type: 'ks2-add-group',
          type: type,
          group: null,
          data: data
        }
      }
    },
    onEditType(data, type) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('type-signing'),
        component: 'edit-group-in-stage',
        ks2_id: this.ks2info.id,
        type_id: type?.id,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]',
        data: {
          type: 'edit-group-in-stage',
          type: type,
          cascade: false
        },
        typeTmp: type.type_id
      }
    },
    onDelType(data, type) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('delete-group'),
        component: 'delete-group-in-stage',
        ks2_id: +this.ks2info.id,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]',
        type_id: type.id
      }
      let group = []
      type.ks2_groups.forEach(i => {
        group.push({
          id: i.id,
          code: i.code,
          check: false,
          type_id: i.type_id
        })
      })
      const params = {
        ks2_id: +this.ks2info.id,
        type_id: type.id,
        group: group
      }
      this.modalCfg.tmpDelGroup = params
    },
    onAddUserGroup(type, group) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('add-user-in-group', {group:this.$i18n.locale == 'ru' ? group.name_ru : group.name_en}),
        component: 'add-user-in-group',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[60%]',
        ks2_id: +this.ks2_id,
        data: {
          type: 'add-user-in-group',
          type, type,
          group: group
        }
      }
    },
    onDelGroup(group, type) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('delete-group-confirm', {
          group: this.$i18n.locale == 'ru' ? group.name_ru : group.name_en
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
          ks2_id: +this.ks2_id
        }],
        ks2_id: +this.ks2_id,
        type_id: type.id
      }
      this.modalCfg.tmpDelGroup = params
    },
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
        _ks2_id: +this.ks2_id,
        _group_code: group.code,
        _group_id: group_id,
        _user_id: user_id
      }
      this.modalCfg.userDelInGroup = params
    },
    getTypeSort(type, t_idx) {
      counter_type++
      if(type.type.id != 3) {
        accum_type++
      }
      //--
      this.sorting.types.push({
        id: type.id,
        order_execution_type: type.type.id != 3 ? accum_type : 0,
        hierarchy: type.type.id != 3 ? accum_type : 0
      })
      //--
      this.sortData[type.id] = {
        id: type.id,
        order_execution_type: type.type.id != 3 ? accum_type : 0,
        hierarchy: type.type.id != 3 ? accum_type : 0
      }
      // считаем индекс групп
      if(type.type_id != 3) accum_group++
      type.ks2_groups.forEach((group, g_idx) => {
        counter_group++
        let hierarchy
        if(type.type_id === 2) {
          hierarchy = `${accum_type}.${g_idx+1}`
          if(g_idx === 0) { accum_group = accum_group + g_idx }
          else { accum_group = accum_group + 1 }
        } else {
          hierarchy = type.type.id != 3 ? `${accum_type}.${1}` : '0.0'
        }
        this.sorting.groups.push({
          id: group.id,
          code: group.code,
          order_execution_group: type.type.id != 3 ? accum_group : 0,
          hierarchy: hierarchy,
          type_id: type.id
        })
        this.sortData[type.id][group.id] = {
          id: group.id,
          code: group.code,
          order_execution_group: type.type.id != 3 ? accum_group : 0,
          hierarchy: hierarchy,
          type_id: type.id
        }
      })
      if(counter_type === this.data[0].ks2_types.length) {
        counter_type = 0
        accum_type = 0
      }
      return this.sortData[type.id].order_execution_type
    },
    getTypeSignSort(type, t_idx) {
      counter_type_sign++
      if(type.type.id != 3) {
        accum_type_sign++
      }
      //--
      this.sortingSign.types.push({
        id: type.id,
        order_execution_type: type.type.id != 3 ? accum_type_sign : 0,
        hierarchy: type.type.id != 3 ? accum_type_sign : 0
      })
      //--
      this.sortDataSign[type.id] = {
        id: type.id,
        order_execution_type: type.type.id != 3 ? accum_type_sign : 0,
        hierarchy: type.type.id != 3 ? accum_type_sign : 0
      }
      // считаем индекс групп
      if(type.type_id != 3) accum_group_sign++
      type.ks2_groups.forEach((group, g_idx) => {
        counter_group_sign++
        let hierarchy
        if(type.type_id === 2) {
          hierarchy = `${accum_type_sign}.${g_idx+1}`
          if(g_idx === 0) { accum_group_sign = accum_group_sign + g_idx }
          else { accum_group_sign = accum_group_sign + 1 }
        } else {
          hierarchy = type.type.id != 3 ? `${accum_group_sign}.${1}` : '0.0'
        }
        this.sortingSign.groups.push({
          id: group.id,
          code: group.code,
          order_execution_group: type.type.id != 3 ? accum_group_sign : 0,
          hierarchy: hierarchy,
          type_id: type.id
        })
        this.sortDataSign[type.id][group.id] = {
          id: group.id,
          code: group.code,
          order_execution_group: type.type.id != 3 ? accum_group_sign : 0,
          hierarchy: hierarchy,
          type_id: type.id
        }
      })
      if(counter_type_sign === this.data[1].ks2_types.length) {
        counter_type_sign = 0
        accum_type_sign = 0
      }
      return this.sortDataSign[type.id].order_execution_type
    },
    getGroupSort(type, t_idx, group, g_idx) {
      if(counter_group === this.allGroup.length) {
        counter_type = 0
        accum_type = 0
        accum_group = 0
        counter_group = 0
      }
      return this.sortData[type.id][group.id].hierarchy+' ('+this.sortData[type.id][group.id].order_execution_group+')'
    },
    getGroupSignSort(type, t_idx, group, g_idx) {
      if(counter_group_sign === this.allGroupSign.length) {
        counter_type_sign = 0
        accum_type_sign = 0
        accum_group_sign = 0
        counter_group_sign = 0
      }
      return this.sortDataSign[type.id][group.id].hierarchy+' ('+this.sortDataSign[type.id][group.id].order_execution_group+')'
    },
    getUserSort(group, g_idx, u_idx, user, type, t_idx) {
      const order_user = this.sortData[type.id][group.id].order_execution_group
      const hierarchy = this.sortData[type.id][group.id].hierarchy+'.'+(type.type.id === 3 ? 0 : 1)
      this.sortData[type.id][group.id][user.id] = {
        id: user.id,
        email: user.email,
        order_execution_user: order_user,
        hierarchy: hierarchy,
        type_id: type.id,
        group_id: group.id
      }
      this.sorting.users.push({
        id: user.id,
        email: user.email,
        order_execution_user: order_user,
        hierarchy: hierarchy,
        type_id: type.id,
        group_id: group.id
      })
      if(accum_group === this.allGroup.length) accum_group = 0
      return this.sortData[type.id][group.id][user.id].hierarchy+' ('+this.sortData[type.id][group.id][user.id].order_execution_user+')'
    },
    getUserSignSort(group, g_idx, u_idx, user, type, t_idx) {
      const order_user = this.sortDataSign[type.id][group.id].order_execution_group
      const hierarchy = this.sortDataSign[type.id][group.id].hierarchy+'.'+(type.type.id === 3 ? 0 : 1)
      this.sortDataSign[type.id][group.id][user.id] = {
        id: user.id,
        email: user.email,
        order_execution_user: order_user,
        hierarchy: hierarchy,
        type_id: type.id,
        group_id: group.id
      }
      this.sortingSign.users.push({
        id: user.id,
        email: user.email,
        order_execution_user: order_user,
        hierarchy: hierarchy,
        type_id: type.id,
        group_id: group.id
      })
      if(accum_group_sign === this.allGroupSign.length) accum_group_sign = 0
      return this.sortDataSign[type.id][group.id][user.id].hierarchy+' ('+this.sortDataSign[type.id][group.id][user.id].order_execution_user+')'
    },
    setNull() {
      counter_type = accum_type = accum_group = counter_group = 0
      counter_type_sign = accum_type_sign = accum_group_sign = counter_group_sign = 0
      this.sortingSign = this.sorting = {
        types: [],
        groups: [],
        users: []
      }
    },
    logType(evt) {
      this.setNull()
      setTimeout(() => { this.setSortWorkflowElement(this.sorting) }, 0)
    },
    logTypeSign(evt) {
      this.setNull()
      setTimeout(() => { this.setSortWorkflowElement(this.sortingSign) }, 0)
    },
    logGroup(evt) {
      this.setNull()
      setTimeout(() => { this.setSortWorkflowElement(this.sorting) }, 0)
    },
    logGroupSign(evt) {
      this.setNull()
      setTimeout(() => { this.setSortWorkflowElement(this.sortingSign) }, 0)
    },
    logUser(evt) {
      this.setNull()
      setTimeout(() => { this.setSortWorkflowElement(this.sorting) }, 0)
    },
    logUserSign(evt) {
      this.setNull()
      setTimeout(() => { this.setSortWorkflowElement(this.sortingSign) }, 0)
    },
    async setSortWorkflowElement(params) {
      await axios.post('api/ks2workflow/sorted', {
        params: params
      })
    },
    async onRefresh() {
      this.isLoadForRefresh = true
      this.data = this.ks2info = {}
      this.allGroup = []
      this.setNull()
      setTimeout(() => { this.isLoadForRefresh = false }, 500)
      await this.onLoad()
      setTimeout(() => { this.setSortWorkflowElement(this.sorting) }, 0)
    },
    closeModal() {
      this.modalCfg = {
        modalShow: false
      }
    },
    async saveAndCloseModal() {
      if(this.modalCfg.component === 'add-group-in-stage') {
        const params = {
          ks2_wf_id: this.modalCfg.data.data.id,
          group: this.modalCfg.tmpGroupCheck,
          ks2_id: this.modalCfg.ks2_id,
          type_id: this.modalCfg.type_id
        }
        await axios.post('/api/ks2/workflow/cerrectstage', {
          params: params
        })
        .then((data) => {
          if(data.data.success) {
            this.onToast('success', this.$t('success'))
          } else {
            this.onToast('danger', this.$t('error'), data.message)
          }
        })
      }
      if(this.modalCfg.component === 'edit-group-in-stage') {
        const params = {
          type_id: +this.modalCfg.data.type.id,
          subtype_id: +this.modalCfg.typeTmp,
          ks2_id: +this.modalCfg.ks2_id,
          cascade: this.modalCfg.data.cascade
        }
        await axios.post('/api/ks2/workflow/updtype', {
          params: params
        })
        .then((data) => {
          if(data.data.success) {
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
        await axios.post('/api/ks2/workflow/cerrectstage', {
          params: this.modalCfg.tmpDelGroup
        })
        .then((data) => {
          if(data.data.success) {
            this.onToast('success', this.$t('success'))
          } else {
            this.onToast('danger', this.$t('error'), data.message)
          }
        })
      }
      if(this.modalCfg.component === 'add-user-in-group') {
        const params = {
          ks2_id: +this.modalCfg.ks2_id,
          group_id: +this.modalCfg.data.group.id,
          type_id: +this.modalCfg.data.type.id,
          group_code: this.modalCfg.data.group.code,
          add_users: this.modalCfg.tmpAddUser
        }
        await axios.post('api/ks2/workflow/addusergroup', {
          params
        })
        .then((data) => {
          if(data.data.success) {
            this.onToast('success', this.$t('success'))
          } else {
            this.onToast('danger', this.$t('error'), data.message)
          }
        })
      }
      if(
        this.modalCfg.component === 'delete-group-in-stage'
        && !this.modalCfg.type_id
        && !this.modalCfg.user_del_in_group
      ) {
        await axios.post('/api/ks2/workflow/cerrectstage', {
          params: this.modalCfg.tmpDelGroup
        })
        .then((data) => {
          if(data.data.success) {
            this.onToast('success', this.$t('success'))
          } else {
            this.onToast('danger', this.$t('error'), data.message)
          }
        })
      }
      if(this.modalCfg.component === 'delete-group-in-stage' && this.modalCfg.user_del_in_group) {
        await axios.delete('api/ks2/workflow/delusergroup', {
          params: this.modalCfg.userDelInGroup
        })
        .then((data) => {
          if(data.data.success) {
            this.onToast('success', this.$t('success'))
          } else {
            this.onToast('danger', this.$t('error'), data.message)
          }
        })
      }
      this.closeModal()
      setTimeout(() => { this.onRefresh() }, 0)
    }
  },
  async mounted() {
    this.ks2_id = +this.$route.params.id
    await this.onLoad()
    setTimeout(() => {
      this.isLoadForRefresh = false
    }, 500)
  }
}
</script>