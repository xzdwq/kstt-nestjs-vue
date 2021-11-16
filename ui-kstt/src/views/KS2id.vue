<template lang="pug">
div
  //- toolbar
  div(class="flex items-center pb-2 justify-between")
    div(class="flex items-center pb-2")
      def-button-back
      def-button(
        class="text-white bg-[#579bae] flex justify-between"
        @click="onRefresh"
      )
        svg-refresh(:class="{'animate-spin z-0' : getIsLoading || isLoadForRefresh}")
    //- Статус
    div(
      class="p-2 flex items-center bg-background-secondary rounded-md"
      :class="{'bg-green-200 text-gray-600': ks2_status_code === 'approval' || 'agreed', 'bg-yellow-200 text-gray-600': ks2_status_code === 'fixing'}"
    )
      span(class="font-bold pr-1") {{ $t('ks2.status') }}:
      div {{ getKS2byid.ks2_status ? (this.$i18n.locale == 'ru' ? getKS2byid.ks2_status.name_ru : getKS2byid.ks2_status.name_en) : '-' }}
  //- body
  //- load
  div(v-if="getKS2byid.length === 0 && getIsLoading" class="absolute z-10 h-[calc(100%-150px)] w-[calc(100%-55px)] flex items-center justify-center")
    div(class="flex w-56 h-20 justify-center items-center bg-background-secondary rounded-md")
      svg-loading
      p {{ $t('loading') }}
  //- Метаданные
  div(class="h-[calc(100vh-165px)] overflow-y-scroll overflow-x-hidden")
    ks2-metadata(
      ref="ks2-metadata"
      @onRefresh="onRefresh"
    )
    //- Суммы по акту
    ks2-total-sum(ref="total-sum" class="p-1 rounded-sm bg-background-secondary")
    //- Согласанты
    ks2-agreements(
      ref="agreements" class="mt-2 p-1"
      @onRefresh="onRefresh"
    )
    //- Подписанты
    ks2-sign(
      ref="ks2_sign" class="mt-2 p-1"
      @onRefresh="onRefresh"
    )
    //- Доп информация
    tab-wrapper(
      class="relative mt-2 bg-background-secondary rounded-md text-base leading-normal text-left h-1/2"
      :tabflex="false"
      :selectednoactivtab="true"
      :uniqstate="uniqstate"
    )
      //- Прочие файлы
      tab(
        class="relative h-[calc(100%-50px)]"
        title="other-files"
        countTitleModule="countTitleModule/getCntOtherFile"
        code="other-files"
        :uniqstate="uniqstate"
        :selected="true"
      )
        other-files(
          :ks2="ks2ById"
        )
      //- История замечаний
      tab(
        class="relative h-[calc(100%-50px)]"
        title="comment-history"
        countTitleModule="countTitleModule/getCntHistory"
        code="comment-history"
        :uniqstate="uniqstate"
        :selected="true"
      )
        ks2-history(
          :ks2="ks2ById"
          @onRefresh="onRefresh"
        )
      //- Примечания от участников
      tab(
        class="relative h-[calc(100%-50px)]"
        title="notes"
        countTitleModule="countTitleModule/getCntComments"
        code="notes"
        :uniqstate="uniqstate"
        :selected="true"
      )
        ks2-notes(
          ref="ks2_notes"
          @onRefresh="onRefresh"
        )
  //- bottom toolbar
  div(class="pt-2")
    div(class="flex justify-end")
      def-button(
        v-if="workflowManagment"
        class="flex justify-between items-center h-7 p-0 px-1 text-white bg-[#067cd6]"
        @click="$router.push(`/ks2/${$route.params.id}/workflow`)"
      )
        svg-exclamation(v-if="getKS2byid.ks2_workflow && getKS2byid.ks2_workflow[0]?.ks2_types.length === 0 && getKS2byid.ks2_workflow[1]?.ks2_types.length === 0" class="h-full text-red-300")
        span {{ $t('wf-way') }}
      div(v-if="ks2_status_code === 'project'" class="flex justify-end")
        def-button(
          v-if="workflowManagment"
          class="min-w-28 h-7 p-0 px-1 text-white bg-[#06d6a0]"
          @click="checkSendApproval"
        ) {{ $t('send-approval') }}
        def-button(
          v-if="!readonly"
          class="min-w-28 h-7 p-0 px-1 text-white bg-[#06d6a0]"
          @click="onSave"
        ) {{ $t('save') }}
      def-button(
        v-if="waitMyAgree.length > 0 || waitMySign.length > 0"
        class="flex justify-between items-center h-7 p-0 px-1 text-white bg-red-400"
        @click="confirmRemark"
      )
        svg-close
        span(class="hidden md:block") {{ $t('add-remark') }}
      //- Добавить доп.согласующего
      def-button(
        v-if="waitMyAgree.length > 0 || waitMySign.length > 0"
        class="flex justify-between items-center h-7 p-0 px-1 text-white bg-[#c5c14b]"
        @click="confirmAddExtraApprover"
      )
        svg-user-plus
        span(class="hidden md:block") {{ $t('extra_approver') }}
      //- Отправить на согласование
      def-button(
        v-if="waitMyAgree.length > 0"
        class="flex justify-between items-center h-7 p-0 px-1 text-white bg-[#06d6a0]"
        @click="checkAgree"
      )
        svg-badge-check(class="w-full h-full p-[1px]")
        span(class="hidden md:block") {{ $t('agree') }}
      //- Отправить на подписание
      def-button(
        v-if="ks2_status_code === 'agreed'"
        class="min-w-28 h-7 p-0 px-1 text-white bg-[#06d6a0]"
        @click="checkSendSign"
      ) {{ $t('send-sign') }}
      //- Подписать
      div(v-if="ks2_status_code === 'signing'")
        def-button(
          v-if="waitMySign.length > 0"
          class="flex justify-between items-center h-7 p-0 px-1 text-white bg-[#06d6a0]"
          @click="checkSign"
        )
          svg-badge-check(class="w-full h-full p-[1px]")
          span(class="hidden md:block") {{ $t('sign') }}
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(v-if="modalCfg.showOK" class="text-white bg-[#06d6a0]" @click="sendApproval") {{ $t('send-approval') }}
      def-button(v-if="modalCfg.showOKAgree" class="text-white bg-[#06d6a0]" @click="sendAgree") {{ $t('agree') }}
      def-button(v-if="modalCfg.showOKExtra" class="text-white bg-[#06d6a0]" @click="addExtraApprover") {{ $t('add') }}
      def-button(v-if="modalCfg.showOKRemark" class="min-w-28 text-white bg-[#06d6a0]" @click="sendRemark") {{ $t('add-remark') }}
      def-button(v-if="modalCfg.showOKSign" class="text-white bg-[#06d6a0]" @click="sendSign") {{ $t('send-sign') }}
</template>
<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import axios from 'axios'

import TabWrapper from '@/components/tab/TabWrapper.vue'
import Tab from '@/components/tab/Tab.vue'
import toast from '@/mixins/toast'
import matchRoles from '@/mixins/matchRoles'
import sendAgree from '@/mixins/sendAgree'
export default {
  name: 'ks-id',
  components: { TabWrapper, Tab },
  mixins: [toast, matchRoles, sendAgree],
  data() {
    return {
      ks2ById: null,
      agree: [],
      waitMyAgree: [],
      waitAgree: [],
      waitAndFutureAgree: [],
      sign: [],
      waitMySign: [],
      waitSign: [],
      waitAndFutureSign: [],
      ks2_status_code: null,
      workflowManagment: false,
      uniqstate: 'ks2form',
      readonly: true,
      ks2_workflow_id: null,
      isLoadForRefresh: true,
      modalCfg: {
        modalShow: false,
        showOK: false,
        showOKAgree: false,
        showOKExtra: false,
        showOKRemark: false,
        showOKSign: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'ks2idModule/getIsLoading',
      getKS2byid: 'ks2idModule/getKS2byid',
      getUser: 'authModule/getUser'
    })
  },
  methods: {
    ...mapActions({
      fetchKS2byId: 'ks2idModule/fetchKS2byId'
    }),
    async confirmAddExtraApprover() {
      let agreeGroups = [], signGroups = []
      let allList = []
      // Если этап согласования
      if(this.ks2_status_code === 'approval') {
        for(let i of this.agree) {
          for(let g of i.ks2_groups) {
            agreeGroups.push(g)
          }
        }
        allList = this.waitAndFutureAgree.concat(agreeGroups)
      }
      // Если этап подписания
      else {
        for(let i of this.sign) {
          for(let g of i.ks2_groups) {
            signGroups.push(g)
          }
        }
        allList = this.waitAndFutureSign.concat(signGroups)
      }
      this.modalCfg = {
        modalShow: true,
        title: this.$t('extra_approver'),
        component: 'add-extra-approver',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[95%]',
        waitAndFutureAgree: allList,
        tmpUsers: []
      }
    },
    async addExtraApprover() {
      if(this.modalCfg.tmpUsers.length === 0) {
        const msg = {
          msg_ru: 'Список пуст. Вы никого не выбрали',
          msg_en: 'The list is empty. You haven\'t chosen anyone'
        }
        this.onToast('danger', this.$t('error'), msg[`msg_${this.$i18n.locale}`])
      } else {
        await axios.post('api/ks2/addextraapprover', {
          data: this.modalCfg.tmpUsers,
          ks2_id: +this.$route.params.id,
          ks2_wf_id: +this.ks2_workflow_id
        })
        .then(data => {
          if(data.data.success) {
            this.onToast('success', this.$t('success'))
            this.onRefresh()
            this.modalCfg = {
              showOK: false,
              modalShow: false
            }
          } else {
            this.onToast('danger', this.$t('error'), data.data.message)
          }
        })
      }
    },
    async checkAgree() {
      const ks2_id = {
        id: this.$route.params.id,
        checked: true
      }
      this.modalCfg = {
        modalShow: true,
        title: this.$t('crypto.cert-select'),
        component: 'modal-agree',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[95%]',
        data: [ks2_id]
      }
    },
    async checkSendApproval() {
      const ks2_id = {
        id: this.$route.params.id,
        checked: true
      }
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        component: 'modal-exclamation',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[100%]',
        data: [ks2_id]
      }
    },
    async sendApproval() {
      await axios.post('api/ks2/startworkflow', {
        data: this.modalCfg.ready
      })
        .then(data => {
          if(data.data.success) {
            this.onToast('success', this.$t('wf-start-success'))
            this.onRefresh()
          } else {
            this.onToast('danger', this.$t('error'), data.message)
          }
        })
      this.modalCfg = {
        modalShow: false,
        showOK: false
      }
    },
    // Проверка перед запуском Подписания
    async checkSendSign() {
      const ks2_id = {
        id: this.$route.params.id,
        checked: true
      }
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        component: 'modal-exclamation-sign',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[100%]',
        data: [ks2_id]
      }
    },
    // Запуск подписания
    async sendSign() {
      await axios.post('api/ks2/startworkflow', {
        data: this.modalCfg.ready
      })
        .then(data => {
          if(data.data.success) {
            this.onToast('success', this.$t('wf-start-success'))
            this.onRefresh()
          } else {
            this.onToast('danger', this.$t('error'), data.message)
          }
        })
      this.modalCfg = {
        modalShow: false,
        showOKSign: false
      }
    },
    async checkSign() {
      const ks2_id = {
        id: this.$route.params.id,
        checked: true
      }
      this.modalCfg = {
        modalShow: true,
        title: this.$t('crypto.cert-select'),
        component: 'modal-agree',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[95%]',
        data: [ks2_id]
      }
    },
    async confirmRemark() {
      this.modalCfg = {
        modalShow: true,
        showOKRemark: true,
        title: this.$t('add-remark'),
        component: 'create-remark',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[100%]',
        textRemark: null,
      }
    },
    async sendRemark() {
      if(this.modalCfg.textRemark && this.modalCfg.textRemark.length > 0) {
        this.modalCfg.error = {}
        let groupId
        if(this.waitMyAgree[0]?.ks2_groups) groupId = this.waitMyAgree[0].ks2_groups[0].id
        if(this.waitMySign[0]?.ks2_groups) groupId = this.waitMySign[0].ks2_groups[0].id
        const data = {
          ks2_id: +this.$route.params.id,
          ks2_wf_id: this.ks2_workflow_id,
          textRemark: this.modalCfg.textRemark,
          group_id: groupId
        }
        await axios.post('api/ks2/addremark', {
          data: data
        })
          .then(data => {
            if(data.data.success) {
              this.onToast('success', this.$t('success'))
              this.onRefresh()
            } else {
              this.onToast('danger', this.$t('error'), data.message)
            }
          })
        this.closeModal()
      } else {
        this.modalCfg.error = {
          is: true,
          message_ru: 'Необходимо указать причину доработки',
          message_en: 'It is necessary to specify the reason for revision'
        }
        this.onToast('danger', this.$t('error'), this.modalCfg.error[`message_${this.$i18n.locale}`])
      }
    },
    closeModal() {
      this.modalCfg = {
        showOK: false,
        modalShow: false
      }
    },
    onSave() {
      // let data = {
      //   ks2_metadate: [],
      //   ks2_total_sum: [],
      //   ks2_total_sum_incl: []
      // }
      // const ks2_metadata = this.$refs['ks2-metadata']
      // const ks2_total_sum = this.$refs['total-sum']
      // console.log(ks2_total_sum.ks2_total_sum)
    },
    async onRefresh() {
      this.isLoadForRefresh = true
      const data = await this.fetchKS2byId({ ks2_id: this.$route.params.id })
      this.isLoadForRefresh = false
      this.ks2ById = data
      this.ks2_workflow_id = data.data.ks2_workflow[0].id
      this.ks2_status_code = data.data.ks2_status.code
      this.waitAgree = data.waitAgree
      this.futureAgree = data.futureAgree
      // форма с мета-данными
      const ks2_metadata = this.$refs['ks2-metadata']
      ks2_metadata.form = {}
      ks2_metadata.form = { ...data.data }
      ks2_metadata.form.date_preparation = new Date(data.data.date_preparation)
      ks2_metadata.form.reporting_period = new Date(data.data.reporting_period)
      // форма с суммами
      const total_sum = this.$refs['total-sum']
      total_sum.saveData = {}
      total_sum.ks2_total_sum = {}
      total_sum.ks2_total_sum = { ...data.data.ks2_total_sum[0] }
      // суммы в том числе
      total_sum.ks2_total_sum_incl = {}
      total_sum.ks2_total_sum_incl = { ...data.data.ks2_total_sum_incl[0] }
      //- Согласанты
      this.agree = data.agree
      this.waitMyAgree = data.waitMyAgree
      const agreements = this.$refs['agreements']
      agreements.agree = data.agree
      agreements.waitAgree = data.waitAgree
      agreements.futureAgree = data.futureAgree
      agreements.waitMyAgree = data.waitMyAgree
      this.waitAndFutureAgree = await this.concatArray(data.waitAgree, data.futureAgree)
      agreements.waitAndFutureAgree = this.waitAndFutureAgree
      //- Подписанты
      const ks2_sign = this.$refs['ks2_sign']
      this.sign = data.sign
      this.waitMySign = data.waitMySign
      ks2_sign.sign = data.sign
      ks2_sign.waitSign = data.waitSign
      ks2_sign.futureSign = data.futureSign
      ks2_sign.waitMySign = data.waitMySign
      this.waitAndFutureSign = await this.concatArray(data.waitSign, data.futureSign)
      ks2_sign.waitAndFutureSign = this.waitAndFutureSign
      //- Комментарии
      const ks2_notes = this.$refs['ks2_notes']
      ks2_notes.groups = data.uniqeGroup
      this.$store.commit('countTitleModule/setCntComments', data.allCommentsCount)

      this.ks2_status_code = this.getKS2byid.ks2_status.code

      setTimeout(() => { this.isLoadForRefresh = false }, 500)
    },
    async concatArray(waitAgree, futureAgree) {
      let oneArr = [], twoArr = []
      waitAgree.forEach(w => {
        w?.ks2_groups.forEach(i => {
          i.index = 'wait'
          oneArr.push(i)
        })
      })
      if(futureAgree.length > 0) {
        futureAgree.forEach(f => {
          f.ks2_groups.forEach(i => {
            i.index = 'future'
            twoArr.push(i)
          })
        })
        const concatArrs = oneArr.concat(twoArr)
        return concatArrs
      } else {
        return oneArr
      }
    }
  },
  async mounted() {
    await this.matchRole('workflowManagment')
    const data = await this.fetchKS2byId({ ks2_id: this.$route.params.id })
    this.isLoadForRefresh = false
    this.ks2ById = data
    this.ks2_workflow_id = data.data.ks2_workflow[0].id
    this.ks2_status_code = data.data.ks2_status.code
    this.waitAgree = data.waitAgree
    // Метадата
    const metadata = this.$refs['ks2-metadata']
    metadata.form = { ...data.data }
    metadata.form.date_preparation = new Date(data.data.date_preparation)
    metadata.form.reporting_period = new Date(data.data.reporting_period)
    //- Суммы по акту
    const sum = this.$refs['total-sum']
    sum.ks2_total_sum = { ...data.data.ks2_total_sum[0] }
    sum.ks2_total_sum_incl = { ...data.data.ks2_total_sum_incl[0] }
    //- Согласанты
    this.agree = data.agree
    this.waitMyAgree = data.waitMyAgree
    const agreements = this.$refs['agreements']
    agreements.agree = data.agree
    agreements.waitAgree = data.waitAgree
    agreements.futureAgree = data.futureAgree
    agreements.waitMyAgree = data.waitMyAgree
    this.waitAndFutureAgree = await this.concatArray(data.waitAgree, data.futureAgree)
    agreements.waitAndFutureAgree = this.waitAndFutureAgree
    //- Подписанты
    const ks2_sign = this.$refs['ks2_sign']
    this.sign = data.sign
    this.waitMySign = data.waitMySign
    ks2_sign.sign = data.sign
    ks2_sign.waitSign = data.waitSign
    ks2_sign.futureSign = data.futureSign
    ks2_sign.waitMySign = data.waitMySign
    this.waitAndFutureSign = await this.concatArray(data.waitSign, data.futureSign)
    ks2_sign.waitAndFutureSign = this.waitAndFutureSign
    //- Комментарии
    const ks2_notes = this.$refs['ks2_notes']
    ks2_notes.groups = data.uniqeGroup
    this.$store.commit('countTitleModule/setCntComments', data.allCommentsCount)
  }
}
</script>