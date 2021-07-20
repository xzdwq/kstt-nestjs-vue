<template lang="pug">
div
  div(class="md:flex md:items-center mb-6")
    label(for="type-signature" class="w-[170px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('crypto.type-signature') }}:
    select(
      v-model="getDefaultSignatureType"
      ref="typeSignature"
      name="type-signature"
      autocomplete="type-signature"
      class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-copy-secondary"
    )
      option(
        v-for="item in getSignatureType"
        :value="item.id"
        :key="item.id"
      ) {{ this.$i18n.locale == 'ru' ? item.name : item.name_en }}
  div(class="md:flex md:items-center mb-6")
    label(for="tsp-service" class="w-[170px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('crypto.tsp-service') }}:
    input(
      ref="tspService"
      type="text"
      :placeholder="$t('crypto.placeholder-tsp-service')"
      :value="getTspService"
      name="tsp-service"
      class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-copy-secondary"
    )
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'ep-form',
  computed: {
    ...mapGetters({
      getSignatureType: 'cryptoConfigurationModule/getSignatureType',
      getDefaultSignatureType: 'cryptoConfigurationModule/getDefaultSignatureType',
      getTspService: 'cryptoConfigurationModule/getTspService'
    }),
  },
  methods: {
    ...mapActions({
      fetchSignatureType: 'cryptoConfigurationModule/fetchSignatureType'
    }),
  },
  async mounted() {
    await this.fetchSignatureType();
  },
}
</script>