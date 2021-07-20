<template lang="pug">
div(class="h-full rounded-md bg-background-secondary")
  tab-wrapper
    tab(:title="$t('crypto.electonic-signature')")
      div(class="p-2 h-[38vh] overflow-y-scroll overflow-x-hidden")
        ep-form(ref="epForm")
    tab(:title="$t('crypto.list-electonic-signature')")
      div(class="text-base p-2 h-[38vh] overflow-y-scroll overflow-x-hidden") Tab 2 Lorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf s Lorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb nsbdfbsmdfbmsnbsbdf  sfbmbwjeh sdf sdnf wr sdf,sdf sLorem ipssdf sdf sdf sdf sd fsdf sdbfmsdfjshd bsdnbf df sdfb END
</template>
<script>
import TabWrapper from '@/components/tab/TabWrapper.vue'
import Tab from '@/components/tab/Tab.vue'
import {
  mapActions
} from 'vuex'
export default {
  name: 'tabs-panel',
  components: { TabWrapper, Tab },
  methods: {
    ...mapActions({
      saveCogForm: 'cryptoConfigurationModule/saveCogForm'
    }),
  },
  async mounted() {
    await this.emitter.all.clear()
    await this.emitter.on('onSaveCogForm', () => {
      const dataForm = {
        typeSignature: this.$refs.epForm.$refs.typeSignature.value,
        tspService: this.$refs.epForm.$refs.tspService.value
      }
      this.saveCogForm(dataForm)
    })
  }
}
</script>