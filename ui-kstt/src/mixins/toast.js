import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'

export default {
  methods: {
    onToast(type, title, description) {
      createToast({
        title: title,
        description: description || ''
      },
      {
        showCloseButton: false,
        swipeClose: true,
        hideProgressBar: true,
        position: 'bottom-left',
        type: type,
        showIcon: true,
        transition: 'bounce',
        timeout: 3500
      })
    }
  }
}