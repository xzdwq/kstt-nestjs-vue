<template lang="pug">
div(class="h-full")
  //- toolbar
  div(class="md:mx-auto flex pb-2")
    popper(arrow :hover="true" placement="bottom"
      class="flex items-center pr-2 popper-tips"
      :content="$t('refresh')"
    )
      def-button(
        class="text-white bg-[#579bae] flex justify-between"
        @click="onRefreshKS3"
      )
        svg-refresh(:class="{'animate-spin z-0' : getIsLoading}")
    def-button(
      class="text-white bg-[#06d6a0] flex justify-between"
      @click="onCreateKS3"
    )
      svg-document-add
      span(class="hidden md:block") {{ $t('ks3-create') }}
    def-search(
      class="px-2 w-80"
      delay="700"
      @update:searchQuery="searchQuery"
    )
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ $t('ks3-create') }}
    template(v-slot:body)
      create-ks3(ref="createKS3Form")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
  //- body table content
  div(class="h-[calc(100vh-165px)] overflow-y-scroll overflow-x-hidden")
    div(class="grid gap-2 lg:grid-cols-2")
      //- transition-group(:name="getTransitionType")
      ks3-items(
        v-for="item in getKS3"
        :item="item"
        :key="item.uuid"
      )
      div(v-if="getKS3.length === 0 && !getIsLoading && isEmptySearchQuery" class="absolute w-[calc(100%-55px)] flex justify-center")
        p {{ $t('no-data') }}
      div(v-if="getKS3.length === 0 && !getIsLoading && !isEmptySearchQuery" class="absolute w-[calc(100%-55px)] flex justify-center")
        p {{ $t('no-search-data', { searchQuery: getSearchQuery }) }}
      div(v-if="getKS3.length === 0 && getIsLoading" class="absolute w-[calc(100%-55px)] flex items-center justify-center")
        svg-loading
        p {{ $t('loading') }}
  //- paginator
  def-pagination(
    class="pt-2"
    getPageModule="ks3Module/getPage"
    getTotalPageModule="ks3Module/getTotalPage"
    setPageModule="ks3Module/setPage"
    fetchStoreModule="ks3Module/fetchKS3"
    getLimitModule="ks3Module/getLimit"
    setLimitModule="ks3Module/setLimit"
    getTotalRecordsModule="ks3Module/getKS3Total"
  )
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'register',
  data() {
    return {
      modalCfg: {
        modalShow: false,
        width: 'w-[95%] sm:w-[85%] lg:w-[70%] xl:w-[700px]',
        height: 'h-[80%] sm:h-[70%] lg:h-4/6 '
      }
    }
  },
  methods: {
    onCreateKS3() {
      this.modalCfg.modalShow = true
    },
    closeModal() {
      this.modalCfg.modalShow = false
    },
    async onRefreshKS3() {
      try{
        await this.fetchKS3()
      } catch(e) { console.log(e) }
    },
    async saveAndCloseModal() {
      await this.emitter.emit('onCreateNewKS3')
    },
    async searchQuery(query) {
      this.fetchKS3(query)
    },
    ...mapActions({
      fetchKS3: 'ks3Module/fetchKS3'
    }),
  },
  computed: {
    ...mapGetters({
      getKS3: 'ks3Module/getKS3',
      getIsLoading: 'ks3Module/getIsLoading',
      getNeedLoad: 'ks3Module/getNeedLoad',
      getTransitionType: 'ks3Module/getTransitionType',
      isEmptySearchQuery: 'ks3Module/isEmptySearchQuery',
      getSearchQuery: 'ks3Module/getSearchQuery',
    })
  },
  async mounted() {
    try{
      if(this.getNeedLoad) {
        await this.fetchKS3()
      }
    } catch(e) { console.log(e) }
  }
}
</script>