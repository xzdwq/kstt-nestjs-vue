<template lang="pug">
transition(name="fade")
  div(class="flex fixed z-10 inset-0 bg-black bg-opacity-40" v-if="modalShow")
    div(class="flex m-auto w-8/12 h-4/6 min-w-1/2 max-w-11/12 max-h-11/12 text-copy-primary bg-background-primary rounded-md p-4")
      div(class="grid grid-rows-[max-content,1fr,max-content] min-h-full w-full")
        div(class="h-[50px]")
          div(class="flex flex-row justify-between")
            p(class="font-semibold select-none")
              slot(name="title")
            svg(
              class="w-6 h-6 cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              @click="closeModal"
            )
              path(
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M6 18L18 6M6 6l12 12"
              )
        div(class="flex-1")
          slot(name="body")
        div(class="h-[50px] pt-2 flex justify-end")
          def-button(@click="closeModal") OK
</template>
<script>
export default {
  name: 'modal',
  props: {
    modalShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:modalShow', false)
    }
  }
}
</script>