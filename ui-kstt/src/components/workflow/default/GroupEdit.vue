<template lang="pug">
div
  div(class="flex w-full justify-center")
    div {{ $t('group-management') }}
  //- toolbar
  div(class="flex items-center pb-2")
    def-button(
      class="text-white bg-[#06d6a0] flex justify-between"
      @click="onCreateNewGroup"
    )
      svg-plus
      span(class="hidden md:block") {{ $t('create-group') }}
  //- component
  div(v-if="getGroup.length > 0")
    div(
      v-for="(group, group_idx) in getGroup"
      :key="group.id"
      class="pb-2"
    )
      div(
        class="min-h-[60px] relative w-full border-2 border-[#579bae] rounded-md px-2"
      )
        div(
          class="flex justify-items-start font-bold"
        ) {{ group_idx+1 }}. {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
        div(v-if="group.user_group.length > 0")
          div(v-for="(user, user_idx) in group.user_group" :key="user.id" class="flex")
            div(class="w-8") {{ user_idx+1 }}.
            div(class="min-w-1/4") {{ user.user.full_name }}
            div(class="text-sm italic") {{ user.user.position }}
        div(v-else class="italic") {{ $t('user-in-group-empty') }}
        div(
          class="absolute top-0 right-0 text-[#85adc5] hover:text-[#898ed2] duration-100 cursor-pointer h-6"
          @click="onDelGroup(group)"
        )
          svg-trash
        div(class="absolute bottom-0 right-0 py-1 pr-1 flex items-center justify-end text-center")
          div(
            class="text-[10px] text-copy-secondary rounded-3xl bg-green-200"
          )
            div(class="px-1") {{ this.$i18n.locale == 'ru' ? group.side.name_ru : group.side.name_en }}
  //- загрузка
  div(
    v-if="getGroup.length === 0 && getIsLoading"
    class="absolute z-10 w-[calc(100%-55px)] flex items-center justify-center mt-2"
  )
    svg-loading
    p {{ $t('loading') }}
  div(
    v-if="getGroup.length === 0 && !getIsLoading"
    class="py-2"
  )
    p {{ $t('no-data') }}
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
import axios from 'axios'
import toast from '@/mixins/toast'
export default {
  name: 'group-edit',
  mixins: [toast],
  data() {
    return {
      modalCfg: {
        modalShow: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'groupModule/getIsLoading',
      getGroup: 'groupModule/getGroup'
    })
  },
  methods: {
    ...mapActions({
      fetchGroup: 'groupModule/fetchGroup',
      fetchWorkflowDefault: 'workflowDefaultManagmentModule/fetchWorkflowDefault'
    }),
    onDelGroup(group) {
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
      this.modalCfg.tmpDelGroup = group
    },
    onCreateNewGroup() {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('create-group'),
        component: 'def-create-group',
        width: 'w-[95%] sm:w-[85%] lg:w-[70%] xl:w-[900px]',
        height: 'h-[80%]'
      }
    },
    async saveAndCloseModal() {
      // Создать новую группу
      if(this.modalCfg.component === 'def-create-group') {
        await this.emitter.emit('onCreateNewGroup')
      }
      // Удалить группу
      if(this.modalCfg.component === 'delete-group-in-stage') {
        const params = {
          group_id: this.modalCfg.tmpDelGroup.id,
          code: this.modalCfg.tmpDelGroup.code
        }
        await axios.post('api/deletegroup', params)
        .then((data) => {
          if(data.data.success) {
            this.onToast('success', this.$t('success'))
          } else {
            this.onToast('danger', this.$t('error'), data.data.message)
          }
        })
        this.closeModal()
      }
      await this.fetchWorkflowDefault()
      await this.fetchGroup()
    },
    closeModal() {
      this.modalCfg.modalShow = false
    },
  },
  async mounted() {
    await this.fetchGroup()
  }
}
</script>