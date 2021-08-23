<template lang="pug">
div 123
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
      getStageWorkflow: 'usergroupModule/getStageWorkflow',
      getIsLoadStageWorkflow: 'usergroupModule/getIsLoadStageWorkflow',
      getLocales: 'localesSwitcherModule/getLocales',
      getKs3ByWfId: 'usergroupModule/getKs3ByWfId',
    }),
  },
  methods: {
  },
  async mounted() {
  },
}
</script>