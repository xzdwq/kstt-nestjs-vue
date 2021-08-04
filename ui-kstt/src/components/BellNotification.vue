<template lang="pug">
div(
  class="flex text-copy-primary hover:text-copy-hover cursor-pointer"
  @click="openPopupNotification"
)
  svg-bell(:class="{ 'animate-swing text-red-500' : getCountNotifications > 0}")
  span(class="-ml-0.5 align-text-top text-base tracking-tighter font-bold select-none" :class="{ 'text-red-500' : getCountNotifications > 0 }")
    sup {{ getCountNotifications }}
popup-notification(
  v-model:popupNotificationShow="popupNotificationShow"
  :list="getNotifications" ref="popup_notification"
)
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'bell-notification',
  data() {
    return {
      popupNotificationShow: false
    }
  },
  computed: {
    ...mapGetters({
      getCountNotifications: 'bellNotificationModule/getCountNotifications',
      getNotifications: 'bellNotificationModule/getNotifications'
    }),
  },
  methods: {
    ...mapActions({
      fetchNotifications: 'bellNotificationModule/fetchNotifications'
    }),
    openPopupNotification() {
      this.popupNotificationShow = true
      setTimeout(() => {
        this.$refs.popup_notification.observerNotification();
      }, 500)
    }
  },
  mounted() {
    this.fetchNotifications();
  },
}
</script>