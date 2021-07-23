<template lang="pug">
div
  div(class="md:mx-auto flex")
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
      span {{ $t('ks3-create') }}
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ $t('ks3-create') }}
    template(v-slot:body)
      create-ks3(ref="createKS3Form")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
  div(class="pt-4")
    transition-group(:name="getTransitionType")
      ks3-items(
        v-for="item in getKS3"
        :item="item"
        :key="item.uuid"
      )
      div(v-if="getKS3.length === 0 && !getIsLoading" class="absolute flex w-full justify-center")
        p {{ $t('no-data') }}
      div(v-if="getKS3.length === 0 && getIsLoading" class="absolute flex items-center w-full justify-center")
        svg-loading
        p {{ $t('loading') }}
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
        width: 'w-9/12',
        height: 'h-4/6'
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
    ...mapActions({
      fetchKS3: 'ks3Module/fetchKS3'
    }),
  },
  computed: {
    ...mapGetters({
      getKS3: 'ks3Module/getKS3',
      getIsLoading: 'ks3Module/getIsLoading',
      getNeedLoad: 'ks3Module/getNeedLoad',
      getTransitionType: 'ks3Module/getTransitionType'
    }),
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