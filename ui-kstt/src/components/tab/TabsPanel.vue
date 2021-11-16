<template lang="pug">
div(class="relative h-full rounded-md bg-background-secondary text-base leading-normal text-left")
  tab-wrapper(class="relative h-full" :tabflex="true" :selectednoactivtab="true" :uniqstate="uniqstate")
    tab(
      class="relative h-[calc(100%-60px)]"
      :title="'crypto.electonic-signature'" code="electonic-signature" :uniqstate="uniqstate"
    )
      div(class="p-2 h-[41vh] overflow-y-scroll overflow-x-hidden")
        signature-form(ref="signatureForm")
    tab(
      class="relative h-[calc(100%-60px)]"
      :title="'crypto.list-electonic-signature'" code="list-electonic-signature" :uniqstate="uniqstate"
    )
      div(class="relative h-full text-base p-1 overflow-scroll")
        electronic-signature-list
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
  data() {
    return {
      uniqstate: 'cog'
    }
  },
  methods: {
    ...mapActions({
      saveCogForm: 'cryptoConfigurationModule/saveCogForm'
    }),
  },
  async mounted() {
    await this.emitter.all.clear()
    await this.emitter.on('onSaveCogForm', () => {
      const dataForm = {
        typeSignature: this.$refs.signatureForm.$refs.typeSignature.value,
        tspService: this.$refs.signatureForm.$refs.tspService.value
      }
      this.saveCogForm(dataForm)
    })
  }
}
</script>