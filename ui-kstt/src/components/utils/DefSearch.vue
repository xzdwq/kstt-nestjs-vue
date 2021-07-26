<template lang="pug">
div(class="relative text-gray-400")
  input(
    @input="updateSearchRegister"
    type="search" name="search" :placeholder="$t('search')"
  )
  svg-search(
    v-if="emptyValue"
    class="absolute right-0 top-0 mt-[10px] mr-4"
  )
</template>
<script>
import {
  mapMutations
} from 'vuex'
export default {
  name: 'def-search',
  data() {
    return {
      emptyValue: true
    }
  },
  methods: {
    updateSearchRegister(event) {
      if(event.target.value.length > 0) {
        this.emptyValue = false
        this.setTransitionType('item-notification')
      } else {
        this.emptyValue = true
        this.setTransitionType('fade')
      }
      this.$emit('update:searchQuery', event.target.value)
    },
    ...mapMutations({
      setTransitionType: 'ks3Module/setTransitionType'
    })
  }
}
</script>