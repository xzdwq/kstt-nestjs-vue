<template lang="pug">
div(class="relative w-full h-full pb-4")
  //- toolbar
  div.relative.pb-1.flex
    def-button(
      v-if="KS2OtherFile && (ks2?.data.ks2_status.code != 'agreed' && ks2?.data.ks2_status.code != 'annuled' && ks2?.data.ks2_status.code != 'signed')"
      class="flex justify-between h-7 p-0 px-1 text-white bg-[#06d6a0]"
      @click="uploadOtherFile"
    )
      svg-upload
      span(class="hidden md:block md:pl-1") {{ $t('upload-file') }}
      input(
        ref="uploadOtherFile"
        type="file"
        @change="onUploadOtherFile"
        hidden
      )
    def-button(
      class="flex justify-between h-7 p-0 px-1 text-white bg-[#06d6a0]"
      @click="onVersionArchive(filter)"
    )
      svg-archive
      span(class="hidden md:block md:pl-1") {{ $t('archive-version') }}
  //- load
  div(v-if="archive.length === 0 && load" class="absolute flex justify-center items-center w-full h-[calc(100%-50px)]")
    svg-loading
    p {{ $t('loading') }}
  div(
    v-if="archive.length === 0 && !load"
  ) {{ $t('no-data') }}
  //- body
  div(class="h-[calc(100%-5px)] overflow-scroll")
    table(v-if="archive.length > 0" class="w-full border-separate border-spacing-0 text-center" v-resize-column)
      tr(class="sticky top-0 bg-background-tertiary")
        table-header(
          :headers=[
            { title: 'item-no' }, { title: 'file-name' }, { title: 'version' },
            { title: 'create-date' }, { title: 'size' }, { title: 'ks3.author' }, { title: '', type: 'action' }
          ]
        )
      tr(
        v-for="(item, idx) in archive"
        :ket="item.id"
        class="even:bg-background-primary"
      )
        td {{ idx+1 }}
        td(
          class="truncate max-w-[400px] text-blue-600 text-sm underline appearance-none text-left"
        )
          span(class="cursor-pointer" @click="onDownload(item)") {{ item.name }}
        td {{ item.version }}
        td {{ formatDate(item.create_at) }}
        td {{ onSize(item.size) }} {{ $t('kb') }}
        td(class="text-sm") {{ item.user.full_name }}
        td(class="flex justify-center items-center")
          svg-download(
            @click="onDownload(item)"
            class="mx-1 cursor-pointer"
          )
          div(
            v-if="item.user.email === getUser.Email || metadataKs3"
            class="flex"
          )
            svg-upload(
              v-if="KS2OtherFile"
              @click="uploadNewVersion(item.id)"
              class="mx-1 cursor-pointer"
            )
            input(
              :ref="`uploadNewVersion_${item.id}`"
              type="file"
              @change="onUploadNewVersion"
              :file_id="item.id"
              :file_uuid="item.uuid"
              hidden
            )
            svg-trash(
              v-if="KS2OtherFile"
              @click.prevent="onDeleteConfirm(item)"
              class="mx-1 cursor-pointer"
            )
    div(v-if="isUpload" class="absolute top-0 bg-gray-400 bg-opacity-50 w-full h-full flex items-center justify-center")
      div(class="bg-background-secondary rounded-md p-4 flex items-center justify-center")
        svg-loading
        p {{ $t('loading') }}
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(v-if="showOKBtn" class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
</template>
<script>
import axios from 'axios'
import { format, addMinutes } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'
import {
  mapGetters
} from 'vuex'

import fileSave from '@/mixins/fileSave'
import toast from '@/mixins/toast'
import matchRoles from '@/mixins/matchRoles'
import numberWithSpaces from '@/mixins/numberWithSpaces'
export default {
  name: 'other-files',
  mixins: [fileSave, toast, numberWithSpaces, matchRoles],
  props: ['count', 'ks2'],
  data() {
    return {
      KS2OtherFile: false,
      metadataKs3: false,
      isUpload: false,
      load: true,
      archive: [],
      filter: 'other_ks2',
      ks2_id: this.$route.params.id,
      ru: ru,
      en: enGB,
      modalCfg: {
        modalShow: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'authModule/getUser'
    }),
    showOKBtn() {
      return this.modalCfg.component != 'version-archive'
    }
  },
  methods: {
    onSize(size) {
      return this.numberWithSpaces((size / 1024).toFixed(2))
    },
    // Скачать файл
    async onDownload(file_info) {
      await axios.get(`api/ks2/download/${file_info.uuid}`, {
        responseType: 'blob'
      })
      .then((resp) => {
        this.onFileSave(resp.data, file_info.name)
      });
    },
    // Згрузка файла
    uploadOtherFile() {
      let otherFile = this.$refs.uploadOtherFile;
      otherFile.click();
    },
    async onUploadOtherFile(event) {
      this.isUpload = true
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append('file', file);
      formData.append('ks2_id', this.ks2_id)
      await axios.post( 'api/ks2/otherupload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((data) => {
        if(data?.data.success) {
          this.onToast('success', this.$t('upload-other-file', {name: file.name}))
          this.onRefresh()
        } else {
          this.onToast('danger', this.$t('upload-error'))
        }
        this.isUpload = false
      })
    },
    // Загрузка новой версии
    uploadNewVersion(id) {
      let el = this.$refs[`uploadNewVersion_${id}`];
      el.click()
    },
    async onUploadNewVersion(event) {
      this.isUpload = true
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append('file', file);
      formData.append('ks2_id', this.ks2_id)
      const ks2_other_file_id = event.target.attributes?.file_id.value
      const ks2_other_file_uuid = event.target.attributes?.file_uuid.value
      formData.append('ks2_other_file_id', ks2_other_file_id)
      formData.append('ks2_other_file_uuid', ks2_other_file_uuid)
      await axios.post( 'api/ks2/otherupload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((data) => {
        if(data?.data.success) {
          this.onToast('success', this.$t('upload-other-file', {name: file.name}))
          this.onRefresh()
        } else {
          this.onToast('danger', this.$t('upload-error'))
        }
        this.isUpload = false
      })
    },
    formatDate(date) {
      date = new Date(date)
      let formatType = this.$i18n.locale == 'ru' ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy h:mm a'
      return format(
        addMinutes(date, date.getTimezoneOffset()),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    },
    // Подтвердить удаление файла
    async onDeleteConfirm(file_info) {
      this.modalCfg = {
        modalShow: true,
        file_info: file_info,
        title: this.$t('confirm'),
        component: 'confirm',
        type: 'delete-file',
        question: this.$t('delete-confirm-file', {name:file_info.name}),
        uuid: file_info.uuid,
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[25%]',
      }
    },
    // Удаление файла
    async onDeleteFile(file_info) {
      const uuid = file_info.uuid
      await axios.delete( 'api/ks2/deletefile', {
          params: {
            uuid: uuid
          }
        })
        .then((data) => {
        if(data?.data.success) {
          this.onToast('success', this.$t('success'))
        } else {
          this.onToast('danger', this.$t('upload-error'))
        }
      })
    },
    async saveAndCloseModal() {
      if(this.modalCfg.type === 'delete-file') {
        await this.onDeleteFile(this.modalCfg.file_info)
      }
      this.closeModal()
      this.onRefresh()
    },
    // Архив версий
    onVersionArchive(filterType) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('archive-version'),
        component: 'version-archive',
        width: 'w-[90%]',
        height: 'h-[95%]',
        filterType: filterType,
        ks2_id: +this.$route.params.id
      }
    },
    closeModal() {
      this.modalCfg = {
        modalShow: false
      }
    },
    async onLoad() {
      const ks2_id = this.$route.params.id
      await axios.get(`api/ks2otherfile/${ks2_id}`)
        .then((data) => {
          this.archive = data.data.data
          this.$store.commit('countTitleModule/setCntOtherFile', this.archive.length)
          setTimeout(() => { this.load = false }, 500)
        })
    },
    async onFilter(type) {
      this.filter = type
      await this.onRefresh()
    },
    async onRefresh() {
      this.load = true
      this.archive = []
      await this.onLoad()
    }
  },
  async mounted() {
    await this.matchRole('KS2OtherFile')
    await this.matchRole('metadataKs3')
    await this.onLoad()
  }
}
</script>