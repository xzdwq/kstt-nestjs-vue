<template lang="pug">
div.relative
  //- toolbar
  div(class="flex items-center")
    def-button-back
</template>
<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'workflow-default',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getLocales: 'localesSwitcherModule/getLocales'
    }),
  },
  methods: {
  },
  async mounted() {
  },
}
</script>