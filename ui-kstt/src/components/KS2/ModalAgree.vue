<template lang="pug">
div(class="bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  div(v-if="!messageError")
    div(v-if="group.length === 1" class="p-1")
      div {{ $t('count_ready_agree') }}: 
        b {{ count_ready }}
      span {{ $t('agree-as') }} 
        b "{{ group[0][`name_${$i18n.locale}`] }}"
    div(v-else) {{ $t('count_ready_agree') }}: 
      b {{ count_ready }}
    electronic-signature-list(
      :ks2="true"
      @update:selectCert="selectCert"
    )
  div(v-else).flex.items-center
    svg-exclamation(class="w-36 h-full")
    div.w-full.pl-2 {{ messageError }}
</template>
<script>
import axios from 'axios'
export default {
  name: 'modal-agree',
  props: ['modalCfg'],
  data() {
    return {
      load: false,
      message: null,
      cert: null,
      user: [],
      group: [],
      count_ready: '0/0',
      messageError: null
    }
  },
  methods: {
    selectCert(cert) {
      this.cert = cert
      this.modalCfg.cert = this.cert
    },
    async checkApprovInfo() {
      await axios.post('api/ks2/checkapprove', {
        params: this.modalCfg.data
      })
      .then(data => {
        if(data.data.success) {
          this.user = data.data.user
          this.group = data.data.group
          this.count_ready = data.data.count_ready
          this.modalCfg.showOKAgree = true
          let ks2_ready_prepare = []
          data.data.ks2_ready.forEach(i => {
            ks2_ready_prepare.push({
              group: { id: i.group.id },
              ks2: {
                id: i.ks2.id,
                ks3_id: i.ks2.ks3_id,
                ks2_wf_id: i.ks2.ks2_workflow.id,
                ks3_wf_id: i.ks2.ks2_workflow.ks3_workflow_id,
              },
              ks2_pdf: { id: i.ks2_pdf.id, uuid: i.ks2_pdf.uuid, path: i.ks2_pdf.path },
              user: {
                id: i.user.id,
                ks2_group_id: i.user.ks2_group_id,
                ks2_type_id: i.user.ks2_type_id,
                order_execution_user: i.user.order_execution_user
              }
            })
          })
          this.modalCfg.ks2_ready = data.data.ks2_ready
          this.modalCfg.ks2_ready_prepare = ks2_ready_prepare
        } else {
          const msg = Array.isArray(data.data.message)
            ? data.data.message[0][`text_${this.$i18n.locale}`]
            : data.data.message
          this.modalCfg.title = this.$t('error')
          this.messageError = msg
          this.modalCfg.showOKAgree = false
        }
        this.load = false
      })
    }
  },
  async mounted() {
    this.load = true
    let data = []
    this.modalCfg.data.forEach((i) => {
      if(i.checked) data.push(i.id)
    })
    this.checkApprovInfo()
  }
}
</script>