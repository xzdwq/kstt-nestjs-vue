export default {
  methods: {
    numberWithSpaces(num) {
      try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      } catch(e) { return '-' }
    }
  }
}