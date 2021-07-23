<template lang="pug">
div(class="bg-background-secondary h-full p-4 rounded-md")
  div(class="md:flex md:items-center mb-6")
    label(for="document-number" class="w-[220px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('ks3.document-number') }}:
    input(
      v-model="v$.form.documentNumber.$model"
      ref="documentNumber"
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
</template>
<script>
import { ref, getCurrentInstance } from 'vue'
import Datepicker from 'vue3-datepicker'
import { enGB, ru } from 'date-fns/locale'

import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'

import {
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
        documentNumber: ''
      }
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
    await this.emitter.all.clear()
    await this.emitter.on('onCreateNewKS3', () => {
      this.v$.$touch()
      if(this.v$.form.documentNumber.$errors.length === 0) {
        const documentNumberEl = this.$refs.documentNumber
        const data = {
          documentNumber: documentNumberEl.value,
          documentPeriod: this.documentPeriod,
          documentPeriodRaw: this.$refs.datePicker.$refs.inputRef.value,
          period: this.period,
          periodRaw: this.$refs.monthPicker.$refs.inputRef.value
        }
        this.createKS3(data)
          .then((data) => {
            if(data.success) {
              this.instance.parent.parent.parent.parent.data.modalCfg.modalShow = false
              createToast({
                  title: this.$t('ks3.create-ks3', { number: documentNumberEl.value }),
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
  methods: {
    clickDate() {
      this.$refs.datePicker.$refs.inputRef.focus()
      // console.log(this.documentPeriod);
      // console.log(this.$refs.datePicker.$refs.inputRef.value);
    },
    clickMonth() {
      // this.$refs.monthPicker.$refs.inputRef.click()
      this.$refs.monthPicker.$refs.inputRef.focus()
      // console.log(this.period);
      // console.log(this.$refs.monthPicker.$refs.inputRef.value);
    },
    
    ...mapActions({
      createKS3: 'ks3Module/createKS3'
    }),
  }
}
</script>