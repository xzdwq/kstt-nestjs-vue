<template lang="pug">
div(class="flex justify-between items-center p-3 mb-2 border-2 text-left text-base leading-normal border-transparent rounded-lg bg-background-secondary" :class="{ 'border-red-500' : item.status === 0}")
  div(class="pr-2")
    svg-mail(v-if="!item.status")
    svg-mail-open(v-if="item.status")
  div(ref="observer_notification_item")
    span {{ formatDate(item.create_at) }}
    p {{ this.$i18n.locale == 'ru' ? item.text_ru : item.text_en }}
    span.opacity-0 $_{{ item.id }}
  div
    input(type="checkbox" class="form-checkbox cursor-pointer" @change="readNotification($event, item)" :checked="item.status")
</template>
<script>
import { format, addMinutes } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'
import {
  mapActions
} from 'vuex'

export default {
  name: 'notification-items',
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
    formatDate(date) {
      date = new Date(date)
      let formatType = this.$i18n.locale == 'ru' ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy h:mm a'
      return format(
        addMinutes(date, date.getTimezoneOffset()),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    },
    readNotification(event, item) {
      const status = event.target.checked ? 0 : 1
      this.fetchReadNotifications({id: item.id, status: status})
    },
    ...mapActions({
      fetchReadNotifications: 'bellNotificationModule/fetchReadNotifications'
    }),
  }
}
</script>