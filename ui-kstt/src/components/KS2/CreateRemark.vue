<template lang="pug">
div
  div.flex
    label(
      class="pr-1"
    ) {{ $t('remark') }}:
    div.w-full
      textarea(
        class="resize-none border-2 border-transparent"
        :class="{'border-2 border-red-500': modalCfg.error?.is}"
        :placeholder="$t('remark-placeholder')"
        :maxlength="maxlength"
        rows="5"
        @input="onCountWord($event)"
      )
      span {{ countWord }}
</template>
<script>
export default {
  name: 'create-remark',
  props: ['modalCfg'],
  data() {
    return {
      maxlength: 250,
      textLength: 0
    }
  },
  computed: {
    countWord() {
      return this.textLength+'/'+this.maxlength
    }
  },
  methods: {
    onCountWord(event) {
      const textLength = event.target.value.length
      this.textLength = textLength
      if(textLength > 0) {
        this.modalCfg.error = {}
      } else {
        this.modalCfg.error = {
          is: true,
          message_ru: 'Необходимо указать причину доработки',
          message_en: 'It is necessary to specify the reason for revision'
        }
      }
      this.modalCfg.textRemark = event.target.value.trim()
    }
  }
}
</script>