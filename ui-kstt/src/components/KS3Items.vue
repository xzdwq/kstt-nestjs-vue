<template lang="pug">
div(class="p-1 pb-4 rounded-md bg-background-secondary border-2 border-transparent")
  div(class="grid grid-cols-2 gap-1 grid-rows-4 w-full h-36")
    //- header
    div(class="col-span-2 w-full")
      div.flex
        //- section-1(number)
        div(class="w-full pl-2 ")
          span(class="text-gray-400") # {{ item.certificate_number }}
        //- section-3(icons)
        div(class="pr-2 w-56 flex justify-end ")
          //- svg-papperclip(
          //-   class="p-1 cursor-pointer"
          //- )
          //- svg-star(
          //-   class="p-1 cursor-pointer"
          //- )
          svg-external(
            v-ttip="$t('open-card')"
            class="cursor-pointer"
            @click="$router.push(`/ks3/${item.id}`)"
          )
          svg-trash(
            v-if="KS2Delete"
            v-ttip="$t('delete')"
            class="cursor-pointer"
            @click="onDelKS2Confirm(item)"
          )
    //- middle-block
    div(class="pl-3 mt-[-10px] col-span-2 w-full ")
      span {{ $t('ks3.document') }}: 
      span(class="font-semibold") {{ item.document_number }}/{{ item.certificate_number }}  
      span {{ $t('ks3.document-dated') }} 
      span(class="font-semibold") {{ formatDate(item.date_preparation, this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy') }}
    //- left-bottom-block
    div(class="w-full h-20 pl-3 ")
      span(class="text-sm") {{ $t('ks3.reporting-period') }}: 
      span(class="font-semibold") {{ formatDate(item.reporting_period, 'LLLL yyyy') }}
      br
      span(class="text-sm") {{ $t('ks3.created') }}: 
      span(class="font-semibold") {{ formatDate(item.create_at, this.$i18n.locale == 'ru' ? 'dd.MM.yyyy' : 'MM/dd/yyyy') }}
      br
      span(class="text-sm") {{ $t('ks3.author') }}: 
      span(class="text-sm font-semibold") {{ item.user.full_name }}
    //- right-bottom-block
    div(class="flex justify-end h-20 ")
      stage-workflow(
        class="pt-4"
        type="small"
        :stageWorkflow="item.workflow.stage"
        :activeStageWorkflow="item.workflow.current_stage"
      )
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndCloseModal") OK
</template>
<script>
import axios from 'axios'
import { format } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'

import matchRoles from '@/mixins/matchRoles'
import toast from '@/mixins/toast'

import {
  mapGetters
} from 'vuex'
export default {
  name: 'ks3-items',
  props: {
    item: {
      type: Object
    }
  },
  mixins: [toast, matchRoles],
  data() {
    return {
      KS2Delete: false,
      modalCfg: {
        modalShow: false
      },
      ru: ru,
      en: enGB,
    }
  },
  computed: {
    ...mapGetters({
      getStageWorkflow: 'ks3Module/getStageWorkflow',
      getIsLoadStageWorkflow: 'ks3Module/getIsLoadStageWorkflow'
    })
  },
  methods: {
    onDelKS2Confirm(item) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('del-ks3', {name: item.document_number}),
        component: 'confirm',
        type: 'delete-ks3',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]',
        ks3_id: item.id
      }
    },
    async onDelKS2(id) {
      await axios.delete('api/ks3', {
        params: {
          _ks3_id: id
        }
      })
        .then(data => {
          if(data.data.success) {
            this.$emit('refreshKS3')
            this.onToast('success', this.$t('success'))
          }
        })
    },
    async saveAndCloseModal() {
      if(this.modalCfg.type === 'delete-ks3') {
        await this.onDelKS2(this.modalCfg.ks3_id)
      }
      this.closeModal()
    },
    closeModal() {
      this.modalCfg = {
        modalShow: false
      }
    },
    formatDate(date, formatType) {
      return format(
        new Date(date),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    }
  },
  async mounted() {
    await this.matchRole('KS2Delete')
  },
}
</script>