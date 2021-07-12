<template lang="pug">
div(class="flex justify-between p-3 mb-2 border-2 border-transparent rounded-lg bg-background-primary")
  div(ref="observer_notification_item")
    span {{ dateFormatter(item.create_at, 'DD.MM.YYYY H:m:ss') }}
    p {{ item.text }}
  div X
</template>
<script>
import moment from 'moment'
import {
  mapGetters,
  mapState,
  mapMutations
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
    ...mapGetters({
      getCountNotifications: 'bellNotificationModule/getCountNotifications'
    }),
    ...mapMutations({
      setNotificationCount: 'bellNotificationModule/setNotificationCount',
      setReadNewNotification: 'bellNotificationModule/setReadNewNotification'
    }),
    ...mapState({
      readNewNotification: state => state.bellNotificationModule.readNewNotification,
    }),
    observerNotificationItem() {
      const options = {
        rootMrgin: '0px',
        threshold: 1.0
      }
      const callback = (entries, observer) => {
        if(entries[0].isIntersecting && this.readNewNotification() < this.getCountNotifications()) {
          const currentReadNotification = this.getCountNotifications() - 1
          this.setNotificationCount(currentReadNotification)
        }
      }
      const observer = new IntersectionObserver(callback, options)
      observer.observe(this.$refs.observer_notification_item)
    }
  },
  mounted() {
    this.observerNotificationItem()
  }
}
</script>