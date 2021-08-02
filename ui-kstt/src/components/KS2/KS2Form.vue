<template lang="pug">
div
  div(v-if="getKS3id.length > 0 && !getIsLoadingKS3")
    fieldset(class="border-2 border-gray-400 rounded p-3 min-h-[120px]")
      legend(class="text-sm px-2 font-bold") {{ $t("ks2.acts") }}
      //- toolbar
      div.flex
        dropdown-menu(
          :text="$t('ks2.create')"
          listAligh="left"
          listWidthClass="w-52"
        )
          template(v-slot:icon)
            svg-document-add(class="p-[2px]")
          template(v-slot:items)
            div(
              class="flex items-center p-2 rounded cursor-pointer select-none hover:bg-gray-200 text-gray-500"
              @click="onCreateKS2"
            )
              svg-document(class="mr-2")
              div {{ $t('ks2.create-card') }}
            div(
              class="flex items-center p-2 rounded cursor-pointer select-none hover:bg-gray-200 text-gray-500"
              @click="onImportKS2"
            )
              svg-upload(class="mr-2")
              div {{ $t('ks2.import-card') }}
      //- body
      div(
        v-if="getKS2id.length > 0 && !getIsLoadingKS2"
        class="py-2"
      )
        span {{ getKS2id }}
      //- load
      div(v-if="getKS2id.length === 0 && getIsLoadingKS2" class="absolute w-[calc(100%-55px)] flex items-center justify-center")
        svg-loading
        p {{ $t('loading') }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'ks2-form',
  data() {
    return {
      id: this.$route.params.id
    }
  },
  computed: {
    ...mapGetters({
      getIsLoadingKS3: 'ks3idModule/getIsLoading',
      getKS3id: 'ks3idModule/getKS3id',
      getIsLoadingKS2: 'ks2idModule/getIsLoading',
      getKS2id: 'ks2idModule/getKS2id'
    })
  },
  methods: {
    ...mapActions({
      fetchKS2: 'ks2idModule/fetchKS2'
    }),
    async onCreateKS2() {
      console.log(123);
    },
    async onImportKS2() {
      console.log(456);
    }
  },
  async mounted() {
    await this.fetchKS2()
  }
}
</script>