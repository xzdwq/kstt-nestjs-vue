<template lang="pug">
div(class="flex justify-between p-3 mb-2 border-2 border-transparent rounded-lg bg-background-primary" :class="{ 'border-red-500' : item.status === 0}")
  div(ref="observer_notification_item")
    span {{ dateFormatter(item.create_at, 'DD.MM.YYYY H:m:ss') }}
    p {{ this.$i18n.locale == 'ru' ? item.text_ru : item.text_en }}
    span.opacity-0 $_{{ item.id }}
  div
    input(type="checkbox" class="form-checkbox cursor-pointer" @change="readNotification($event, item)" :checked="item.status")
</template>
<script>
import moment from 'moment'
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
  methods: {
    dateFormatter(date, format) {
      return moment(date).format(format);
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