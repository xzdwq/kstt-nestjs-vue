<template lang="pug">
transition(name="fade")
  div(class="flex fixed z-10 inset-0 bg-black bg-opacity-40" v-if="modalCfg.modalShow" v-scroll-lock)
    div(class="flex m-auto min-w-1/2 text-copy-primary bg-background-primary rounded-md p-4" :class="modalCfg.width, modalCfg.height")
      div(class="grid grid-rows-[max-content,1fr,max-content] min-h-full w-full")
        div(class="min-h-[40px]")
          div(class="flex flex-row justify-between")
            p(class="font-semibold select-none")
              slot(name="title")
            svg-close(@click="closeModal")
        div(class="flex-1 overflow-y-scroll")
          slot(name="body")
        div(class="h-[50px] pt-2 flex justify-end")
          slot(name="bottom-toolbar")
</template>
<script>
export default {
  name: 'modal',
  props: {
    modalCfg: {
      type: Object,
      default: {}
    }
  },
  methods: {
    async closeModal() {
      this.$emit('update', this.modalCfg.modalShow = false)
    },
  }
}
</script>