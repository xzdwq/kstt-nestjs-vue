<template lang="pug">
div(class="bg-background-secondary h-full p-4 rounded-md")
  div(class="md:flex md:items-center mb-6")
    label(for="document-number" class="w-[220px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('ks3.certificate-number') }}:
    span(class="appearance-none w-full py-2 px-0") {{ form.customCertificateNumber }}
      svg-loading(v-if="!form.certificateNumber")
  div(class="md:flex md:items-center mb-6")
    label(for="document-number" class="w-[220px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('ks3.document-number') }}:
    input(
      v-model="v$.form.documentNumber.$model"
      @input="inputDocumentNumber"
      type="text"
      :placeholder="$t('ks3.placeholder-document-number')"
      name="document-number"
      class="bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-copy-secondary"
      :class="v$.form.documentNumber.$errors.length === 0 ? 'border-gray-200' : 'border-red-500'"
    )
  div.relative
    div(
      class="absolute mt-[-28px] md:right-0 text-red-600"
      v-for="(error, index) of v$.form.documentNumber.$errors"
      :key="index"
    )
      div {{ error.$message }}
  div(class="md:flex md:items-center mb-6")
    label(for="document-period" class="w-[220px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('ks3.date-preparation') }}:
    div(
      class="relative appearance-none w-full text-copy-secondary"
    )
      datepicker(
        v-model="documentPeriod"
        :inputFormat="this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'"
        :locale="this.$i18n.locale == 'ru' ? ru : en"
        ref="datePicker"
        class="bg-gray-200 rounded"
      )
      div(@click="clickDate" class="cursor-pointer text-gray-500 absolute top-[9px] right-[10px]")
        svg-calendar
  div(class="md:flex md:items-center mb-6")
    label(for="period" class="w-[220px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('ks3.period') }}:
    div(
      class="relative appearance-none w-full text-copy-secondary"
    )
      datepicker(
        v-model="period"
        :inputFormat="'LLLL yyyy'"
        :locale="this.$i18n.locale == 'ru' ? ru : en"
        minimum-view="month"
        starting-view="month"
        month-list-format="LLLL"
        ref="monthPicker"
        class="bg-gray-200 rounded"
      )
      div(@click="clickMonth" class="cursor-pointer text-gray-500 absolute top-[9px] right-[10px]")
        svg-calendar
  div(v-if="getIsLoadStageWorkflow" class="pl-20 flex items-center justify-center")
    svg-loading
    p {{ $t('ks3.get-stage-workflow') }}
</template>
<script>
import { ref, getCurrentInstance } from 'vue'
import Datepicker from 'vue3-datepicker'
import { enGB, ru } from 'date-fns/locale'

import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'

import {
  mapGetters,
  mapActions
} from 'vuex'

import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'
export default {
  name: 'create-ks3',
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
      documentPeriod: ref(new Date()),
      period: ref(new Date()),
      ru: ru,
      en: enGB,
      form: {
        certificateNumber: '',
        customCertificateNumber: '',
        documentNumber: '',
        customDocumentNumber: '',
      },
      activeStageWorkflow: 1
    }
  },
  validations() {
    return {
      form: {
        documentNumber: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        }
      }
    }
  },
  async mounted() {
    /**
     * Получаем следующий номер справки КС-3
     */
    const newCertificateNumber = await this.certificateNumber()
    if(newCertificateNumber.success) {
      this.form.certificateNumber = newCertificateNumber.data
      this.form.customCertificateNumber = newCertificateNumber.data
    } else {
      this.form.certificateNumber = '-'
      this.form.customCertificateNumber = '-'
      createToast({
          title: this.$t('ks3.certificate-ks3-error')+' ('+ newCertificateNumber.data.code+')',
          description: newCertificateNumber.message
        },
        {
          showCloseButton: false,
          swipeClose: true,
          hideProgressBar: true,
          position: 'bottom-left',
          type: 'danger',
          showIcon: true,
          transition: 'bounce',
          timeout: 3500
      })
    }
    /**
     * Получаем список этапов workflow справки КС-3
     */
    await this.fetchStageWorkflow()
    /**
     * Принимаем событие из эвентбуса на создание справки КС-3
     */
    await this.emitter.all.clear()
    await this.emitter.on('onCreateNewKS3', () => {
      this.v$.$touch()
      if(this.v$.form.documentNumber.$errors.length === 0) {
        const data = {
          certificateNumber: this.form.customCertificateNumber,
          documentNumber: this.form.customDocumentNumber,
          documentPeriod: this.documentPeriod,
          documentPeriodRaw: this.$refs.datePicker.$refs.inputRef.value,
          period: this.period,
          periodRaw: this.$refs.monthPicker.$refs.inputRef.value,
          ks3StageWorkflow: this.activeStageWorkflow
        }
        this.createKS3(data)
          .then((data) => {
            if(data.success) {
              this.instance.parent.parent.parent.parent.data.modalCfg.modalShow = false
              createToast({
                  title: this.$t('ks3.create-ks3', { number: this.form.customDocumentNumber }),
                  description: this.$t('ks3-create')
                },
                {
                  showCloseButton: false,
                  swipeClose: true,
                  hideProgressBar: true,
                  position: 'bottom-left',
                  type: 'success',
                  showIcon: true,
                  transition: 'bounce',
                  timeout: 3500
              })
            } else {
              createToast({
                  title: this.$t('ks3.create-ks3-error')+' ('+ data.data.code+')',
                  description: data.message
                },
                {
                  showCloseButton: false,
                  swipeClose: true,
                  hideProgressBar: true,
                  position: 'bottom-left',
                  type: 'danger',
                  showIcon: true,
                  transition: 'bounce',
                  timeout: 3500
              })
            }
          })
      }
    })
  },
  computed: {
    ...mapGetters({
      getStageWorkflow: 'ks3Module/getStageWorkflow',
      getIsLoadStageWorkflow: 'ks3Module/getIsLoadStageWorkflow'
    })
  },
  methods: {
    clickDate() {
      this.$refs.datePicker.$refs.inputRef.focus()
    },
    clickMonth() {
      this.$refs.monthPicker.$refs.inputRef.focus()
    },
    inputDocumentNumber(el) {
      /**
       * Either it
       */
      this.form.customDocumentNumber = el.target.value
      /**
       * Either it
       */
      // const re = /([^\/]|\/(?=.*\/))+/gm
      // const checkReg = el.target.value.match(re)

      // this.form.customDocumentNumber = checkReg[0].trim()
      // if(checkReg.length === 2) {
      //   this.form.customCertificateNumber = checkReg[1]
      // } else {
      //   this.form.customCertificateNumber = this.form.certificateNumber
      // }
    },
    ...mapActions({
      createKS3: 'ks3Module/createKS3',
      certificateNumber: 'ks3Module/certificateNumber',
      fetchStageWorkflow: 'ks3Module/fetchStageWorkflow'
    }),
  }
}
</script>