<template lang="pug">
div(class="bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  div(class="flex items-center relative h-full")
    div(class="relative h-full min-w-[150px] max-w-[150px] pr-4")
      svg-exclamation(class="relative w-full h-full")
    div(v-if="!load" v-html="message")
    div(v-else class="w-full flex items-center justify-center")
      svg-loading
      p {{ $t('loading') }}
</template>
<script>
import axios from 'axios'
export default {
  name: 'modal-exclamation',
  props: ['modalCfg'],
  data() {
    return {
      load: false,
      message: null
    }
  },
  async mounted() {
    this.load = true
    let data = []
    this.modalCfg.data.forEach((i) => {
      if(i.checked) data.push(i.id)
    })
    await axios.post('api/ks2/checkapproval', {
      ks2_id: data
    })
    .then(data => {
      let msg = '', errorMsg = '', presenseMsg = ''
      for(let i in data.data.error) {
        if(data.data.error[i].count > 0) {
          errorMsg += this.$i18n.locale === 'ru'
            ? '&emsp; - '+data.data.error[i].message_ru
            : '&emsp; - '+data.data.error[i].message_en
          errorMsg += ' ('+data.data.error[i].count+')'+'<br>'
        }
      }
      for(let i in data.data.presense) {
        if(data.data.presense[i].count > 0) {
          presenseMsg += this.$i18n.locale === 'ru'
            ? '&emsp; - '+data.data.presense[i].message_ru
            : '&emsp; - '+data.data.presense[i].message_en
          presenseMsg += ' ('+data.data.presense[i].count+')'+'<br>'
        }
      }
      if(errorMsg) {
        msg += this.$i18n.locale === 'ru' ? '<b class="text-red-400">Проблемы:</b><br>' : '<b class="text-red-400">Problems:</b><br>'
        msg += errorMsg
      }
      if(presenseMsg) {
        msg += this.$i18n.locale === 'ru' ? '<b class="text-green-400">Успех:</b><br>' : '<b class="text-green-400">Success:</b><br>'
        msg += presenseMsg
      }
      // Готовые к подписанию
      msg += this.$i18n.locale === 'ru' ? '<b>Готовы к согласованию: </b>' : '<b>Ready for approval: </b>'
      msg += data.data.data.ready.count
      const ready = +data.data.data.ready.count.split('/')[0]
      if(ready > 0) this.modalCfg.showOK = true
      if(ready === 0) {
        const add = this.$i18n.locale === 'ru' ? 'Запустить согласование невозможно. Пожалуйста, устраните проблемы' : 'Approval cannot be started. Please fix the problems'
        msg += '<br><br>'+add
      } else {
        const add = this.$i18n.locale === 'ru' ? 'Запустить согласование по готовым актам?' : 'Start approval on ready-made certificates?'
        msg += '<br><br>'+add
      }
      this.modalCfg.ready = data.data.data.ready.data

      this.message = msg
      this.load = false
    })
    .catch(e => {
      this.modalCfg.modalShow = false
    })
  }
}
</script>