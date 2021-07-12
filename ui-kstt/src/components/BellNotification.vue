<template lang="pug">
div(
  class="flex text-copy-primary hover:text-copy-hover mr-2 cursor-pointer"
  @click="openPopupNotification(); readPopupNotification();"
)
  svg(
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="origin-top"
    :class="{ 'animate-swing text-red-500' : getCountNotifications > 0}"
  )
    path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9")
  span(class="-ml-0.5 align-text-top text-base tracking-tighter font-bold select-none" :class="{ 'text-red-500' : getCountNotifications > 0 }")
    sup {{ getCountNotifications }}
popup-notification(v-model:popupNotificationShow="popupNotificationShow" :list="getNotifications" ref="popup_notification")
</template>
<script>
import {
  mapGetters,
  mapActions,
  mapMutations
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
    })
  },
  methods: {
    ...mapActions({
      fetchNotifications: 'bellNotificationModule/fetchNotifications'
    }),
    ...mapMutations({
      readPopupNotification: 'bellNotificationModule/readNotification'
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