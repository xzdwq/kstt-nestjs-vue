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
</template>
<script>
import axios from "axios"
export default {
  name: 'add-user-role',
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
            const match = this.userInRepo.find(i => i.user.email === user.Email)
            if(match) user.disabled = true
          })
          return data.data.data
        }
      }
    }
  },
  async mounted() {
    this.modalCfg.tmpAddUser = []
    this.userInRepo = this.modalCfg.data.role.user_role
  }
}
</script>