import axios from "axios";

export default {
  methods: {
    async sendAgree() {
      if(!this.modalCfg.cert) {
        this.onToast('danger', this.$t('error'), this.$t('crypto.cert-select'))
      } else {
        await axios.post('api/ks2/approve', {
          params: this.modalCfg.ks2_ready_prepare
        })
        this.onRefresh()
        this.modalCfg = {
          modalShow: false,
          showOKAgree: false
        }
      }
    }
  }
}