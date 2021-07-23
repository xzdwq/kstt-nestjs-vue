export default {
  name: 'scroll-lock',
  mounted() {
    document.documentElement.style.overflow = "hidden"
  },
  unmounted() {
    document.documentElement.style.overflow = "auto"
  }
}