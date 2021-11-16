<template lang="pug">
div(class="relative bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  multiselect(
    v-model="modalCfg.tmpAddUser"
    mode="tags"
    :multiple="true"
    :placeholder="$t('search-user')"
    :noOptionsText="$t('no-list-data')"
    :object="true"
    :filterResults="false"
    :resolveOnLoad="false"
    :delay="400"
    :searchable="true"
    :options="onSearch"
    :clearOnSearch="true"
    valueProp="Email"
    label="DisplayName"
    trackBy="UserName"
  )
    template(v-slot:option="{ option }")
      div
        div {{ option.DisplayName }}
        div(class="tetx-sm italic") {{ option.Position }}
  //- Пользователи из репозитория
  div(v-if="userInRepo.length > 0" class="pt-4") {{ $t('user-in-group') }}:
  div(v-else class="pt-4 italic") {{ $t('user-in-group-empty') }}
  div(class="flex flex-wrap text-sm text-copy-secondary pt-3")
    div(
      v-for="user in userInRepo"
      key="id"
      class="pb-1 pr-1"
    )
      div(class="border-2 border-gray-300 rounded-md px-1")
        div {{ user.full_name }}
        div(class="italic") {{ user.position || '-' }}
  //- Метки
  //- div(class="absolute bottom-0 left-1 py-1 pr-1 flex items-center justify-end text-center")
  //-   div(
  //-     class="text-[10px] text-copy-secondary rounded-3xl"
  //-     :class="modalCfg.data.group.group.type.id == 1 ? 'bg-green-200' : 'bg-red-200'"
  //-   )
  //-     div(class="px-1") {{ this.$i18n.locale == 'ru' ? modalCfg.data.group.group.type.name_ru : modalCfg.data.group.group.type.name_en }}
</template>
<script>
import axios from "axios"
export default {
  name: 'add-user-in-group',
  props: ['modalCfg'],
  data() {
    return {
      value: [],
      users: [],
      userInRepo: []
    }
  },
  methods: {
    async onSearch(val) {
      if(val) {
        const data = await axios.get('api/defaultworkflow/userfound', {
          params: {
            _query: val
          }
        })
        if(data.data.isFound) {
          this.users = data.data.data
          this.users.forEach((user) => {
            const match = this.userInRepo.find(i => i.email === user.Email)
            if(match) user.disabled = true
          })
          return data.data.data
        }
      }
    }
  },
  async mounted() {
    this.modalCfg.tmpAddUser = []
    this.userInRepo = []
    const group_id = this.modalCfg.data.group.id
    if(this.modalCfg.ks2_id) {
      await axios.get(`api/ks2/workflow/useringroup/${group_id}`)
        .then((data) => {
          if(data.data.success) {
            this.userInRepo = data.data.data.ks2_users
          }
        })
    } else {
      await axios.get(`api/workflow/useringroup/${group_id}`)
        .then((data) => {
          if(data.data.success) {
            this.userInRepo = data.data.data.users
          }
        })
    }
  }
}
</script>