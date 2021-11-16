<template lang="pug">
div
  div(class="flex w-full justify-center")
    div {{ $t('role-management') }}
  div(v-if="roleManagment")
    div(
      v-for="role in roles"
      :key="role.id"
      class="even:bg-background-primary"
    )
      div(class="p-1 border-2 border-border-color-primary rounded-md mb-2")
        div(class="flex")
          span(class="flex flex-0 font-bold pr-1") {{ this.$i18n.locale === 'ru' ? role.name_ru : role.name_en }}
          span(class="flex flex-1" class="italic") ({{ role.comment ? role.comment : '-' }})
          svg-user-plus(class="cursor-pointer" @click="onAddUser(role)")
        div(class="pl-2")
          span(class="font-bold") {{ $t('participants')}}:
          div(v-if="role.user_role.length > 0" class="pl-1")
            div(
              v-for="(user, user_idx) in role.user_role"
              :key="user.id"
              class="flex"
            )
              //- span {{ user.user.create_at }}
              span(class="flex flex-0 pr-2 min-w-[40px]") {{ user_idx+1 }}.
              span(class="flex flex-1") {{ user.user.full_name }}
              span(class="flex flex-1") {{ formatDate(user.create_at) }}
              svg-trash(class="flex flex-0 cursor-pointer" @click="onDelUser(role, user)")
          div(v-else) {{ $t('no-data') }}
  //- modal
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
import { format, addMinutes } from 'date-fns'
import { enGB, ru } from 'date-fns/locale'
import toast from '@/mixins/toast'
import matchRoles from '@/mixins/matchRoles'
export default {
  name: 'role-managment',
  mixins: [toast, matchRoles],
  data() {
    return {
      ru: ru,
      en: enGB,
      roleManagment: false,
      roles: [],
      modalCfg: {
        modalShow: false
      }
    }
  },
  methods: {
    onAddUser(role) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('add-user-in-group'),
        component: 'add-user-role',
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[60%]',
        data: {
          role: role
        }
      }
    },
    onDelUser(role, user) {
      this.modalCfg = {
        modalShow: true,
        title: this.$t('confirm'),
        component: 'confirm',
        type: 'del-role',
        question: this.$t('del-role',
          {
            name:user.user.full_name,
            role: role[`name_${this.$i18n.locale}`]
        }),
        width: 'w-9/12 min-w-[500px] max-w-[700px]',
        height: 'h-[25%]',
        data: {
          role: role,
          user: user
        }
      }
    },
    async saveAndCloseModal() {
      if(this.modalCfg.component === 'add-user-role') {
        const params = {
          id: this.modalCfg.data.role.id,
          users: this.modalCfg.tmpAddUser
        }
        await axios.post('api/userroles', {
          params
        })
          .then(data => {
            if(data.data.success) {
              this.load()
            }
          })
      }
      if(this.modalCfg.type === 'del-role') {
        const params = {
          role_id: this.modalCfg.data.role.id,
          user_id: this.modalCfg.data.user.user.id
        }
        await axios.delete('api/userroles', {
          params
        })
          .then(data => {
            if(data.data.success) {
              this.load()
            }
          })
      }
      this.closeModal()
    },
    closeModal() {
      this.modalCfg = {
        modalShow: false
      }
    },
    async load() {
      if(this.roleManagment) {
        await axios.get('api/userroles')
          .then(data => {
            if(data.data.success) {
              this.roles = data.data.data
            }
          })
      }
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
  },
  async mounted() {
    await this.matchRole('roleManagment')
    await this.load()
  }
}
</script>