<template lang="pug">
div(class="h-full w-full")
  //- toolbar
  div(class="flex items-center justify-start pb-2")
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="onRefresh"
    )
      svg-refresh(:class="{'animate-spin z-0' : load}")
    def-button(
      class="text-white bg-[#579bae] flex justify-between duration-300"
      :class="{'bg-[#8eafb8]': filter === 'all'}"
      @click="onFilter('all')"
    ) {{ $t('all') }}
    def-button(
      class="text-white bg-[#579bae] flex justify-between duration-300"
      :class="{'bg-[#8eafb8]': filter === 'ks2_excel'}"
      @click="onFilter('ks2_excel')"
    ) {{ $t('excel-form') }}
    def-button(
      class="text-white bg-[#579bae] flex justify-between duration-300"
      :class="{'bg-[#8eafb8]': filter === 'ks2_pdf'}"
      @click="onFilter('ks2_pdf')"
    ) {{ $t('pdf-form') }}
    def-button(
      class="text-white bg-[#579bae] flex justify-between duration-300"
      :class="{'bg-[#8eafb8]': filter === 'ks6a'}"
      @click="onFilter('ks6a')"
    ) {{ $t('ks6a-form') }}
    def-button(
      class="text-white bg-[#579bae] flex justify-between duration-300"
      :class="{'bg-[#8eafb8]': filter === 'other_ks2'}"
      @click="onFilter('other_ks2')"
    ) {{ $t('other-files') }}
  //- load
  div(v-if="archive.length === 0 && load" class="flex justify-center items-center w-full h-[calc(100%-50px)]")
    svg-loading
    p {{ $t('loading') }}
  div(
    v-if="archive.length === 0 && !load"
    class="flex justify-center items-center w-full h-[calc(100%-50px)]"
  )
    p(class="bg-background-secondary rounded-md p-4") {{ $t('no-data') }}
  //- body
  div(v-if="archive.length > 0" class="bg-background-secondary rounded-md h-[calc(100%-50px)] w-full overflow-y-scroll")
    table(class="w-full border-separate border-spacing-0 text-center" v-resize-column)
      tr(class="sticky top-0 bg-background-tertiary")
        table-header(
          :headers=[
            { title: 'item-no' }, { title: 'file-name' }, { title: 'version' },
            { title: 'create-date' }, { title: 'file-type' }, { title: 'ks3.author' }, { title: 'actual' },
            { title: 'event' }
          ]
        )
      tr(
        v-for="(item, idx) in archive"
        :ket="item.id"
        class="even:bg-background-primary"
      )
        td {{ idx+1 }}
        td(
          class="truncate max-w-[400px] text-blue-600 text-sm underline cursor-pointer appearance-none text-left"
          @click="onDownload(item)"
        ) {{ item.name }}
        td {{ item.version }}
        td {{ formatDate(item.create_at) }}
        td(class="text-sm") {{ this.$i18n.locale == 'ru' ? item.file_type.description_ru : item.file_type.description_en }}
        td(class="text-sm") {{ item.user.full_name }}
        td(class="flex justify-center items-center")
          svg-check(v-if="item.actual" class="text-green-500")
          svg-close(v-else class="text-red-400")
        td
          span(v-if="!item.actual") {{ this.$i18n.locale == 'ru' ? item.event_ru : item.event_en }} ({{ formatDate(item.update_at) }})
</template>
<script>
import axios from 'axios'
import { format, addMinutes } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'

import fileSave from '@/mixins/fileSave'
export default {
  name: 'version-archive',
  props: ['modalCfg'],
  mixins: [fileSave],
  data() {
    return {
      load: true,
      archive: [],
      filter: null,
      ru: ru,
      en: enGB,
    }
  },
  methods: {
    formatDate(date) {
      date = new Date(date)
      let formatType = this.$i18n.locale == 'ru' ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy h:mm a'
      return format(
        addMinutes(date, date.getTimezoneOffset()),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    },
    async onDownload(file_info) {
      await axios.get(`api/ks2/download/${file_info.uuid}`, {
        responseType: 'blob'
      })
      .then((resp) => {
        this.onFileSave(resp.data, file_info.name)
      });
    },
    async onLoad() {
    const ks2_id = this.modalCfg.ks2_id
      await axios.get(`api/ks2archive/${ks2_id}`, {
        params: {
          _filter: this.filter
        }
      })
        .then((data) => {
          this.archive = data.data.data
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
    this.filter = this.modalCfg.filterType
    await this.onLoad()
  }
}
</script>