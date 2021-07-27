<template lang="pug">
div(class="flex w-full")
  div(class="flex items-center w-full")
    def-button(
      class="text-white bg-[#579bae] p-[2px]"
      @click="jumpFirstPage"
    )
      svg-doubleleft
    def-button(
      class="text-white bg-[#579bae] p-[2px]"
      @click="prevPage"
    )
      svg-left
    span(class="px-2 lg:text-base text-xs") {{ $t('page') }}
    input(
      type="number"
      v-model="currentPage"
      min="1"
      :max="getTotalPage"
      @input="inputPage"
      class="w-12 appearance-none text-copy-secondary p-[2px]"
    )
    span(class="px-2 lg:text-base text-xs") {{ $t('outof', {total: getTotalPage}) }}
    def-button(
      class="text-white bg-[#579bae] p-[2px]"
      @click="nextPage"
    )
      svg-right
    def-button(
      class="text-white bg-[#579bae] p-[2px]"
      @click="jumpLastPage"
    )
      svg-doubleright
    span(class="px-2 lg:text-base text-xs") {{ $t('qtyrows') }}:
    input(
      type="number"
      v-model="limitRecords"
      min="1"
      :max="totalRecords"
      class="w-12 appearance-none text-copy-secondary p-[2px]"
    )
    def-button(
      class="text-white bg-[#579bae] p-[2px]"
      @click="changeSettings"
    )
      svg-check
  div(class="flex w-2/4 items-center justify-end")
    span(class="lg:text-base text-xs") {{ paginatorInfo }}
</template>
<script>
export default {
  name: 'def-pagination',
  props: [
    'getPageModule',
    'getTotalPageModule',
    'fetchStoreModule',
    'setPageModule',
    'getLimitModule',
    'setLimitModule',
    'getTotalRecordsModule',
  ],
  data() {
    return {
      currentPage: 1,
      limitRecords: null,
      totalRecords: null
    }
  },
  methods: {
    setPage(page) {
      this.$store.commit(this.setPageModule, page)
    },
    async fetchKS3() {
      await this.$store.dispatch(this.fetchStoreModule)
    },
    async setLimit(limit) {
      await this.$store.commit(this.setLimitModule, limit)
    },
    async changeSettings() {
      if(+this.limitRecords != this.getLimitRecords) this.currentPage = 1
      this.currentPage != '' ? this.setPage(this.currentPage) : this.currentPage = 1
      await this.setLimit(this.limitRecords)
      await this.fetchKS3()
    },
    inputPage(event) {
      const value = event.target.value;
      if(value < 1 && value != '') this.currentPage = 1
      if(value > this.getTotalPage) this.currentPage = this.getTotalPage
    },
    jumpFirstPage() {
      let page = +this.currentPage
      if(page != 1) {
        this.currentPage = 1
        this.$store.commit(this.setPageModule, this.getTotalPage)
        this.changeSettings()
      }
    },
    prevPage() {
      let page = +this.currentPage
      if(page != 1) {
        this.currentPage = page - 1
        this.$store.commit(this.setPageModule, this.getTotalPage)
        this.changeSettings()
      }
    },
    nextPage() {
      let page = +this.currentPage
      if(page != this.getTotalPage) {
        this.currentPage = page + 1
        this.$store.commit(this.setPageModule, this.currentPage)
        this.changeSettings()
      }
    },
    jumpLastPage() {
      let page = +this.currentPage
      if(page != this.getTotalPage) {
        this.currentPage = this.getTotalPage
        this.$store.commit(this.setPageModule, this.getTotalPage)
        this.changeSettings()
      }
    }
  },
  computed: {
    getPage() {
      return this.$store.getters[this.getPageModule]
    },
    getTotalPage() {
      return this.$store.getters[this.getTotalPageModule]
    },
    getLimitRecords() {
      return this.$store.getters[this.getLimitModule]
    },
    getTotalRecords() {
      this.totalRecords = this.$store.getters[this.getTotalRecordsModule]
      return this.$store.getters[this.getTotalRecordsModule]
    },
    paginatorInfo() {
      let page = +this.getPage,
            limit = +this.getLimitRecords,
            total = +this.getTotalRecords,
            startList, limitList

      limitList = (limit * page);
      startList = (limitList - limit) + 1;
      if(limitList > total) limitList = total

      return this.$t('paginator-info', {startList: startList, limitList: limitList, total: total})
    }
  },
  async mounted() {
    this.currentPage = await this.getPage
    this.limitRecords = await this.getLimitRecords
    this.getTotalRecords
  }
}
</script>