<template lang="pug">
div(class="relative w-full h-full overflow-scroll")
  div(class="h-full overflow-scroll")
    table(
      v-if="ks2?.data.ks2_history.length > 0"
      class="w-full border-separate border-spacing-0 text-center"
      v-resize-column
    )
      tr(class="sticky top-0 bg-background-tertiary")
        table-header(
          :headers=[
            { title: 'item-no' }, { title: 'status' }, { title: 'group' }, { title: 'remark' }, { title: 'ks3.author' }, { title: 'create-date' }, { title: 'closed' }, { title: 'closed_at' }, { title: '' }
          ]
        )
      tr(
        v-for="(item, idx) in ks2.data.ks2_history"
        :ket="item.id"
        class="even:bg-background-primary"
      )
        td {{ idx+1 }}
        //- td
        //-   input(
        //-     type="checkbox"
        //-     :checked="item.complete"
        //-     :disabled="true"
        //-     @change="chancgeCheckboxCompleted($event, item)"
        //-   )
        td(align="center")
          svg-check(v-if="item.complete")
          svg-close(v-else)
        td {{ item.group[`name_${$i18n.locale}`] }}
        td {{ item.text }}
        td {{ item.author.full_name }}
        td {{ formatDate(item.create_at) }}
        td
          span(v-if="item.answer") {{ item.answer?.full_name }}
          span(v-else) -
        td
          span(v-if="item.closed_at") {{ formatDate(item.closed_at) }}
          span(v-else) -
        td
          def-button(
            v-if="workflowManagmentKS3 && !item.complete"
            class="min-w-28 text-white bg-[#06d6a0] p-0 h-7"
            @click="completedRemark(item)"
          ) {{ $t('success-simple') }}
    div(v-else) {{ $t('no-data') }}
  //- модальное окно
  modal(v-model:modalCfg="modalCfg")
    template(v-slot:title) {{ modalCfg.title }}
    template(v-slot:body)
      component(:is="modalCfg.component" v-model:modalCfg="modalCfg")
    template(v-slot:bottom-toolbar)
      def-button(class="min-w-28 text-white bg-[#ef476f]" @click="closeModal") {{ $t('cancel') }}
      def-button(class="min-w-28 text-white bg-[#06d6a0]" @click="saveAndClose") OK
</template>
<script>
import axios from 'axios'
import { format, addMinutes } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'
import matchRoles from '@/mixins/matchRoles'
export default {
  name: 'ks2-history',
  props: ['ks2'],
  mixins: [matchRoles],
  data() {
    return {
      ru: ru,
      en: enGB,
      workflowManagmentKS3: false,
      modalCfg: {
        modalShow: false
      }
    }
  },
  methods: {
    completedRemark(item) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        component: 'confirm',
        question: this.$t('eliminating-remark'),
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[30%]',
        item: item,
        fn: 'eliminatingRemark'
      }
    },
    async eliminatingRemark() {
      const data = {...this.modalCfg.item}
      await axios.post('api/ks2/eliminatingremark', {
        data: data
      })
    },
    async saveAndClose() {
      await this[this.modalCfg.fn]()
      this.$emit('onRefresh')
      this.closeModal()
    },
    closeModal() {
      this.modalCfg = {
        modalShow: false
      }
    },
    formatDate(date) {
      date = new Date(date)
      let formatType = this.$i18n.locale == 'ru' ? 'dd.MM.yyyy HH:mm:ss' : 'MM/dd/yyyy h:mm:ss a'
      return format(
        addMinutes(date, date.getTimezoneOffset()),
        formatType,
        { locale: this.$i18n.locale == 'ru' ? this.ru : this.en }
      )
    }
  },
  async mounted() {
    await this.matchRole('workflowManagmentKS3')
  },
  watch: {
    ks2() {
      this.$store.commit('countTitleModule/setCntHistory', this.ks2.data.ks2_history.length)
    }
  }
}
</script>