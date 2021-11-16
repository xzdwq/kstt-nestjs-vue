import resizableGrid from '@/plugins/resizeColumn'

export default {
  name: 'resize-column',
  mounted(el) {
    resizableGrid(el)
  }
}