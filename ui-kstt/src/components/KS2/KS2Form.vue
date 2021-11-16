<template lang="pug">
div(class="h-full")
  //- title
  div(class="pt-2 font-bold text-center") {{ $t("ks2.acts") }}
  //- toolbar
  div.relative.py-1.flex.items-center
    dropdown-menu(
      v-if="KS2RegisterActions"
      :text="$t('actions')"
      textClass="hidden md:block"
      listAligh="left"
      listWidthClass="w-64"
    )
      template(v-slot:icon)
        svg-view-list(class="p-[2px] md:hidden block")
      template(v-slot:items)
        //- div(
        //-   class="flex items-center p-1 rounded cursor-pointer select-none hover:bg-gray-200 text-gray-500"
        //-   @click="onCreateKS2"
        //- )
        //-   svg-document(class="mr-2")
        //-   div {{ $t('ks2.create-card') }}
        //- Импортировать КС-2
        div(
          v-if="workflowManagmentKS3"
          class="flex items-center p-1 cursor-pointer select-none hover:bg-gray-200 text-gray-500 border-b-2"
          @click="onImportKS2"
        )
          svg-upload(class="mr-2")
          div {{ $t('ks2.import-card') }}
          input(
            ref="importKS2file"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            @change="onImportKS2Upload"
            hidden
          )
        //- Отправить на согласование выбранный список КС-2
        div(
          v-if="selectCheck > 0 && workflowManagmentKS3"
          class="flex items-center p-1 cursor-pointer select-none hover:bg-gray-200 text-gray-500"
          @click="checkSendApproval"
        )
          svg-pencilalt(class="mr-2")
          div {{ $t('send-approval') }} ({{ selectCheck }})
        //- Согласовать акты которые ожидают моего согласования
        div(
          v-if="selectCheck > 0 && negotiatorKS2"
          class="flex items-center p-1 cursor-pointer select-none hover:bg-gray-200 text-gray-500 border-b-2"
          @click="checkAgree"
        )
          svg-badge-check(class="mr-2 w-6")
          div {{ $t('agree') }} ({{ selectCheck }})
        //- Отправить на подписание выбранный список КС-2
        div(
          v-if="selectCheck > 0 && workflowManagmentKS3"
          class="flex items-center p-1 cursor-pointer select-none hover:bg-gray-200 text-gray-500"
          @click="checkSendSign"
        )
          svg-pencilalt(class="mr-2")
          div {{ $t('send-sign') }} ({{ selectCheck }})
        //- Подписать акты которые ожидают моего подписания
        div(
          v-if="selectCheck > 0 && negotiatorKS2"
          class="flex items-center p-1 cursor-pointer select-none hover:bg-gray-200 text-gray-500 border-b-2"
          @click="checkSign"
        )
          svg-badge-check(class="mr-2 w-6")
          div {{ $t('sign') }} ({{ selectCheck }})
        //- Удалить выбранный список КС-2
        div(
          v-if="selectCheck > 0 && workflowManagmentKS3"
          class="flex items-center p-1 cursor-pointer select-none hover:bg-gray-200 text-gray-500 border-t-2"
          @click="onDeleteKS2Confirm"
        )
          svg-trash(class="mr-2")
          div {{ $t('delete') }} ({{ selectCheck }})
    //- Фильтр по статусу
    div(class="flex justify-start items-center pl-2 text-sm w-full overflow-x-scroll")
      span(class="pr-1 font-bold min-w-[180px]") {{ this.$t('filter-status-ks2') }}:
      div(v-if="statusList.length > 0" class="flex")
        div(
          v-for="(status, idx) in statusList"
          :key="status.id"
          class="flex"
        )
          def-button(
            class="h-7 p-0 px-1 text-white border-2 border-[#77bbce] truncate duration-300" @click="onStatusFilter(status.code, idx)"
            :class="status.pressed ? 'bg-[#579bae]' : 'bg-[#77bbce]'"
          ) {{ this.$i18n.locale === 'ru' ? status.name_ru : status.name_en }}
  //- body
  div(class="relative h-[calc(100%-65px)] overflow-scroll bg-background-secondary px-1 rounded-md")
    table(class="relative border-separate border-spacing-0 text-center text-sm" v-resize-column)
      tr(class="sticky top-0 z-[1] bg-background-tertiary")
        table-header(
          :headers="ks2RegisterHeaders",
          :store="ks2Register"
          @update:setSorted="setSorted"
          @update:searchQuery="searchQuery"
          ref="table_header"
          )
      tr(
        v-for="(item, idx) in ks2Register"
        :ket="item.id"
        class="relative even:bg-background-primary break-words transition-all duration-700"
        :class="item.truncate ? 'h-[10px]' : 'h-[150px]'"
      )
        //- No
        //- td {{ idx+1 }}
        //- Check
        td
          input(
            type="checkbox"
            :checked="item.checked"
            class="cursor-pointer"
            @change="chancgeCheckbox($event, item)"
          )
        //- Action
        td(class="px-1")
          div(class="flex justify-center items-center h-full")
            svg-external(
              v-ttip="$t('open-card')"
              class="cursor-pointer"
              @click="$router.push(`/ks2/${item.id}`)"
            )
            svg-trash(
              v-if="KS2Delete"
              v-ttip="$t('delete')"
              class="cursor-pointer ml-2"
              @click="onConformDelKS2(item)"
            )
        //- Truncate
        //- td(class='flex justify-center pt-2')
        //-   div(class="cursor-pointer" @click="showHideText($event, idx)")
        //-     svg-plus(v-if="item.truncate")
        //-     svg-minus(v-else)
        //- Номер документа
        td {{ item.document_number }}
        //- Дата составления
        td {{ formatDate(item.date_preparation) }}
        //- Отчетный период
        td {{ formatDate(item.reporting_period, 'LLLL yyyy') }}
        //- Статус
        td(class="min-w-[130px]") {{ this.$i18n.locale == 'ru' ? item.ks2_status.name_ru : item.ks2_status.name_en }}
        //- Excel
        td(class="max-w-[50px]")
          div(class="flex justify-center")
            svg-document-text(
              v-if="item?.ks2_file_excel?.id" class="cursor-pointer text-green-500"
              @click="onDownload(item.ks2_file_excel)"
            )
            span(v-else) {{ '-' }}
        //- PDF
        td(class="max-w-[50px]")
          div(class="flex justify-center")
            svg-document-text(
              v-if="item?.ks2_file_pdf?.id" class="cursor-pointer text-red-400"
              @click="onDownload(item.ks2_file_pdf)"
            )
            span(v-else) {{ '-' }}
        //- КС-6а
        td(class="max-w-[50px]")
          div(class="flex justify-center")
            svg-document-text(
              v-if="item?.ks6a_file_pdf?.id" class="cursor-pointer text-red-400"
              @click="onDownload(item.ks6a_file_pdf)"
            )
            span(v-else) {{ '-' }}
        //- Локальный номер сметы
        td(class="min-w-[150px]") {{ item.estimate_local_number }}
        //- ККС и ревизия
        td(class="max-w-[150px] appearance-none" :class="item.truncate ? 'truncate' : null")
          span(v-if="item.kks") {{ item.kks }} ({{ item.revision }})
          span(v-else) -
        //- Согласовано
        td(class="min-w-[250px] text-left pl-1 text-sm")
          div(v-if="item.ks2_approv.length > 0")
            div(
              v-for="approv in item.ks2_approv"
              :key="approv.id"
            )
              div(class="flex justify-between")
                div.flex
                  svg-check(v-if="approv.complete" class="text-green-500 h-5")
                  svg-close(v-else class="h-5" :class="{'text-red-400': approv.remark?.length > 0}")
                  div {{ approv[`name_${$i18n.locale}`] }}
                svg-question(
                  v-ttip="approv.ks2_users, {placement: 'top', displayValue: 'full_name'}"
                  class="h-5 cursor-pointer"
                )
          div(v-else class="text-center") {{ '-' }}
        //- Подписано
        td(class="min-w-[250px] text-left pl-1 text-sm")
          div(v-if="item.ks2_sign.length > 0")
            div(
              v-for="sign in item.ks2_sign"
              :key="sign.id"
            )
              div(class="flex justify-between")
                div.flex
                  svg-check(v-if="sign.complete" class="text-green-500 h-5")
                  svg-close(v-else class="h-5")
                  div {{ sign[`name_${$i18n.locale}`] }}
                svg-question(
                  v-ttip="sign.ks2_users, {placement: 'top', displayValue: 'full_name'}"
                  class="h-5 cursor-pointer"
                )
          div(v-else class="text-center") {{ '-' }}
        //- Код здания
        td {{ item.building_code ? item.building_code : '-' }}
        //- Договор подряда
        td {{ item.subcontract_number }}
        //- Дата подряда
        td {{ formatDate(item.subcontract_date) }}
        //- Итого по акту
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].total_act) }}
        //- Итого по акту к оплате с учетом НДС 18%
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].total_certificate_paid) }}
        //- Итого по акту с учетом НР и СП
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].total_act_OEP) }}
        //- Итого по акту с учетом понижающего коэффициента 0,9318
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].act_total_reduction_coefficient) }}
        //- строительные работы
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].construction_works) }}
        //- монтажные работы
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].installation_works) }}
        //- оборудование
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].equipment) }}
        //- прочие работы и затраты
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].other_works_costs) }}
        //- накладные расходы и прибыль (25% от ПЗ)
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].overheads_profit) }}
        //- Оплата непредвиденных расходов и затрат, связанных с реализацией рисков Подрядчика
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].contractor_risk) }}
        //- НДС 18% в соответствии с законодательством Турецкой Республики
        td {{ numberWithSpaces(item.ks2_total_sum_incl[0].vat_turkish) }}
        //- Общая
        td {{ numberWithSpaces(item.ks2_total_sum[0].total) }}
        //- Основная зарплата
        td {{ numberWithSpaces(item.ks2_total_sum[0].basic_salary) }}
        //- Эксплуатация машин
        td {{ numberWithSpaces(item.ks2_total_sum[0].operation_mechanisms) }}
        //- Зарплата машинистов
        td {{ numberWithSpaces(item.ks2_total_sum[0].salary_mechanics) }}
        //- Материалы
        td {{ numberWithSpaces(item.ks2_total_sum[0].materials) }}
        //- Трудозатраты рабочих, чел.-ч
        td {{ numberWithSpaces(item.ks2_total_sum[0].labor_workers) }}
        //- Трудозатраты машинистов, чел.-ч
        td {{ numberWithSpaces(item.ks2_total_sum[0].labor_mechanics) }}
        //- Автор
        td(class="max-w-[100px] appearance-none text-left" :class="item.truncate ? 'truncate' : null")
          span {{ item.user.full_name }}
        //- Дата создания карточки КС-2
        td {{ formatDate(item.create_at) }}
    //- load
    div(v-if="ks2Register.length === 0 && getIsLoadingKS2" class="flex justify-center items-center w-full mt-5")
      svg-loading
      p {{ $t('loading') }}
    div(
      v-if="(ks2Register.length === 0 && !getIsLoadingKS2)"
      class="mt-5 fixed"
    )
      p {{ $t('no-data') }}
    div(v-if="isUpload" class="absolute top-0 bg-gray-400 bg-opacity-50 w-full h-full flex items-center justify-center")
      div(class="bg-background-secondary rounded-md p-4 flex items-center justify-center")
        svg-loading
        p {{ $t('loading') }}
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(v-if="modalCfg.component != 'modal-exclamation' && modalCfg.component != 'modal-agree' && modalCfg.component != 'modal-exclamation-sign'" class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
      def-button(v-if="modalCfg.showOK" class="text-white bg-[#06d6a0]" @click="sendApproval") {{ $t('send-approval') }}
      def-button(v-if="modalCfg.showOKAgree" class="text-white bg-[#06d6a0]" @click="sendAgree") {{ $t('agree') }}
      def-button(v-if="modalCfg.showOKSign" class="text-white bg-[#06d6a0]" @click="sendSign") {{ $t('send-sign') }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import axios from "axios";
import { format, addMinutes } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'

import toast from '@/mixins/toast'
import matchRoles from '@/mixins/matchRoles'
import fileSave from '@/mixins/fileSave'
import numberWithSpaces from '@/mixins/numberWithSpaces'
import sendAgree from '@/mixins/sendAgree'
export default {
  name: 'ks2-form',
  mixins: [fileSave, toast, numberWithSpaces, matchRoles, sendAgree],
  data() {
    return {
      KS2RegisterActions: false,
      negotiatorKS2: false,
      workflowManagmentKS3: false,
      KS2Delete: false,
      ks2Register: [],
      isUpload: false,
      id: this.$route.params.id,
      ru: ru,
      en: enGB,
      defaultFilter: ['all', 'project', 'approval', 'agreed', 'fixing'],
      selectedFilter: [],
      statusList: [],
      filterPressedCount: 0,
      ks2RegisterHeaders: [
        { title: '', type: 'checkbox' },
        { title: '', type: 'action' },
        { title: 'ks3.document-number', sorted: 'document_number', asc: true, search: 'document_number' },
        { title: 'ks3.date-preparation', sorted: 'date_preparation', asc: true, date: true },
        { title: 'ks3.reporting-period', sorted: 'reporting_period', asc: true, date: true },
        { title: 'ks2.status', sorted: 'ks2.ks2_status', asc: true },
        { title: 'excel-form' }, { title: 'pdf-form' }, { title: 'ks6a-form' },
        { title: 'estimate', sorted: 'estimate_local_number', asc: true, search: 'estimate_local_number' },
        { title: 'kks', sorted: 'kks', asc: true, search: 'kks' },
        { title: 'agred' },
        { title: 'signed' },
        { title: 'building_code', sorted: 'building_code', asc: true },
        { title: 'subcontract', sorted: 'subcontract_number', asc: true },
        { title: 'subcontract-date', sorted: 'subcontract_date', asc: true, date: true },
        { title: 'total_act', sorted: 'total_act', asc: true },
        { title: 'total_certificate_paid', sorted: 'total_certificate_paid', asc: true },
        { title: 'total_act_OEP', sorted: 'total_act_OEP', asc: true },
        { title: 'act_total_reduction_coefficient', sorted: 'act_total_reduction_coefficient', asc: true },
        { title: 'construction_works', sorted: 'construction_works', asc: true },
        { title: 'installation_works', sorted: 'installation_works', asc: true },
        { title: 'equipment', sorted: 'equipment', asc: true },
        { title: 'other_works_costs', sorted: 'other_works_costs', asc: true },
        { title: 'overheads_profit', sorted: 'overheads_profit', asc: true },
        { title: 'contractor_risk', sorted: 'contractor_risk', asc: true },
        { title: 'vat_turkish', sorted: 'vat_turkish', asc: true },
        { title: 'total', sorted: 'total', asc: true },
        { title: 'basic_salary', sorted: 'basic_salary', asc: true },
        { title: 'operation_mechanisms', sorted: 'operation_mechanisms', asc: true },
        { title: 'salary_mechanics', sorted: 'salary_mechanics', asc: true },
        { title: 'materials', sorted: 'materials', asc: true },
        { title: 'labor_workers', sorted: 'labor_workers', asc: true },
        { title: 'labor_mechanics', sorted: 'labor_mechanics', asc: true },
        { title: 'ks3.author' },
        { title: 'create-date', sorted: 'ks2.create_at', asc: true }
      ],
      modalCfg: {
        showOK: false,
        showOKAgree: false,
        modalShow: false,
        showOKSign: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getIsLoadingKS3: 'ks3idModule/getIsLoading',
      getKS3id: 'ks3idModule/getKS3id',
      getIsLoadingKS2: 'ks2idModule/getIsLoading',
      getKS2id: 'ks2idModule/getKS2id',
      getKs2StatusList: 'ks2idModule/getKs2StatusList'
    }),
    selectCheck() {
      let count = 0
      this.ks2Register.forEach((i) => {
        if(i.checked) count++
      })
      return count
    }
  },
  methods: {
    ...mapActions({
      fetchKS3id: 'ks3idModule/fetchKS3id',
      fetchKS2: 'ks2idModule/fetchKS2',
      fetchKS2StatusList: 'ks2idModule/fetchKS2StatusList'
    }),
    async checkSendApproval() {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        component: 'modal-exclamation',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[100%]',
        data: this.ks2Register
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
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        component: 'modal-exclamation-sign',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[100%]',
        data: this.ks2Register
      }
    },
    // Запуск подписания
    async sendSign() {
      await axios.post('api/ks2/startworkflow', {
        data: this.modalCfg.ready
      })
        .then(data => {
          if(data.data.success) {
            this.onToast('success', this.$t('wf-sign-start-success'))
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
    async checkAgree() {
      let data = []
      this.ks2Register.forEach((i) => {
        if(i.checked) data.push(i)
      })
      this.modalCfg = {
        modalShow: true,
        title: this.$t('crypto.cert-select'),
        component: 'modal-agree',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[95%]',
        data: data
      }
    },
    async checkSign() {
      let data = []
      this.ks2Register.forEach((i) => {
        if(i.checked) data.push(i)
      })
      this.modalCfg = {
        modalShow: true,
        title: this.$t('crypto.cert-select'),
        component: 'modal-agree',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-auto max-h-[95%]',
        data: data
      }
    },
    onStatusFilter(code, idx) {
      const count = this.statusList.length
      const currentPressed = this.statusList[idx].pressed
      // Если выбираем Всё
      if(code === 'all') {
        this.selectedFilter = []
        this.statusList.forEach(i => {
          currentPressed ? i.pressed = false : i.pressed = true
        })
        if(currentPressed) {
          this.selectedFilter = []
          this.filterPressedCount = 0
        } else {
          this.selectedFilter = ['all']
          this.filterPressedCount = count
        }
      }
      // Единичный выбор
      else {
        if(!currentPressed) {
          this.selectedFilter.push(this.statusList[idx].code)
          this.filterPressedCount++
        } else {
          const matchIndex = this.selectedFilter.findIndex(i => i === this.statusList[idx].code)
          this.selectedFilter.splice(matchIndex, 1);
          this.filterPressedCount--
        }
        this.statusList[idx].pressed = !currentPressed
        this.statusList[count - 1].pressed ? this.filterPressedCount-- : null
        // Если кол-во нажатых единичных фильтров достигло максимума то жмем All
        if(this.filterPressedCount === count-1) {
          this.statusList[count - 1].pressed = true
          this.filterPressedCount = count
          this.selectedFilter = ['all']
        } else {
          this.selectedFilter = []
          this.statusList[count - 1].pressed = false
          this.statusList.forEach(i => {
            if(i.pressed) this.selectedFilter.push(i.code)
          })
        }
      }
      this.fetchKS2({ks3_id: this.id, filter: this.selectedFilter})
    },
    async setSorted(head, index) {
      const sort = head.asc ? 'ASC' : 'DESC'
      await this.fetchKS2({ks3_id: this.id, index: index, sort: sort, filter: this.selectedFilter})
        .then(() => {
          let store = this.getKS2id.map((i) => {
            i.checked = this.ks2Register.find(j => j.id === i.id).checked
            i.truncate = true
            return i
          })
          this.ks2Register = store
        })
    },
    async searchQuery(value, index) {
      await this.fetchKS2({ks3_id: this.id, filter: this.selectedFilter, searchIndex: index, search: value})
        .then(() => {
          let store = this.getKS2id.map((i) => {
            i.checked = this.ks2Register.find(j => j.id === i.id).checked
            i.truncate = true
            return i
          })
          this.ks2Register = store
        })
    },
    async onCreateKS2() {
      console.log(123);
    },
    onDeleteKS2Confirm() {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('multi-delete-ks2', {count: this.selectCheck}),
        component: 'confirm',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[25%]',
        fn: 'onDeleteKS2'
      }
    },
    async onDeleteKS2() {
      let data = []
      this.ks2Register.forEach((i) => {
        if(i.checked) data.push({
          ks2_id: i.id,
          ks3_id: i.ks3_id
        })
      })
      await axios.post('api/ks2/multidelete', {
        data: data
      })
      .then((data) => {
        if(data?.data?.success) {
          this.onToast('success', this.$t('success'))
          this.fetchKS2({ks3_id: this.id, filter: this.selectedFilter})
        } else {
          this.onToast('danger', this.$t('error'))
        }
      })
    },
    async onConformDelKS2(item) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('delete-ks2'),
        component: 'delete-group-in-stage',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[25%]',
        data: item
      }
    },
    saveAndCloseModal() {
      if(this.modalCfg.component === 'delete-group-in-stage') {
        this.onDelKS2(this.modalCfg.data)
      }
      if(this.modalCfg.component === 'confirm') {
        this[this.modalCfg.fn]()
      }
      this.closeModal()
      this.onRefresh()
    },
    closeModal() {
      this.modalCfg = {
        showOK: false,
        modalShow: false
      }
    },
    async onDelKS2(item) {
      const params = {
        ks2_id: item.id,
        ks3_id: item.ks3_id
      }
      await axios.delete('api/ks2/delete', {
        params: params
      })
      .then((data) => {
        if(data?.data?.success) {
          this.onToast('success', this.$t('success'))
          this.fetchKS2({ks3_id: this.id, filter: this.selectedFilter})
        } else {
          this.onToast('danger', this.$t('error'))
        }
      })
    },
    async onLoad() {
      await this.fetchKS2StatusList()
        .then(() => {
          if(this.negotiatorKS2) this.defaultFilter.push('requires_my_approval')
          let countPressed = 0
          // Если в фильтре по умолчанию есть all, то все остальные не имееют значения
          const checkAll = this.defaultFilter.find(df => df === 'all')
          if(checkAll) this.selectedFilter = ['all']
          let statusList = this.getKs2StatusList.map((i) => {
            if(checkAll) {
              i.pressed = true
            }
            else {
              if(this.defaultFilter.find(df => df === i.code)) {
                i.pressed = true
                countPressed++
                this.selectedFilter.push(i.code)
              } else { i.pressed = false }
            }
            return i
          })
          // Если роль согласанта КС-2 то добавляем "Требуют моего согласования"
          if(this.negotiatorKS2) {
            if(!checkAll) this.selectedFilter.push('requires_my_approval')
            statusList.push({
              code: 'requires_my_approval',
              name_ru: 'Требует моего согласования',
              name_en: 'Requires my approval',
              pressed: true
            })
          }
          statusList.push({
            code: 'all',
            name_ru: 'Все',
            name_en: 'All',
            pressed: checkAll ? true : false
          })
          this.statusList = statusList
          if(checkAll) {
            this.filterPressedCount = statusList.length
          } else {
            this.filterPressedCount = countPressed
          }
        })
      await this.fetchKS2({ks3_id: this.id, filter: this.selectedFilter})
        .then(() => {
          let store = this.getKS2id.map((i) => {
            i.checked = false
            i.truncate = true
            return i
          })
          this.ks2Register = store
        })
    },
    async onRefresh(parent) {
      this.ks2Register = []
      this.$refs.table_header.$refs.checked_header.checked = false
      this.selectedFilter = []
      await this.onLoad()
      if(!parent) await this.fetchKS3id(this.id)
    },
    async onImportKS2() {
      let importKS2file = this.$refs.importKS2file;
      importKS2file.click();
    },
    async onImportKS2Upload(event) {
      this.isUpload = true
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append('file', file);
      formData.append('ks3_id', this.getKS3id[0].id)
      formData.append('workflow_id', this.getKS3id[0].workflow_id)

      await axios.post( 'api/ks2/excelupload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((data) => {
        if(data?.data.success) {
          this.onToast('success', this.$t('ks2-upload', {file: file.name}))
          this.onRefresh()
        } else {
          this.onToast('danger', this.$t('upload-error'), data.data[`message_${this.$i18n.locale}`])
        }
        this.isUpload = false
      })
    },
    formatDate(date, formatType) {
      date = new Date(date)
      let iformat
      if(formatType) {
        iformat = formatType
      } else {
        iformat = this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
      }
      return format(
        addMinutes(date, date.getTimezoneOffset()),
        iformat,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    },
    // Скачать файл
    async onDownload(file_info) {
      if(file_info?.uuid) {
        await axios.get(`api/ks2/download/${file_info.uuid}`, {
          responseType: 'blob'
        })
        .then((resp) => {
          this.onFileSave(resp.data, file_info.name)
        })
      }
    },
    chancgeCheckbox(e, item) {
      let countCheck = 0
      const checked = e.target.checked
      this.ks2Register.forEach(i => {
        if(i.id === item.id) {
          i.checked = checked
        }
        if(i.checked) countCheck++
      })
      countCheck === this.ks2Register.length
        ? this.$refs.table_header.$refs.checked_header.checked = true
        : this.$refs.table_header.$refs.checked_header.checked = false
    },
    showHideText(e, idx) {
      this.ks2Register[idx].truncate = !this.ks2Register[idx].truncate
      // let el = e.currentTarget.closest('tr')
      // el.children.forEach(node => {
      //   node.classList.forEach(i => {
      //     if(i == 'truncate') {
      //       node.classList.remove('truncate')
      //       this.ks2Register[idx].truncate = false
      //     } else {
      //       node.classList.add('truncate')
      //       this.ks2Register[idx].truncate = true
      //     }
      //   })
      // })
    }
  },
  async mounted() {
    await this.matchRole('KS2RegisterActions')
    await this.matchRole('KS2Delete')
    await this.matchRole('negotiatorKS2')
    await this.matchRole('workflowManagmentKS3')
    await this.onLoad()
  },
  watch: {
    getKS2id(val) {
      let store = val.map((i) => {
          i.checked = false
          i.truncate = true
          return i
        })
      this.ks2Register = store
      this.$refs.table_header.$refs.checked_header.checked = false
    }
  }
}
</script>