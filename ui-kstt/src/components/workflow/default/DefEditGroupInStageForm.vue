<template lang="pug">
div(class="bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  div(class="md:flex md:items-center mb-6")
    label(for="type-signature" class="w-[220px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('type-signing') }}:
    select(
      v-model="modalCfg.data.group.group.type_id"
      @change="onSelected($event)"
      name="group-type"
      autocomplete="group-type"
      class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-copy-secondary"
    )
      option(
        v-for="item in getGroupType"
        :value="item.id"
        :key="item.id"
      ) {{ this.$i18n.locale == 'ru' ? item.name_ru : item.name_en }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'def-edit-group-in-stage',
  props: ['modalCfg'],
  async mounted() {
    /*if(this.getGroupType.length === 0)*/ await this.fetchGroupType()
  },
  methods: {
    ...mapActions({
      fetchGroupType: 'groupModule/fetchGroupType'
    }),
    onSelected(e) {
      this.modalCfg.data.group.group.type_id = e.target.value
    }
  },
  computed: {
    ...mapGetters({
      getIsGroupTypeLoading: 'groupModule/getIsGroupTypeLoading',
      getGroupType: 'groupModule/getGroupType'
    })
  }
}
</script>