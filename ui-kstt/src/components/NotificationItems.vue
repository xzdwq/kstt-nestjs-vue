<template lang="pug">
div(class="flex justify-between p-3 mb-2 border-2 border-transparent rounded-lg bg-background-primary")
  div
    span {{ dateFormatter(item.create_at, 'DD.MM.YYYY H:m:ss') }}
    p {{ item.text }}
  div X
</template>
<script>
import moment from 'moment'

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
  }
}
</script>