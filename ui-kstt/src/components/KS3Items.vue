<template lang="pug">
div(class="p-3 mb-2 rounded-lg bg-background-secondary border-2 border-transparent")
  p {{ $t('ks3.document-number') }}: {{ item.document_number }}
  p {{ $t('status') }}: {{ this.$i18n.locale == 'ru' ? item.status.name_ru : item.status.name_en }}
  p {{ $t('ks3.date-preparation') }}: {{ formatDate(item.date_preparation, this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy') }}
  p {{ $t('ks3.period') }}: {{ formatDate(item.reporting_period, 'LLLL yyyy') }}
</template>
<script>
import { format } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'
export default {
  name: 'ks3-items',
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      ru: ru,
      en: enGB,
    }
  },
  methods: {
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