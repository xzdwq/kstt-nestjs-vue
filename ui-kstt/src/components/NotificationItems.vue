<template lang="pug">
div(class="flex justify-between p-3 mb-2 border-2 border-transparent rounded-lg bg-background-primary")
  div
    span {{ item.create_at }}
    p {{ item.text }}
  div X
</template>
<script>
export default {
  name: 'notification-items',
  props: {
    item: {
      type: Object
    }
  }
}
</script>