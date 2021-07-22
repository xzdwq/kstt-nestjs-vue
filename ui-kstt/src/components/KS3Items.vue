<template lang="pug">
div(class="p-3 mb-2 rounded-lg bg-background-secondary border-2 border-transparent")
  p {{ item.uuid }}
</template>
<script>
export default {
  name: 'ks3-items',
  props: {
    item: {
      type: Object
    }
  },
}
</script>