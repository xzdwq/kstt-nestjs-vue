<template lang="pug">
div(class="flex w-full")
  div(
    class="flex justify-start items-center flex-1"
    :class="alignInfo == 'start' ? 'max-w-[550px]' : null"
  )
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
    span(class="px-2 lg:text-base text-xs min-w-[50px]") {{ $t('outof', {total: getTotalPage}) }}
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
    div(
      class="hidden md:flex justify-start items-center md:min-w-[190px] lg:min-w-[250px]"
    )
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
  div(
    class="hidden sm:flex flex-0 items-center pl-1"
    :class="`justify-${alignInfo}`, alignInfo == 'start' ? 'flex-1' : null"
  )
    span(class="lg:text-base text-xs") {{ paginatorInfo }}
</template>
<script>
export default {
  name: 'def-pagination',
  props: [
    'getPageModule',
    'getTotalPageModule',
    'fetchStoreModule',
    'fetchStoreModuleParams',
    'setPageModule',
    'getLimitModule',
    'setLimitModule',
    'getTotalRecordsModule',
    'alignInfo'
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
      const fn = this.fetchStoreModule
      const params = this.fetchStoreModuleParams
      await this.$store.dispatch(fn, params)
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
    this.emitter.on('onSearchNeedResetPage', () => {
      this.currentPage != 1 ? this.currentPage = 1 : null
    })
  }
}
</script>