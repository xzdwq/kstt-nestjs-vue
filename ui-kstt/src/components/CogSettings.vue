<template lang="pug">
div(
  class="flex text-copy-primary hover:text-copy-hover mr-2 cursor-pointer"
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
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'

export default {
  name: 'cog-settings',
  data() {
    return {
      modalCfg: {
        modalShow: false,
        width: 'w-8/12',
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
        createToast({
            title: this.$t('save-settings'),
            description: this.$t('configuration')
          },
          {
            showCloseButton: false,
            swipeClose: true,
            hideProgressBar: true,
            position: 'bottom-left',
            type: 'success',
            showIcon: true,
            transition: 'bounce',
            timeout: 3500
          })
      } catch(e) {
        createToast({
            title: this.$t('save-error'),
            description: e.toString()
          },
          {
            showCloseButton: false,
            swipeClose: true,
            hideProgressBar: true,
            position: 'bottom-left',
            type: 'danger',
            showIcon: true,
            transition: 'bounce',
            timeout: 3500
          })
      } finally { this.modalCfg.modalShow = false }
    }
  }
}
</script>