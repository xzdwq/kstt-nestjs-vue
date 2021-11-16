<template lang="pug">
div(class="bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  //- toolbar
  div(class="pb-2")
    def-button(class="p-0 pr-1 flex justify-between h-[25px] text-white bg-[#06d6a0]" @click="onCreateNewGroup")
      svg-plus
      span(class="hidden md:block") {{ $t('create-group') }}
  //- modal create new group
  modal(v-model:modalCfg="insideModalCfg")
    template(v-slot:title) {{ insideModalCfg.title }}
    template(v-slot:body)
      component(:is="insideModalCfg.component" v-model:modalCfg="insideModalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") {{ $t('save') }}
  //- component
  div(v-if="getGroup.length > 0")
    div(
      v-for="group in getGroup"
      :key="group.id"
      class="p-2 mb-2 border-2 border-gray-400 rounded-md"
    )
      //- группы
      div
        div(class="flex justify-between items-center")
          div {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
          div(class="flex items-center")
            //- метки
            div(
              class="text-[10px] text-copy-secondary rounded-3xl bg-green-200"
            )
              div(class="px-1") {{ this.$i18n.locale == 'ru' ? group.side.name_ru : group.type.name_en }}
            //- чекбокс
            div(class="pl-1")
              input(type="checkbox" class="form-checkbox cursor-pointer" :checked="matchGroup(group.id, group.code, group.side.id)" @change="chancgeCheckbox($event, group)")
        //- участники группы
        div(class="flex flex-wrap text-sm text-copy-secondary pt-2")
          div(
            v-for="user in group.user_group"
            :key="`${group.id}_${user.user.id}`"
            class="pb-1 pr-1"
          )
            div(class="bg-gray-200 rounded-3xl px-1") {{ user.user.full_name }}
  //- load mask
  div(
    v-if="getIsLoading"
    class="w-full flex items-center justify-center mt-2"
  )
    svg-loading
    p {{ $t('loading') }}
  div(
    v-if="getGroup.length === 0 && !getIsLoading"
    class="py-2"
  )
    p {{ $t('no-data') }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from "vuex";

export default {
  name: 'def-add-group-in-stage',
  props: ['modalCfg'],
  data() {
    return {
      insideModalCfg: {
        title: null,
        modalShow: false
      }
    }
  },
  async mounted() {
    this.modalCfg.tmpGroupCheck = []
    /*if(this.getGroup.length === 0)*/ await this.fetchGroup()
  },
  methods: {
    ...mapActions({
      fetchGroup: 'groupModule/fetchGroup'
    }),
    matchGroup(id, code, side) {
      if(this.modalCfg.data.type?.groups) {
        const match = this.modalCfg.data.type.groups.find(i => i.group.code === code)
        this.modalCfg.tmpGroupCheck.push(
          {
            id: id,
            code: code,
            check: code === match?.group.code,
            stage_id: this.modalCfg.data.stage.id,
            type_id: this.modalCfg.data.type.id,
            side_id: side
          }
        )
        return code === match?.group.code
      } else {
        this.modalCfg.tmpGroupCheck.push(
          {
            id: id,
            code: code,
            check: false,
            stage_id: this.modalCfg.data.stage.id,
            type_id: null,
            side_id: side
          }
        )
        return false
      }
    },
    chancgeCheckbox(e, group) {
      const checked = e.target.checked
      this.modalCfg.tmpGroupCheck.forEach(i => {
        if(i.id === group.id) {
          i.check = checked
        }
      })
    },
    //- Это для модального окна при создании новой группы
    onCreateNewGroup() {
      this.insideModalCfg = {
        modalShow: true,
        title: this.$t('create-group'),
        component: 'def-create-group',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[80%] sm:h-[70%] lg:h-4/6 ',
      }
    },
    //- Это для модального окна при создании новой группы
    async saveAndCloseModal() {
      if(this.insideModalCfg.component === 'def-create-group') {
        await this.emitter.emit('onCreateNewGroup')
      }
    },
    //- Это для модального окна при создании новой группы
    closeModal() {
      this.insideModalCfg.modalShow = false
    },
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'groupModule/getIsLoading',
      getGroup: 'groupModule/getGroup'
    })
  }
}
</script>