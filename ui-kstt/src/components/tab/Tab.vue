<template lang="pug">
div(
  v-show="title == selectedTitle"
  class="p-4"
)
  slot
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'tab',
  props: ['title'],
  setup() {
    const selectedTitle = inject('selectedTitle')
    return {
      selectedTitle
    }
  }
}
</script>