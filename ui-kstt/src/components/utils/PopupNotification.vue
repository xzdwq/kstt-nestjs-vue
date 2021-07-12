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
</template>
<script>
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
    hidePopupNotification() {
      this.$emit('update:popupNotificationShow', false)
    }
  }
}
</script>
<style lang="">
  
</style>