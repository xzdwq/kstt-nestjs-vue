<template lang="pug">
div.w-full.h-full
  //- iframe(
  //-   v-if="!error"
  //-   :src="src"
  //-   class="w-full h-full"
  //- )
  object(
    v-if="!error"
    type="application/pdf"
    :data="src"
    width="100%"
    height="100%"
  )
    embed(
      :src="src"
      frameborder="0"
      width="100%"
      height="100%"
    )
  div(
    v-else
  ) {{ messageError }}

</template>
<script>
import axios from 'axios'

export default {
  name: 'pdf-viewer',
  props: ['modalCfg'],
  data() {
    return {
      src: null,
      error: false,
      messageError: null
    }
  },
  methods: {
    async onDownload() {
      if(this.modalCfg?.params?.type != 'test-sign') {
        const uuid = this.modalCfg.uuid
        await axios.get(`api/ks2/download/${uuid}`, {
          responseType: 'blob'
        })
        .then((resp) => {
          const file = new Blob([resp.data], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(file);
          this.src = fileURL

          this.error = false
          this.messageError = null
        })
        .catch((e) => {
          this.error = true
          this.messageError = e.toString()
        })
      } else {
        // console.log(this.modalCfg.params.signInfo)
        await axios.get(`api/cryptoconfig/testfile`, {
          responseType: 'blob'
        })
        .then((resp) => {
          const path = decodeURIComponent(resp.headers['x-path'])
          const file = new Blob([resp.data], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(file);
          this.src = fileURL

          this.error = false
          this.messageError = null
          this.modalCfg.params.path = path
        })
        .catch((e) => {
          this.error = true
          this.messageError = e.toString()
        })
      }
    },
  },
  async mounted() {
    await this.onDownload()
  }
}
</script>