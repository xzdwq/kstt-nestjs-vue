<template lang="pug">
transition(name="ltr")
  div(class="flex fixed inset-0 bg-black bg-opacity-40" v-if="popupNotificationShow" @click="hidePopupNotification" v-scroll-lock)
    div(
      class="absolute z-10 rounded-md pop-area overflow-auto h-full w-10/12 sm:w-96 top-16 right-5 text-copy-primary bg-background-secondary"
      @click.stop
    )
      div(class="relative p-2 break-words")
        transition-group(name="item-notification")
          notification-items(
            v-for="item in list"
            :item="item"
            :key="item.uuid"
          )
      div.justify-center.inline-flex.items-center.rounded-md.h-4.w-full(ref="observer_notification")
        div(v-if="$store.state.bellNotificationModule.isLoading")
          svg-loading
          span {{ $t('loading') }}
        div(v-if="notMoreNotification" class="absolute py-4")
          span {{ $t('no-more-notifications') }}
        div(v-else-if="!notMoreNotification && getTotalNotifications == 0")
          span {{ $t('no-notifications') }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'popup-notification',
  props: {
    popupNotificationShow: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array
    }
  },
  data() {
    return {
      notMoreNotification: false,
      refresh: true
    }
  },
  computed: {
    ...mapGetters({
      getPage: 'bellNotificationModule/getPage',
      getTotalPage: 'bellNotificationModule/getTotalPage',
      getNotifications: 'bellNotificationModule/getNotifications',
      getTotalNotifications: 'bellNotificationModule/getTotalNotifications'
    }),
  },
  methods: {
    ...mapActions({
      fetchMoreNotification: 'bellNotificationModule/fetchMoreNotification',
      fetchNotifications: 'bellNotificationModule/fetchNotifications'
    }),
    async hidePopupNotification() {
      this.notMoreNotification = false;
      this.refresh = false;
      await this.fetchNotifications();
      this.$emit('update:popupNotificationShow', false)
      setTimeout(() => { this.refresh = true; }, 500)
    },
    async observerNotification() {
      const options = {
        rootMrgin: '0px',
        threshold: 1.0
      }
      const callback = (entries, observer) => {
        if(entries[0].isIntersecting && this.refresh && this.getPage < this.getTotalPage) {
          this.fetchMoreNotification();
        } else if(entries[0].isIntersecting && this.getTotalNotifications === this.getNotifications.length && this.getTotalPage > 0) {
          this.notMoreNotification = true
        }
      }
      const observer = new IntersectionObserver(callback, options)
      observer.observe(this.$refs.observer_notification)
    }
  },
}
</script>