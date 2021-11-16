<template lang="pug">
div(class="bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  div(v-if="groups.length > 0")
    div(
      v-for="(group, group_idx) in groups"
      :key="group.id"
      class="pb-2"
    )
      div(class="border-b-2 border-dashed border-background-primary")
        input(
          type="checkbox"
          :checked="group.checked"
          :disabled="group.disabled"
          :indeterminate.prop="group.indeterminate"
          @change="selected($event, group.id)"
        )
        b.pl-2 {{ $t('group') }}: 
        b {{ group[`name_${$i18n.locale}`] }}
      div(v-if="group.user_group.length > 0")
        div(
          v-for="(user, user_idx) in group.user_group"
          :key="user.id"
          class="pl-2 text-sm"
        )
          div(class="flex items-center border-b border-dashed border-background-primary")
            input(
              type="checkbox"
              :checked="user.checked"
              :disabled="user.disabled"
              @change="selected($event, group.id, user.id)"
            )
            div(class="flex-1")
              div.pl-2 {{ user.user.full_name }}
              div.pl-2.italic {{ user.user.email }}
            div(class="flex-1") {{ user.user.position }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'add-extra-approver',
  props: ['modalCfg'],
  data() {
    return {
      groups: [],
      waitAndFutureGroups: [],
      tmpUsers: []
    }
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'groupModule/getIsLoading',
      getGroup: 'groupModule/getGroup'
    })
  },
  methods: {
    ...mapActions({
      fetchGroup: 'groupModule/fetchGroup',
    }),
    selected(event, group_id, user_id) {
      this.modalCfg.tmpUsers = []
      const checked = event.target.checked
      let allCheckUser = 0
      // Если по группе
      if(!user_id) {
        this.groups.forEach(g => {
          if(g.id === group_id) {
            if(!g.disabled) {
              g.indeterminate = false
              g.checked = checked
            }
            g.user_group.forEach(gu => {
              if(!gu.disabled) {
                gu.checked = checked
              }
            })
          }
        })
      }
      // Если по пользователю
      if(user_id) {
        let userChecked = 0, userSelectNoDisabled = 0
        const groupIndex = this.groups.findIndex(g => g.id === group_id)
        const group = this.groups[groupIndex]
        group.user_group.forEach(gu => {
          if(!gu.disabled && user_id === gu.id) gu.checked = checked
          if(gu.checked) userChecked++
          if(gu.checked && !gu.disabled) userSelectNoDisabled++
        })
        if(userChecked === group.user_group.length) {
          if(!group.disabled) {
            group.indeterminate = false
            group.checked = true
          }
        } else {
          if(userChecked > 0) {
            if(!group.disabled) {
              if(userSelectNoDisabled === 0) {
                group.indeterminate = false
                group.checked = false
              } else {
                group.indeterminate = true
                group.checked = false
              }
            }
          }
          else if(userChecked === 0) {
            if(!group.disabled) {
              group.indeterminate = false
              group.checked = false
            }
          }
        }
      }
      // Считаем общее количество выбранных пользователей
      this.groups.forEach(g => {
        g.user_group.forEach(gu => {
          if(!g.disabled && !gu.disabled && gu.checked) {
            allCheckUser++
            const matchGroup = this.modalCfg.tmpUsers.find(t => t.group_code === g.code)
            if(!matchGroup) {
              this.modalCfg.tmpUsers.push({
                group_id: g.id,
                group_code: g.code,
                user_id: gu.user.id,
                user_email: [gu.user.email]
              })
            } else {
              matchGroup.user_email.push(gu.user.email)
            }
          }
        })
      })
      const baseTitle = this.modalCfg.title.split('|')
      if(allCheckUser != 0) {
        this.modalCfg.title = baseTitle[0] + ' | '+allCheckUser
      } else { this.modalCfg.title = baseTitle[0] }

    },
    async matchWaitAgree() {
      this.groups.forEach((g, g_i) => {
        let userCount = 0
        g.user_group.forEach(gu => {
          // const matchUser = this.waitGroups[g_i]?.ks2_users.find(u => u.email === gu.user.email)
          let matchUser
          this.waitAndFutureGroups.forEach(wg => {
            if(g.code === wg.code) {
              const match = wg.ks2_users.find(u => u.email === gu.user.email)
              matchUser = match
            }
          })
          if(matchUser) {
            userCount++
            gu.checked = true
            gu.disabled = true
          }
        })
        if(g.user_group.length === userCount) {
          g.checked = true
          g.disabled = true
        }
      })
    }
  },
  async mounted() {
    await this.fetchGroup()
    this.modalCfg.showOKExtra = true
    // for(let i of this.modalCfg.waitAgree) {
    //   if(i.ks2_groups) this.waitGroups.push(i.ks2_groups)
    // }
    this.waitAndFutureGroups = this.modalCfg.waitAndFutureAgree
    // this.waitGroups = this.modalCfg.waitAgree[0]?.ks2_groups
    this.groups = this.getGroup
    await this.matchWaitAgree()
  }
}
</script>