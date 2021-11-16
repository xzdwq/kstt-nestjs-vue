<template lang="pug">
div
  div(
    class="pr-2 flex text-copy-primary hover:text-copy-hover cursor-pointer"
    @click="openModal"
  )
    svg-cog(v-ttip="$t('configuration')")

  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ $t('configuration') }}
    template(v-slot:body)
      tabs-panel(class="relative h-full")
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
        width: 'w-[95%] sm:w-[85%] lg:w-[70%] xl:w-[900px]',
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