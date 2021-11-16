<template lang="pug">
div(class="relative w-full h-full pb-4")
  //- loading
  div(
    v-if="getIsLoadCert && getCertificates.length === 0"
    class="w-full flex items-center justify-center"
  )
    svg-loading
    p {{ $t('loading') }}
  //- component
  div(v-else)
    div(
      v-for="(item, idx) in certificates"
      class="pb-2"
    )
      div(
        class="bg-background-primary rounded-md p-2 border-2 border-transparent"
        :class="{'border-blue-600': item.checked, 'cursor-pointer': ks2}"
        @click="selectSign(item)"
      )
        div.flex
          div(class="pr-2 w-10") {{ idx+1 }}.
          div(class="w-full flex")
            div
              div(class="font-bold") {{ $t('name') }}: {{ item.name }}
              div(v-if="item.isValid" class="font-bold text-green-500") {{ $t('isValid') }}
              div(v-else class="font-bold text-red-400") {{ $t('notValid') }}
              div(class="text-sm") {{ $t('cert-valid', {from:formatDate(item.validFrom), to:formatDate(item.validTo)}) }}
              div
                span(class="font-bold") {{ $t('crypto.serial-number') }}: 
                span(class="text-sm") {{ item.serialNumber }}
              //- div
              //-   span(class="font-bold") {{ $t('subject') }}: 
              //-   span(class="text-sm") {{ item.subjectName }}
              div
                span(class="font-bold") {{ $t('crypto.publisher') }}: 
                span(v-if="item.issuerInfo.length > 0" class="text-sm") {{ item.issuerInfo[0].description }}
              div
                span(class="font-bold") {{ $t('crypto.organization') }}: 
                span(v-if="item.issuerInfo.length > 0" class="text-sm") {{ item.company ? item.company : '-' }}
              div
                span(class="font-bold") {{ $t('crypto.department') }}: 
                span(v-if="item.issuerInfo.length > 0" class="text-sm") {{ item.department ? item.department : '-' }}
          div(class="w-14 flex justify-center items-center")
            svg-badge-check(
              v-ttip="$t('sign-test')"
              class="w-full cursor-pointer"
              @click="onSignTestCreate({cert:item})"
            )
  div(
    v-if="!getIsLoadCert && getCertificates.length === 0"
    class="py-2"
  )
    p {{ $t('crypto.cert-empty') }}
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg" ref="modal-component")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(v-if="modalCfg.showOK" class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
</template>
<script>
import { format } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'
import axios from 'axios'

import {
  mapGetters,
  mapActions
} from 'vuex'
import toast from '@/mixins/toast'
export default {
  name: 'electronic-signature-list',
  mixins: [toast],
  props: ['ks2'],
  data() {
    return {
      ru: ru,
      en: enGB,
      certificates: [],
      modalCfg: {
        modalShow: false,
        showOK: true
      }
    }
  },
  methods: {
    ...mapActions({
      fillCertificates: 'cryptoConfigurationModule/fillCertificates',
      signTestCreate: 'cryptoConfigurationModule/signTestCreate'
    }),
    selectSign(cert) {
      if(this.ks2) {
        this.certificates.forEach(i => {
          i.checked = false
        })
        cert.checked = !cert.checked
        this.$emit('update:selectCert', cert)
      }
    },
    formatDate(date) {
      let formatType = this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
      return format(
        new Date(date),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    },
    // Тест подписи
    async onSignTestCreate(params) {
      await this.signTestCreate(params)
        .then(data => {
          if(data.success) {
              if(this.ks2) {
                this.onToast('success', this.$t('crypto.success-test'), data.data.substr(0, 100)+'...')
              } else {
                this.modalCfg = {
                  modalShow: true,
                  showOK: true,
                  title: this.$t('sign-test'),
                  component: 'pdf-viewer',
                  params: {
                    type: 'test-sign',
                    signInfo: params,
                    path: null
                  },
                  width: 'w-full',
                  height: 'h-full',
                  fn: 'testSign'
                }
              }
            } else {
              this.onToast('danger', this.$t('crypto.error-test'), data.message)
            }
        })
    },
    async testSign() {
      const path = this.modalCfg.params.path
      await axios.post(`api/cryptoconfig/testsign`, {
        params: {
          path: path,
          cert: this.modalCfg.params.signInfo.cert
        }
      },
      {
        responseType: 'blob'
      }
      )
      .then(resp => {
        this.modalCfg.showOK = false
        const path = decodeURIComponent(resp.headers['x-path'])
        const file = new Blob([resp.data], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file)
        this.modalCfg.params.path = path
        const modalCmp = this.$refs['modal-component']
        modalCmp.src = fileURL
      })
    },
    saveAndCloseModal() {
      this[this.modalCfg.fn]()
    },
    closeModal() {
      this.modalCfg = {
        showOK: true,
        modalShow: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getIsLoadCert: 'cryptoConfigurationModule/getIsLoadCert',
      getCertificates: 'cryptoConfigurationModule/getCertificates'
    })
  },
  async mounted() {
    await this.fillCertificates()
    this.certificates = this.getCertificates.map((i) => {
      i.checked = false
      return i
    })
  },
}
</script>