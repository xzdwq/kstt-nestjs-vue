<template lang="pug">
div(
  class="flex text-copy-primary hover:text-copy-hover mr-2 cursor-pointer"
  @click="openModal"
)
  svg(
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  )
    path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z")
    path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z")

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