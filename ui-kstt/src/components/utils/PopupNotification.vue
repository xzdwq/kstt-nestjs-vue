<template lang="pug">
transition(name="ltr")
  div(class="flex fixed inset-0 bg-black bg-opacity-40" v-if="popupNotificationShow" @click="hidePopupNotification")
    div(
      class="absolute z-10 rounded-md pop-area overflow-auto w-10/12 sm:w-96 top-16 right-5 text-copy-primary bg-background-secondary"
      @click.stop
    )
      div(class="relative p-2 break-words")
        notification-items(
          v-for="item in list"
          :item="item"
          :key="item.id"
        )
      div.justify-center.inline-flex.items-center.rounded-md.h-4.w-full(ref="observer_notification")
        div(v-if="$store.state.bellNotificationModule.isLoading")
          svg(class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
          )
            circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
            path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
          span loading...
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
  methods: {
    ...mapActions({
      fetchMoreNotification: 'bellNotificationModule/fetchMoreNotification'
    }),
    ...mapGetters({
      getPage: 'bellNotificationModule/getPage',
      getTotalPage: 'bellNotificationModule/getTotalPage'
    }),
    hidePopupNotification() {
      this.$emit('update:popupNotificationShow', false)
    },
    observerNotification() {
      const options = {
        rootMrgin: '0px',
        threshold: 1.0
      }
      const callback = (entries, observer) => {
        if(entries[0].isIntersecting && this.getPage() < this.getTotalPage()) {
          this.fetchMoreNotification();
        }
      }
      const observer = new IntersectionObserver(callback, options)
      observer.observe(this.$refs.observer_notification)
    }
  }
}
</script>
<style lang="">
  
</style>