<template lang="pug">
div(
  v-show="code == $store.getters[`tabModule/gettab_${uniqstate}`]"
  class="p-2"
)
  slot
</template>
<script>
export default {
  name: 'tab',
  props: ['title', 'code', 'uniqstate', 'countTitleModule']
}
</script>