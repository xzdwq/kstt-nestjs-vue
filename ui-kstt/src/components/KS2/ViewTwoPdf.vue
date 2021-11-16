<template lang="pug">
div(
  :class="modalCfg.params.type === 'lr' ? 'flex w-full h-full' : 'w-full h-1/2'"
)
  //- One
  div.w-full.h-full
    object(
      v-if="!onePdf.error"
      type="application/pdf"
      :data="onePdf.src"
      width="100%"
      height="100%"
    )
      embed(
        :src="onePdf.src"
        frameborder="0"
        width="100%"
        height="100%"
      )
    div(
      v-else
    ) {{ onePdf.messageError }}
  //- Two
  div.w-full.h-full
    object(
      v-if="!twoPdf.error"
      type="application/pdf"
      :data="twoPdf.src"
      width="100%"
      height="100%"
    )
      embed(
        :src="twoPdf.src"
        frameborder="0"
        width="100%"
        height="100%"
      )
    div(
      v-else
    ) {{ twoPdf.messageError }}
</template>
<script>
import axios from 'axios'
export default {
  name: 'view-two-pdf',
  props: ['modalCfg'],
  data() {
    return {
      onePdf: {
        src: null,
        error: false,
        messageError: null
      },
      twoPdf: {
        src: null,
        error: false,
        messageError: null
      }
    }
  },
  methods: {
    async oneDownload() {
      const uuid = this.modalCfg.params.oneUuid
      await axios.get(`api/ks2/download/${uuid}`, {
        responseType: 'blob'
      })
      .then((resp) => {
        const file = new Blob([resp.data], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        this.onePdf.src = fileURL

        this.onePdf.error = false
        this.onePdf.messageError = null
      })
      .catch((e) => {
        this.onePdf.error = true
        this.onePdf.messageError = e.toString()
      })
    },
    async twoDownload() {
      const uuid = this.modalCfg.params.twoUuid
      await axios.get(`api/ks2/download/${uuid}`, {
        responseType: 'blob'
      })
      .then((resp) => {
        const file = new Blob([resp.data], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        this.twoPdf.src = fileURL

        this.twoPdf.error = false
        this.twoPdf.messageError = null
      })
      .catch((e) => {
        this.twoPdf.error = true
        this.twoPdf.messageError = e.toString()
      })
    },
  },
  async mounted() {
    await this.oneDownload()
    await this.twoDownload()
  }
}
</script>