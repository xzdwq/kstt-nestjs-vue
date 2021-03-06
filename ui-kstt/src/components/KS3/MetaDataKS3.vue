<template lang="pug">
div(class="min-h-[88px]")
  div(v-if="getKS3id.length > 0 && !getIsLoading" class="grid pt-2 text-sm" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));")
    div.flex.py-1
      //- Номер справки КС-3
      label(for="certificate-number" class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('ks3.certificate-number') }}:
      div.relative.flex.w-full
        input(
          v-model="v$.form.certificate_number.$model"
          type="text"
          name="certificate-number"
          class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
          :class="v$.form.certificate_number.$errors.length === 0 ? 'border-gray-200' : 'border-red-500', readonly ? 'h-5' : 'pl-8'"
          :readonly="readonly"
        )
        div(v-if="!readonly" :class="form.certificate_number != getKS3id[0].certificate_number ? 'text-red-400' : 'text-gray-500'")
          svg-refresh(
            class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
            @click="resetDefaultValue('certificate_number', 'string', $event)"
          )
        div(
          class="w-8 text-red-500 flex items-center"
        )
          svg-exclamation(
            class="cursor-pointer"
            v-show="v$.form.certificate_number.$errors.length > 0"
            v-ttip="v$.form.certificate_number.$errors[0]?.$message"
          )
    div.flex.py-1
      //- Номер документа
      label(for="document-number" class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('ks3.document-number') }}:
      div.relative.flex.w-full
        input(
          v-model="v$.form.document_number.$model"
          type="text"
          name="document-number"
          class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
          :class="v$.form.document_number.$errors.length === 0 ? 'border-gray-200' : 'border-red-500', readonly ? 'h-5' : 'pl-8'"
          :readonly="readonly"
        )
        div(v-if="!readonly" :class="form.document_number != getKS3id[0].document_number ? 'text-red-400' : 'text-gray-500'")
          svg-refresh(
            class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-2",
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
    div.flex.py-1
      //- Дата составления
      label(for="date-preparation" class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('ks3.date-preparation') }}:
      div.flex.relative.w-full
        datepicker(
          v-model="form.date_preparation"
          :inputFormat="this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'"
          :locale="this.$i18n.locale == 'ru' ? ru : en"
          ref="date_preparation"
          class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] text-copy-secondary"
          :class="readonly ? 'h-6' : 'pl-8'"
          :disabled="readonly"
        )
        div(v-if="!readonly" :class="new Date(form.date_preparation).getTime() != new Date(getKS3id[0].date_preparation).getTime() ? 'text-red-400' : 'text-gray-500'")
          svg-refresh(
            class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-2",
            @click="resetDefaultValue('date_preparation', 'date', $event)"
          )
        div(v-if="!readonly" @click="setFocus('date_preparation')" class="cursor-pointer text-gray-500 absolute top-[3px] right-[35px]")
          svg-calendar
        div.w-8
    div.flex.py-1
      //- Период
      label(for="reporting_period" class="flex items-center select-none min-w-[170px] font-bold mb-1 lg:mb-0 pr-4 text-copy-primary") {{ $t('ks3.period') }}:
      div.flex.relative.w-full
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
        div(v-if="!readonly" :class="new Date(form.reporting_period).getTime() != new Date(getKS3id[0].reporting_period).getTime() ? 'text-red-400' : 'text-gray-500'")
          svg-refresh(
            class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-2",
            @click="resetDefaultValue('reporting_period', 'date', $event)"
          )
        div(v-if="!readonly" @click="setFocus('reporting_period')" class="cursor-pointer text-gray-500 absolute top-[3px] right-[35px]")
          svg-calendar
        div.w-8
</template>
<script>
import { ref, getCurrentInstance } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'

import Datepicker from 'vue3-datepicker'
import { enGB, ru } from 'date-fns/locale'

import {
  mapGetters,
  mapActions
} from 'vuex'

import toast from '@/mixins/toast'
import matchRoles from '@/mixins/matchRoles'
export default {
  name: 'metadata-ks3',
  mixins: [toast, matchRoles],
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
      readonly: true,
      id: this.$route.params.id,
      ru: ru,
      en: enGB,
      form: {
        id: null,
        certificate_number: null,
        document_number: null,
        date_preparation: null,
        reporting_period: ref(new Date())
      }
    }
  },
  validations() {
    return {
      form: {
        certificate_number: {
          required: helpers.withMessage(this.$t('validator.required'), required)
        },
        document_number: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        }
      }
    }
  },
  methods: {
    ...mapActions({
      fetchKS3id: 'ks3idModule/fetchKS3id'
    }),
    resetDefaultValue(prop, type, event) {
      let el;
      event.target.localName === 'path' ? el = event.target.parentElement : el = event.target
      el.classList.add('animate-spin')
      setTimeout(() => { el.classList.remove('animate-spin') }, 500)
      if(type === 'date') {
        this.form[prop] = new Date(this.getKS3id[0][prop])
      } else {
        this.form[prop] = this.getKS3id[0][prop]
      }
    },
    setFocus(ref) {
      this.$refs[ref].$refs.inputRef.focus()
    },
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'ks3idModule/getIsLoading',
      getKS3id: 'ks3idModule/getKS3id'
    })
  },
  async mounted() {
    const matchRole = await this.matchRole('metadataKs3')
    this.readonly = !matchRole
    const data = await this.fetchKS3id(this.id);
    if(data.success) {
      this.form.id = data.data[0].id,
      this.form.certificate_number = data.data[0].certificate_number
      this.form.document_number = data.data[0].document_number
      this.form.date_preparation = new Date(data.data[0].date_preparation)
      this.form.reporting_period = new Date(data.data[0].reporting_period)
    } else {
      this.onToast('danger', this.$t('ks3.error-load-ks3id'), data.message)
    }
  }
}
</script>
<style>
.v3dp__datepicker {
  width: 100%
}
</style>