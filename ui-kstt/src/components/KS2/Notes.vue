<template lang="pug">
div(class="relative w-full h-full overflow-scroll")
  div(class="flex w-full h-full justify-center")
    div(
      v-for="group in groups"
      :key="group.code"
      class="w-full p-2 min-w-[200px]"
    )
      //- Наименование уникальных групп (из согласования и подисания)
      div.font-bold {{ group[`name_${$i18n.locale}`] }}:
      //- Комментарии
      div(
        v-if="group.comments.length > 0"
        class="h-[calc(100%-60px)] overflow-scroll border-2 border-border-color-primary rounded-md p-1"
      )
        div(
          v-for="comment in group.comments"
          :key="comment.id"
        )
          div(
            class="rounded-md bg-background-tertiary mb-1 p-1 break-words"
            :class="comment.author_comment.email === getUser.Email ? 'ml-5' : 'mr-5'"
          )
            div(class="flex relative w-full")
              div(class="relative flex-1 break-words break-all")
                div {{ comment.comment }}
                div(class="italic text-[8pt]")
                  span.pr-1 {{ comment.author_comment.full_name }}
                  span ({{ formatDate(comment.create_at) }})
              div(
                v-if="comment.author_comment.email === getUser.Email || metadataKs3"
                class="flex-0 pl-2"
              )
                svg-trash(
                  class="cursor-pointer"
                  @click="onDelMessageConfirm(comment)"
                )
      div(
        v-else
        class="h-[calc(100%-60px)] border-2 border-border-color-primary rounded-md p-1"
      ) {{ $t('no-data') }}
      //- Добавление комментария
      div.flex.mt-1(v-if="matchUserInArray(group.users)")
        input(
          type="text"
          :ref="`${group.code}_input`"
          :placeholder="$t('text-comment')"
          class="h-7"
        )
        def-button(
          class="rotate-90 h-7 text-white bg-[#06d6a0] p-0"
          @click="sendComment(group.code)"
        )
          papper-airplane
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
import toast from '@/mixins/toast'
import {
  mapGetters
} from 'vuex'
import matchRoles from '@/mixins/matchRoles'

export default {
  name: 'ks2-notes',
  mixins: [ toast, matchRoles ],
  data() {
    return {
      ru: ru,
      en: enGB,
      groups: [],
      modalCfg: {
        modalShow: false
      },
      metadataKs3: false,
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'authModule/getUser'
    })
  },
  methods: {
    matchUserInArray(userArray) {
      const match = userArray.find(ua => ua.email === this.getUser.Email)
      return match ? true : false
    },
    sendComment(code) {
      const comment = this.$refs[`${code}_input`]
      const text = comment.value.trim()
      if(text) {
        axios.post('api/ks2/addcomment', {
          params: {
            comment: text,
            code: code,
            ks2_id: +this.$route.params.id
          }
        })
        .then(data => {
          if(data.data.success) {
            this.$emit('onRefresh')
            comment.value = null
          } else {
            this.onToast('danger', this.$t('error'), data.data.message)
          }
        })
      } else {
        this.onToast('warning', this.$t('warning'), this.$t('text-comment'))
      }
    },
    onDelMessageConfirm(comment) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        question: this.$t('del-comment-confirm'),
        component: 'confirm',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[25%]',
        data: comment,
        fn: 'onDelMessage'
      }
    },
    onDelMessage() {
      const commentId = this.modalCfg.data.id
      axios.delete(`api/ks2/delcomment/${commentId}`)
    },
    saveAndClose() {
      this[this.modalCfg.fn]()
      this.closeModal()
      this.$emit('onRefresh')
    },
    closeModal() {
      this.modalCfg = {
        showOK: false
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
    await this.matchRole('metadataKs3')
  },
}
</script>