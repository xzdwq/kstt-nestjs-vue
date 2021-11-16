export default {
  methods: {
    async matchRole(type) {
      const match = await this.$store.dispatch('authModule/matchRole', type)
      this[type] = match
      return match
    }
  }
}