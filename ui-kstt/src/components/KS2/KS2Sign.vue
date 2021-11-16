<template lang="pug">
div
  //- Ожидает подписания
  fieldset(
    v-if="waitSign.length > 0"
    class="flex p-2 border rounded-sm border-border-color-primary"
  )
    legend(class="flex items-center ml-2 px-2 text-sm font-bold") {{ $t('wait-sign') }}
      div(class="w-5 h-5 ml-2 flex items-center justify-center border border-border-color-primary rounded-md ")
        svg-down(
          class="duration-300 cursor-pointer w-[17px]"
          :class="{'rotate-180': isOpenWaitSign}"
          @click="isOpenWaitSign = !isOpenWaitSign"
        )
    div.flex.flex-wrap
      div(
        v-for="group of waitAndFutureSign"
        :key="group.uuid"
        class="flex flex-wrap transition-all duration-700 overflow-hidden text-sm"
        :class="isOpenWaitSign ? 'max-h-[300px]' : 'max-h-0'"
      )
        div(
          class="relative w-[300px] flex justify-between border-2 border-wfblue-primary rounded-md items-center m-1"
          :class="{'border-gray-400 text-gray-500': group.index === 'future', 'border-[#c5c14b]': group.remark}"
        )
          svg-badge-one-tape(
            v-if="group.index === 'future'"
            class="w-6 min-w-[50px] text-gray-400"
          )
          svg-exclamation(
            v-else-if="group.remark"
            class="w-6 min-w-[50px] text-[#c5c14b]"
          )
          svg-badge-two-tape(
            v-else
            class="w-6 min-w-[50px] text-wfblue-primary"
          )
          div.p-1
            div
              b {{ group[`name_${$i18n.locale}`] }}
            div(
              v-if="group.remark"
              class="w-[220px] truncate"
            )
              div {{ group.remarkLast.author.full_name }}
              div {{ group.remarkLast.text }}
              div {{ formatDate(group.remarkLast.create_at) }}
            div(v-else) {{ getMatchName(group.ks2_users) }}
          div(
            v-if="(isImCreator(group.ks2_users) || workflowManagmentKS3) && !group.remark"
            class="cursor-pointer"
            :class="group.index === 'future' ? 'text-gray-400' : 'text-wfblue-primary'"
            @click="onDelGroupConfirm(group)"
          )
            svg-trash(v-ttip="$t('delete')")
  //- Подписали
  fieldset(
    v-if="sign.length > 0"
    class="flex p-2 border rounded-sm border-border-color-primary"
  )
    legend(class="flex items-center ml-2 px-2 text-sm font-bold") {{  $t('signeds') }}
      div(class="w-5 h-5 ml-2 flex items-center justify-center border border-border-color-primary rounded-md ")
        svg-down(
          class="duration-300 cursor-pointer w-[17px]"
          :class="{'rotate-180': isOpenSign}"
          @click="isOpenSign = !isOpenSign"
        )
    div.flex.flex-wrap
      div(
        v-for="type of sign"
        :key="type.id"
        class="flex flex-wrap transition-all duration-700 overflow-hidden"
        :class="isOpenSign ? 'max-h-[300px]' : 'max-h-0'"
      )
        div(
          v-for="group of type.ks2_groups"
          :key="group.id"
          class="transition-all duration-700 overflow-hidden text-sm p-1"
          :class="isOpenSign ? 'max-h-[300px]' : 'max-h-0'"
        )
          div.flex.border-2.border-wfgreen-primary.rounded-md
            svg-badge-check(class="w-6 min-w-[50px] text-wfgreen-primary")
            div.p-1
              div
                b {{ group[`name_${$i18n.locale}`] }}
              div {{ group.ks2_users[0].full_name }}
              div {{ formatDate(group.ks2_users[0].sign_at) }}
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndClose") OK
</template>
<script>
import axios from 'axios'
import {
  mapGetters
} from 'vuex'
import { format, addMinutes } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'
import matchRoles from '@/mixins/matchRoles'
export default {
  name: 'ks2-sign',
  mixins: [matchRoles],
  data() {
    return {
      ru: ru,
      en: enGB,
      sign: [],
      waitSign: [],
      futureSign: [],
      waitMySign: [],
      waitAndFutureSign: [],
      isOpenWaitSign: true,
      isOpenSign: true,
      workflowManagmentKS3: false,
      modalCfg: {
        modalShow: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'authModule/getUser'
    })
  },
  methods: {
    formatDate(date) {
      date = new Date(date)
      let formatType = this.$i18n.locale == 'ru' ? 'dd.MM.yyyy HH:mm:ss' : 'MM/dd/yyyy h:mm:ss a'
      return format(
        addMinutes(date, date.getTimezoneOffset()),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    },
    getMatchName(ks2_users) {
      const matchName = ks2_users.find(u => u.login === this.getUser.UserName)
      return matchName?.full_name || ''
    },
    isImCreator(ks2_users) {
      const matchName = ks2_users.find(u => u.creator === this.getUser.Email)
      return matchName ? true : false
    },
    // Удалить еще не подписавшего
    onDelGroupConfirm(group) {
      this.modalCfg = {
        modalShow: true,
        group: group,
        title: this.$t('confirm'),
        component: 'confirm',
        question: this.$t('del-sign', {name: group[`name_${this.$i18n.locale}`]}),
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]',
        fn: 'onDelGroup'
      }
    },
    async onDelGroup() {
      const params = {
        ks2_id: +this.$route.params.id,
        group_id: this.modalCfg.group.id,
        ks2_wf_id: this.modalCfg.group.ks2_workflow_id,
        ks2_type_id: this.modalCfg.group.ks2_type_id,
        group_code: this.modalCfg.group.code
      }
      await axios.post('api/ks2/removeexec', {
        params: params
      })
    },
    async saveAndClose() {
      await this[this.modalCfg.fn]()
      this.closeModal()
      this.$emit('onRefresh')
    },
    closeModal() {
      this.modalCfg = {
        modalShow: false
      }
    }
  },
  async mounted() {
    await this.matchRole('workflowManagmentKS3')
  }
}
</script>