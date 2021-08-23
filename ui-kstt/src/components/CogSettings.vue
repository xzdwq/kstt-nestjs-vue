<template lang="pug">
div(
  class="flex text-copy-primary hover:text-copy-hover cursor-pointer"
  @click="openModal"
)
  svg-cog

modal(v-model:modalCfg="modalCfg")
  template(v-slot:title) {{ $t('configuration') }}
  template(v-slot:body)
    tabs-panel
  template(v-slot:bottom-toolbar)
    def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
    def-button(class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
</template>
<script>
import toast from '@/mixins/toast'

export default {
  name: 'cog-settings',
  mixins: [toast],
  data() {
    return {
      modalCfg: {
        modalShow: false,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-4/6'
      }
    }
  },
  methods: {
    openModal() {
      this.modalCfg.modalShow = true
    },
    closeModal() {
      this.modalCfg.modalShow = false
    },
    async saveAndCloseModal() {
      try{
        await this.emitter.emit('onSaveCogForm')
        this.onToast('success', this.$t('save-settings'), this.$t('configuration'))
      } catch(e) {
        this.onToast('danger', this.$t('save-error'), e.toString())
      } finally { this.modalCfg.modalShow = false }
    }
  }
}
</script>