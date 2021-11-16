<template lang="pug">
div(class="relative p-1 rounded-md bg-background-secondary border-2 border-transparent")
  //- toolber
  div(class="w-full flex")
    //- Файлы
    //- div(class="flex w-full justify-start items-center")
    //-   //- Excel
    //-   div(
    //-     v-if="item.ks2_file_excel"
    //-     class="cursor-pointer mr-3 h-full flex items-center"
    //-     @click="onDownload(item.ks2_file_excel)"
    //-   )
    //-     popper(arrow :hover="true" placement="bottom"
    //-       class="flex popper-tips"
    //-       :content="$t('download-excel')"
    //-     )
    //-       svg-excel(class="text-green-500")
    //-   //- КС-6а PDF
    //-   div(
    //-     v-if="item.ks6a_file_pdf"
    //-     class="cursor-pointer mr-3 h-full flex items-center"
    //-     @click="onDownload(item.ks6a_file_pdf)"
    //-   )
    //-     popper(arrow :hover="true" placement="bottom"
    //-       class="flex popper-tips"
    //-       :content="$t('download-ks6a')"
    //-     )
    //-       svg-pdf(class="text-red-500")
    //- Открыть
    div(class="flex w-full justify-end items-center")
      //- popper(arrow :hover="true" placement="bottom"
      //-   class="flex popper-tips"
      //-   :content="$t('open-card')"
      //- )
      //-   svg-external(
      //-     class="cursor-pointer"
      //-     @click="$router.push(`/ks2/${item.id}`)"
      //-   )
    //- Удалить
    div(
      class="absolute bottom-1 right-1 cursor-pointer h-6"
      @click="onConformDelKS2(item)"
    )
      svg-trash
  //- body
  div(class="w-full flex")
    div(class="flex-0 w-48 pr-2 font-bold") {{ $t('estimate') }}:
    div(class="flex-1") {{ item.estimate_number }}
  //- Договор подряда
  div(class="w-full flex")
    div(class="flex-0 w-48 pr-2 font-bold") {{ $t('subcontract') }}:
    div(class="flex-1")
      span № {{ item.subcontract_number }} {{ $t('of') }} {{ formatDate(item.subcontract_date, this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy') }}
  //- Номер документа
  div(class="w-full flex")
    div(class="flex-0 w-48 pr-2 font-bold") {{ $t('ks3.document-number') }}:
    div(class="flex-1")
      span № {{ item.document_number }} {{ $t('of') }} {{ formatDate(item.date_preparation, this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy') }}
  //- Отчетный период
  div(class="w-full flex")
    div(class="flex-0 w-48 pr-2 font-bold") {{ $t('ks3.reporting-period') }}:
    div(class="flex-1") {{ formatDate(item.reporting_period, 'LLLL yyyy') }}
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
  mapActions
} from 'vuex'
import axios from 'axios'
import { format } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'

import toast from '@/mixins/toast'
import fileSave from '@/mixins/fileSave'
export default {
  name: 'ks2-item',
  props: ['item'],
  mixins: [toast, fileSave],
  data() {
    return {
      id: this.$route.params.id,
      ru: ru,
      en: enGB,
      modalCfg: {
        modalShow: false
      }
    }
  },
  methods: {
    ...mapActions({
      fetchKS2: 'ks2idModule/fetchKS2'
    }),
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
    // Скачать файл
    async onDownload(file_info) {
      await axios.get(`api/ks2/download/${file_info.uuid}`, {
        responseType: 'blob'
      })
      .then((resp) => {
        this.onFileSave(resp.data, file_info.name)
      });
    },
    saveAndCloseModal() {
      if(this.modalCfg.component === 'delete-group-in-stage') {
        this.onDelKS2(this.modalCfg.data)
      }
      this.closeModal()
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
          this.fetchKS2({ks3_id: this.id})
        } else {
          this.onToast('danger', this.$t('error'))
        }
      })
    },
    closeModal() {
      this.modalCfg = {
        modalShow: false
      }
    },
    formatDate(date, formatType) {
      return format(
        new Date(date),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    }
  }
}
</script>