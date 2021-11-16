<template lang="pug">
div
  div(class="lg:flex")
    //- Номмер документа
    label(class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('ks3.document-number') }}:
    div.relative.flex.w-full.items-center
      input(
        v-model="v$.form.document_number.$model"
        type="text"
        class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
        :class="v$.form.document_number.$errors.length === 0 ? 'border-gray-200' : 'border-red-500', readonly ? 'h-5' : 'pl-8'"
        :readonly="readonly"
      )
      div(v-if="!readonly" :class="form.document_number != getKS2byid.document_number ? 'text-red-400' : 'text-gray-500'")
        svg-refresh(
          class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
          @click="resetDefaultValue('document_number', 'string', $event)"
        )
      div(
        class="w-8 text-red-500 flex items-center"
      )
        svg-exclamation(
          class="cursor-pointer"
          v-show="v$.form.document_number.$errors.length > 0"
          v-ttip="v$.form.document_number.$errors[0]?.$message"
        )
    //- Дата составления
    label(class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('ks3.date-preparation') }}:
    div.relative.flex.w-full.items-center
      datepicker(
        v-model="form.date_preparation"
        :inputFormat="this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'"
        :locale="this.$i18n.locale == 'ru' ? ru : en"
        ref="date_preparation"
        class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
        :class="readonly ? 'h-6' : 'pl-8'"
        :disabled="readonly"
      )
      div(v-if="!readonly" :class="new Date(form.date_preparation).getTime() != new Date(getKS2byid.date_preparation).getTime() ? 'text-red-400' : 'text-gray-500'")
        svg-refresh(
          class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-2",
          @click="resetDefaultValue('date_preparation', 'date', $event)"
        )
      div(v-if="!readonly" @click="setFocus('date_preparation')" class="cursor-pointer text-gray-500 absolute top-[3px] right-[35px]")
        svg-calendar
      div.w-8
    //- Отчетный период
    label(for="reporting_period" class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('ks3.reporting-period') }}:
    div.flex.relative.w-full.items-center
      datepicker(
        v-model="form.reporting_period"
        :inputFormat="'LLLL yyyy'"
        :locale="this.$i18n.locale == 'ru' ? ru : en"
        minimum-view="month"
        starting-view="year"
        month-list-format="LLLL"
        ref="reporting_period"
        class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
        :class="readonly ? 'h-6' : 'pl-8'"
        :disabled="readonly"
      )
      div(v-if="!readonly" :class="new Date(form.reporting_period).getTime() != new Date(getKS2byid.reporting_period).getTime() ? 'text-red-400' : 'text-gray-500'")
        svg-refresh(
          class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-2",
          @click="resetDefaultValue('reporting_period', 'date', $event)"
        )
      div(v-if="!readonly" @click="setFocus('reporting_period')" class="cursor-pointer text-gray-500 absolute top-[3px] right-[35px]")
        svg-calendar
      div.w-8
  //- Смета
  div(class="lg:flex pt-2")
    label(class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('estimate') }}:
    div.relative.flex.w-full.items-center
      input(
        v-model="v$.form.estimate_local_number.$model"
        type="text"
        class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
        :class="v$.form.estimate_local_number.$errors.length === 0 ? 'border-gray-200' : 'border-red-500', readonly ? 'h-5' : 'pl-8'"
        :readonly="readonly"
      )
      div(v-if="!readonly" :class="form.estimate_local_number != getKS2byid.estimate_local_number ? 'text-red-400' : 'text-gray-500'")
        svg-refresh(
          class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
          @click="resetDefaultValue('estimate_local_number', 'string', $event)"
        )
      div(
        class="w-8 text-red-500 flex items-center"
      )
        svg-exclamation(
          class="cursor-pointer"
          v-show="v$.form.estimate_local_number.$errors.length > 0"
          v-ttip="v$.form.estimate_local_number.$errors[0]?.$message"
        )
    //- ККС
    label(class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('kks') }}:
    div.relative.flex.w-full.items-center
      input(
        v-model="v$.form.kks.$model"
        type="text"
        class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
        :class="v$.form.kks.$errors.length === 0 ? 'border-gray-200' : 'border-red-500', readonly ? 'h-5' : 'pl-8'"
        :readonly="readonly"
      )
      div(v-if="!readonly" :class="form.kks != getKS2byid.kks ? 'text-red-400' : 'text-gray-500'")
        svg-refresh(
          class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
          @click="resetDefaultValue('kks', 'string', $event)"
        )
      div(
        class="w-8 text-red-500 flex items-center"
      )
        svg-exclamation(
          class="cursor-pointer"
          v-show="v$.form.kks.$errors.length > 0"
          v-ttip="v$.form.kks.$errors[0]?.$message"
        )
    //- Здание
    label(class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('building_code') }}:
    div.relative.flex.w-full.items-center
      input(
        v-model="v$.form.building_code.$model"
        type="text"
        class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
        :class="v$.form.building_code.$errors.length === 0 ? 'border-gray-200' : 'border-red-500', readonly ? 'h-5' : 'pl-8'"
        :readonly="readonly"
      )
      div(v-if="!readonly" :class="form.building_code != getKS2byid.building_code ? 'text-red-400' : 'text-gray-500'")
        svg-refresh(
          class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
          @click="resetDefaultValue('building_code', 'string', $event)"
        )
      div(
        class="w-8 text-red-500 flex items-center"
      )
        svg-exclamation(
          class="cursor-pointer"
          v-show="v$.form.building_code.$errors.length > 0"
          v-ttip="v$.form.building_code.$errors[0]?.$message"
        )
  //- Файл
  div(class="lg:flex pt-2")
    //- Excel
    label(class="flex items-center lg:justify-between justify-start select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary")
      div {{ $t('excel-form') }}:
      ctx-menu(
        listAlign="bottom"
        listWidthClass="w-[220px]"
        :arrow="true"
        class="border border-border-color-primary rounded-md hover:text-gray-700 ml-2 lg:ml-0"
      )
        template(v-slot:icon)
          svg-papperclip
        template(v-slot:items)
          div(
            class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
            @click.stop.prevent="onDownload(getKS2byid.ks2_file_excel)"
          )
            svg-download(class="border-r-2")
            div.pl-2 {{ $t('download') }}
          hr
          div(
            v-if="KS2FileExcelKS6a"
            class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
          )
            svg-upload(class="border-r-2")
            div.pl-2 {{ $t('upload-new-version') }}
            input(
              ref="uploadKS2Excel"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="onUploadKS2NewVersion"
              hidden
            )
          hr
          div(
            class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
            @click.prevent="onVersionArchive('ks2_excel')"
          )
            svg-archive(class="border-r-2")
            div.pl-2 {{ $t('archive-version') }}
    div(
      v-if="getKS2byid.ks2_file_excel && !ks2ExcelPdfLoad"
      class="text-blue-600 pt-1 pr-2 text-sm underline appearance-none w-full truncate"
    )
      span(class="cursor-pointer" @click="onDownload(getKS2byid.ks2_file_excel)") {{ getKS2byid.ks2_file_excel.name }}
    div(
      v-else-if="ks2ExcelPdfLoad"
      class="pt-1 pr-2 appearance-none w-full h-full flex justify-center items-center"
    )
      svg-loading
      p {{ $t('loading') }}
    div(
      v-else
      class="pt-1 pr-2 appearance-none w-full"
    ) -
    //- PDF
    label(class="flex items-center lg:justify-between justify-start select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary")
      div {{ $t('pdf-form') }}:
      ctx-menu(
        listAlign="bottom"
        listWidthClass="w-[220px]"
        :arrow="true"
        class="border border-border-color-primary rounded-md hover:text-gray-700 ml-2 lg:ml-0"
      )
        template(v-slot:icon)
          svg-papperclip
        template(v-slot:items)
          div(
            v-if="getKS2byid.ks2_file_pdf"
            class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
            @click.stop.prevent="onDownload(getKS2byid.ks2_file_pdf)"
          )
            svg-download(class="border-r-2")
            div.pl-2 {{ $t('download') }}
          hr
          div(
            v-if="getKS2byid.ks2_file_pdf"
            class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
            @click.prevent="onViewPDFInWindow(getKS2byid.ks2_file_pdf)"
          )
            svg-eye(class="border-r-2")
            div.pl-2 {{ $t('preview') }}
          hr
          div(
            class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
            @click.prevent="onVersionArchive('ks2_pdf')"
          )
            svg-archive(class="border-r-2")
            div.pl-2 {{ $t('archive-version') }}
    div(
      v-if="getKS2byid.ks2_file_pdf && !ks2ExcelPdfLoad"
      class="text-blue-600 pt-1 pr-2 text-sm underline appearance-none w-full truncate"
    )
      span(class="cursor-pointer" @click="onViewPDFInWindow(getKS2byid.ks2_file_pdf)") {{ getKS2byid.ks2_file_pdf.name }}
    div(
      v-else-if="ks2ExcelPdfLoad"
      class="pt-1 pr-2 appearance-none w-full h-full flex justify-center items-center"
    )
      svg-loading
      p {{ $t('loading') }}
    div(
      v-else
      class="pt-1 pr-2 appearance-none w-full"
    ) -
    //- КС-6а
    label(class="flex items-center lg:justify-between justify-start select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary")
      div {{ $t('ks6a-form') }}:
      ctx-menu(
          listAlign="bottom"
          listWidthClass="w-[220px]"
          :arrow="true"
          class="border border-border-color-primary rounded-md hover:text-gray-700 ml-2 lg:ml-0"
        )
          template(v-slot:icon)
            svg-papperclip
          template(v-slot:items)
            div(
              v-if="getKS2byid.ks6a_file_pdf"
              class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
              @click.stop.prevent="onDownload(getKS2byid.ks6a_file_pdf)"
            )
              svg-download(class="border-r-2")
              div.pl-2 {{ $t('download') }}
            hr
            div(
              v-if="KS2FileExcelKS6a"
              class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
            )
              svg-upload(class="border-r-2")
              div.pl-2 {{ $t('upload-new-version') }}
              input(
                ref="uploadKS2Excel"
                type="file"
                accept="application/pdf"
                @change="onUploadKS6aNewVersion"
                hidden
              )
            hr
            div(
              v-if="getKS2byid.ks6a_file_pdf"
              class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
              @click.prevent="onViewPDFInWindow(getKS2byid.ks6a_file_pdf)"
            )
              svg-eye(class="border-r-2")
              div.pl-2 {{ $t('preview') }}
            hr
            div(
              v-if="getKS2byid.ks6a_file_pdf && KS2FileExcelKS6a"
              class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
              @click.prevent="onDeleteConfirm(getKS2byid.ks6a_file_pdf)"
            )
              svg-trash(class="border-r-2")
              div.pl-2 {{ $t('delete') }}
            hr
            div(
              class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
              @click.prevent="onVersionArchive('ks6a')"
            )
              svg-archive(class="border-r-2")
              div.pl-2 {{ $t('archive-version') }}
    div(
      v-if="getKS2byid.ks6a_file_pdf && !ks6aLoad"
      class="text-blue-600 pt-1 pr-2 text-sm underline appearance-none w-full truncate"
    ) 
      span(class="cursor-pointer" @click="onViewPDFInWindow(getKS2byid.ks6a_file_pdf)") {{ getKS2byid.ks6a_file_pdf.name }}
    div(
      v-else-if="ks6aLoad"
      class="pt-1 pr-2 appearance-none w-full h-full flex justify-center items-center"
    )
      svg-loading
      p {{ $t('loading') }}
    div(
      v-else
      class="pt-1 pr-2 appearance-none w-full"
    ) -
    //- КС-2 и КС-6а
    div(v-if="getKS2byid.ks6a_file_pdf && !ks6aLoad")
      ctx-menu(
        listAlign="left"
        listWidthClass="w-[150px]"
        :arrow="true"
        class="max-w-[120px] border border-border-color-primary rounded-md hover:text-gray-700 lg:ml-0"
      )
        template(v-slot:icon)
          svg-eye
          div(class="pl-1 min-w-[70px]") {{ $t('ks2-ks6a') }}
        template(v-slot:items)
          div(
            class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
            @click="onViewKS2andKS6a('lr')"
          )
            svg-right(class="border-r-2")
            div.pl-2 {{ $t('left-right') }}
          hr
          div(
            class="w-full flex justify-start items-center hover:text-gray-700 duration-100 cursor-pointer h-6"
            @click="onViewKS2andKS6a('tb')"
          )
            svg-down(class="border-r-2")
            div.pl-2 {{ $t('top-bottom') }}
          hr
    div(
      v-else-if="ks6aLoad"
      class="pt-1 pr-2 appearance-none w-full h-full flex justify-center items-center"
    )
      svg-loading
      p {{ $t('loading') }}
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(v-if="showOKBtn" class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
      def-button(v-if="this.modalCfg.component === 'view-two-pdf'" class="text-white bg-[#06d6a0]" @click="changeType")
        svg-refresh
</template>
<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import axios from 'axios'
import { getCurrentInstance } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'
import Datepicker from 'vue3-datepicker'
import { enGB, ru } from 'date-fns/locale'

import fileSave from '@/mixins/fileSave'
import toast from '@/mixins/toast'
import matchRoles from '@/mixins/matchRoles'
export default {
  name: 'ks2-metadata',
  mixins: [fileSave, toast, matchRoles],
  components: {
    Datepicker
  },
  setup () {
    const instance = getCurrentInstance();
    return {
      v$: useVuelidate(),
      instance: instance
    }
  },
  data() {
    return {
      KS2FileExcelKS6a: false,
      ks2ExcelPdfLoad: false,
      ks6aLoad: false,
      readonly: true,
      ru: ru,
      en: enGB,
      form: {},
      modalCfg: {
        modalShow: false
      }
    }
  },
  validations() {
    return {
      form: {
        document_number: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        },
        estimate_local_number: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        },
        kks: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        },
        building_code: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      getKS2byid: 'ks2idModule/getKS2byid'
    }),
    showOKBtn() {
      return this.modalCfg.component != 'pdf-viewer' && this.modalCfg.component != 'version-archive' && this.modalCfg.component != 'view-two-pdf'
    }
  },
  methods: {
    ...mapActions({
      fetchKS2byId: 'ks2idModule/fetchKS2byId'
    }),
    resetDefaultValue(prop, type, event) {
      let el;
      event.target.localName === 'path' ? el = event.target.parentElement : el = event.target
      el.classList.add('animate-spin')
      setTimeout(() => { el.classList.remove('animate-spin') }, 500)
      if(type === 'date') {
        this.form[prop] = new Date(this.getKS2byid[prop])
      } else {
        this.form[prop] = this.getKS2byid[prop]
      }
    },
    setFocus(ref) {
      this.$refs[ref].$refs.inputRef.focus()
    },
    // Скачать файл
    async onDownload(file_info) {
      await axios.get(`api/ks2/download/${file_info.uuid}`, {
        responseType: 'blob'
      })
      .then((resp) => {
        this.onFileSave(resp.data, file_info.name)
      });
    },
    // Новая версия КС-2
    async onUploadKS2NewVersion(event) {
      this.ks2ExcelPdfLoad = true
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append('file', file);
      formData.append('ks3_id', this.getKS2byid.ks2_file_excel.ks3_id)
      formData.append('ks2_id', this.getKS2byid.ks2_file_excel.ks2_id)
      formData.append('ks2_file_uuid', this.getKS2byid.ks2_file_excel.uuid)
      formData.append('ks2_excel_id', this.getKS2byid.ks2_file_excel.id)
      formData.append('workflow_id', this.getKS2byid.ks2_file_excel.ks3_workflow_id)

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
          this.onToast('danger', this.$t('upload-error'))
        }
        this.ks2ExcelPdfLoad = false
      })
    },
    // Новая версия КС-6а
    async onUploadKS6aNewVersion(event) {
      this.ks6aLoad = true
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append('file', file);
      formData.append('ks3_id', this.getKS2byid.ks2_file_excel.ks3_id)
      formData.append('ks2_id', this.getKS2byid.ks2_file_excel.ks2_id)
      formData.append('ks2_file_uuid', this.getKS2byid.ks2_file_excel.uuid)
      formData.append('ks6a_file_pdf_uuid', this.getKS2byid.ks6a_file_pdf
                                            ? this.getKS2byid.ks6a_file_pdf.uuid
                                            : '')
      formData.append('ks6a_file_pdf_id', this.getKS2byid.ks6a_file_pdf
                                            ? this.getKS2byid.ks6a_file_pdf.id
                                            : ''
      )
      formData.append('workflow_id', this.getKS2byid.ks2_file_excel.ks3_workflow_id)

      await axios.post( 'api/ks2/ks6aupload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((data) => {
        if(data?.data.success) {
          this.onToast('success', this.$t('ks6a-upload', {file: file.name}))
          this.onRefresh()
        } else {
          this.onToast('danger', this.$t('upload-error'))
        }
        this.ks6aLoad = false
      })
    },
    // Просмотр PDF в окне
    async onViewPDFInWindow(file_info) {
      this.modalCfg = {
        modalShow: true,
        title: file_info.name,
        component: 'pdf-viewer',
        uuid: file_info.uuid,
        width: 'w-[90%]',
        height: 'h-[95%]',
      }
    },
    // Совместный просмотр КС-2 и КС-6а
    onViewKS2andKS6a(type) {
      const oneUuid = this.getKS2byid.ks2_file_pdf.uuid,
            twoUuid = this.getKS2byid.ks6a_file_pdf.uuid
      this.modalCfg = {
        modalShow: true,
        title: this.$t('ks2-ks6a'),
        component: 'view-two-pdf',
        width: 'w-[100%]',
        height: 'h-[100%]',
        params: {
          type: type,
          oneUuid: oneUuid,
          twoUuid: twoUuid
        }
      }
    },
    changeType() {
      this.modalCfg.params.type === 'lr'
        ? this.modalCfg.params.type = 'tb'
        : this.modalCfg.params.type = 'lr'
    },
    // Подтвердить удаление файла
    async onDeleteConfirm(file_info) {
      this.modalCfg = {
        modalShow: true,
        file_info: file_info,
        title: this.$t('confirm'),
        component: 'confirm',
        type: 'delete-file',
        question: this.$t('delete-confirm-file', {name:file_info.name}),
        uuid: file_info.uuid,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[25%]',
      }
    },
    // Удаление файла
    async onDeleteFile(file_info) {
      const uuid = file_info.uuid
      await axios.delete( 'api/ks2/deletefile', {
          params: {
            uuid: uuid
          }
        })
        .then((data) => {
        if(data?.data.success) {
          this.onToast('success', this.$t('success'))
        } else {
          this.onToast('danger', this.$t('error'))
        }
      })
    },
    // Архив версий
    onVersionArchive(filterType) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('archive-version'),
        component: 'version-archive',
        width: 'w-[90%]',
        height: 'h-[95%]',
        filterType: filterType,
        ks2_id: +this.$route.params.id
      }
    },
    async saveAndCloseModal() {
      if(this.modalCfg.type === 'delete-file') {
        await this.onDeleteFile(this.modalCfg.file_info)
      }
      this.closeModal()
      this.onRefresh()
    },
    async onRefresh() {
      this.$emit('onRefresh')
    },
    closeModal() {
      this.modalCfg = {
        modalShow: false
      }
    }
  },
  async mounted() {
    await this.matchRole('KS2FileExcelKS6a')
  },
}
</script>