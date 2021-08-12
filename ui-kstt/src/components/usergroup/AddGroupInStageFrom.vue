<template lang="pug">
div(class="bg-background-secondary h-full p-4 rounded-md overflow-y-scroll")
  div(v-if="getGroup.length > 0" class="md:flex md:items-center mb-6")
    div(
      v-for="item in getGroup"
      :key="item.id"
    )
      div(
        :class="{'text-red-500': matchGroup(item.id) }"
      ) {{ this.$i18n.locale == 'ru' ? item.name_ru : item.name_en }}
  //- load mask
  div(
    v-if="getIsLoading"
    class="w-full flex items-center justify-center mt-2"
  )
    svg-loading
    p {{ $t('loading') }}
  div(
    v-if="getGroup.length === 0 && !getIsLoading"
    class="py-2"
  )
    p {{ $t('no-data') }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from "vuex";

export default {
  name: 'add-group-in-stage',
  props: ['modalCfg'],
  async mounted() {
    // console.log(this.modalCfg);
    if(this.getGroup.length === 0) await this.fetchGroup()
  },
  methods: {
    ...mapActions({
      fetchGroup: 'groupModule/fetchGroup'
    }),
    matchGroup(id) {
      const match = this.modalCfg.data.stage.group.find(i => i.id === id)?.id
      return id === match
    }
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'groupModule/getIsLoading',
      getGroup: 'groupModule/getGroup'
    })
  }
}
</script>