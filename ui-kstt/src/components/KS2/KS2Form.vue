<template lang="pug">
div(class="h-full")
  div(v-if="getKS3id.length > 0 && !getIsLoadingKS3" class="h-full")
    fieldset(class="border-2 border-gray-400 rounded p-3 min-h-[120px] h-full")
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
              input(
                ref="importKS2file"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                @change="onImportKS2Upload"
                hidden
              )
      //- body
      div(v-for="item in getKS2id")
        span {{ item.document_number }}
      //- table
      div(
        v-if="getKS2id.length === 0 && !getIsLoadingKS2"
        class="py-2"
      )
        p {{ $t('no-data') }}
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
import axios from "axios";

import toast from '@/mixins/toast'

export default {
  name: 'ks2-form',
  mixins: [toast],
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
    onRefresh() {
      this.fetchKS2()
    },
    async onImportKS2() {
      let importKS2file = this.$refs.importKS2file;
      importKS2file.click();
    },
    async onImportKS2Upload(event) {
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append('file', file);
      formData.append('ks3_id', this.getKS3id[0].id)
      formData.append('workflow_id', this.getKS3id[0].workflow_id)

      await axios.post( 'api/ks2/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((e) => {
        this.onRefresh()
        this.onToast('success', this.$t('ks2-upload', {file: file.name}))
      })
      .catch((e) => {
        this.onToast('danger', this.$t('upload-error'), e.toString())
      });
    }
  },
  async mounted() {
    await this.fetchKS2({ks3_id: this.id})
  }
}
</script>