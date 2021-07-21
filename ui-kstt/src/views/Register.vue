<template lang="pug">
div
  div(class="md:mx-auto flex justify-between")
    def-button(
      class="text-white bg-[#06d6a0] flex justify-between"
      @click="onCreateKS3"
    )
      svg(
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      )
        path(
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        )
      span {{ $t('ks3-create') }}
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ $t('ks3-create') }}
    template(v-slot:body)
      create-ks3(ref="createKS3Form")
    template(v-slot:bottom-toolbar)
      def-button(class="text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(class="text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      modalCfg: {
        modalShow: false,
        width: 'w-9/12',
        height: 'h-4/6'
      }
    }
  },
  methods: {
    onCreateKS3() {
      this.modalCfg.modalShow = true
    },
    closeModal() {
      this.modalCfg.modalShow = false
    },
    async saveAndCloseModal() {
      await this.emitter.emit('onCreateNewKS3')
    }
  }
}
</script>