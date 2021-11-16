<template lang="pug">
div(class="bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  div(class="md:flex md:items-center mb-6")
    label(for="type-signature" class="w-[220px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('type-signing') }}:
    select(
      v-model="modalCfg.data.type.type.id"
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
  //- div(v-if="modalCfg.workflow_id" class="md:flex md:items-center mb-6")
  //-   label(for="type-signature" class="w-[220px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('cascade') }}:
  //-   div(class="w-full")
  //-     input(type="checkbox" class="form-checkbox cursor-pointer" @change="onCascade($event)" :checked="modalCfg.data.cascade")
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'edit-group-in-stage',
  props: ['modalCfg'],
  async mounted() {
    this.modalCfg.typeTmp = this.modalCfg.data.type.type.id
    /*if(this.getGroupType.length === 0)*/ await this.fetchGroupType()
  },
  methods: {
    ...mapActions({
      fetchGroupType: 'groupModule/fetchGroupType'
    }),
    onSelected(e) {
      this.modalCfg.typeTmp = +e.target.value
    },
    onCascade(e) {
      const cascade = e.target.checked
      this.modalCfg.data.cascade = cascade
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