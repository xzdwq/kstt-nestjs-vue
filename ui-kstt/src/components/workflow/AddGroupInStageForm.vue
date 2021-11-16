<template lang="pug">
div(class="bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  div(v-if="getGroup.length > 0")
    div(
      v-for="group in getGroup"
      :key="group.id"
      class="p-2 mb-2 border-2 border-gray-400 rounded-md"
    )
      //- группы
      div
        div(class="flex justify-between items-center")
          div {{ this.$i18n.locale == 'ru' ? group.name_ru : group.name_en }}
          div(class="flex items-center")
            //- метки
            div(
              class="text-[10px] text-copy-secondary rounded-3xl bg-green-200"
            )
              div(class="px-1") {{ this.$i18n.locale == 'ru' ? group.side.name_ru : group.side.name_en }}
            //- чекбокс
            div(class="pl-1")
              input(type="checkbox" class="form-checkbox cursor-pointer" :checked="matchGroup(group.id, group.code)" @change="chancgeCheckbox($event, group)")
        //- участники группы
        div(class="flex flex-wrap text-sm text-copy-secondary pt-2")
          div(
            v-for="user in group.user_group"
            :key="`${group.id}_${user.user.id}`"
            class="pb-1 pr-1"
          )
            div(class="bg-gray-200 rounded-3xl px-1") {{ user.user.full_name }}
  //- load mask
  div(
    v-if="getIsLoading"
    class="w-full flex items-center justify-center mt-2"
  )
    svg-loading
    p {{ $t('loading') }}
  div(
    v-if="getGroup.length === 0 && !getIsLoading"
    class="py-2"
  )
    p {{ $t('no-data') }}
</template>
<script>
import {
  mapGetters,
  mapActions
} from "vuex";

export default {
  name: 'add-group-in-stage',
  props: ['modalCfg'],
  async mounted() {
    this.modalCfg.tmpGroupCheck = []
    /*if(this.getGroup.length === 0)*/ await this.fetchGroup()
  },
  methods: {
    ...mapActions({
      fetchGroup: 'groupModule/fetchGroup'
    }),
    matchGroup(id, code) {
      if(this.modalCfg.data.type?.groups) {
        const match = this.modalCfg.data.type.groups.find(i => i.code === code)
        this.modalCfg.tmpGroupCheck.push(
          {
            id: id,
            code: code,
            check: code === match?.code,
            stage_id: this.modalCfg.data.stage.id,
            type_id: this.modalCfg.data.type.id
          }
        )
        return code === match?.code
      } else {
        //- Для конкретного КС-2
        if(this.modalCfg.ks2_id) {
          if(this.modalCfg.data.type?.ks2_groups) {
            const match = this.modalCfg.data.type.ks2_groups.find(i => i.code === code)
            this.modalCfg.tmpGroupCheck.push(
              {
                id: id,
                code: code,
                check: code === match?.code,
                type_id: this.modalCfg.data.type.id
              }
            )
            return code === match?.code
          } else {
            this.modalCfg.tmpGroupCheck.push(
              {
                id: id,
                code: code,
                ks2_id: this.modalCfg.ks2_id,
                check: false,
                type_id: null
              }
            )
            return false
          }
        } else {
          this.modalCfg.tmpGroupCheck.push(
            {
              id: id,
              code: code,
              check: false,
              stage_id: this.modalCfg.data.stage.id,
              type_id: null
            }
          )
          return false
        }
      }
    },
    chancgeCheckbox(e, group) {
      const checked = e.target.checked
      this.modalCfg.tmpGroupCheck.forEach(i => {
        if(i.id === group.id) {
          i.check = checked
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'groupModule/getIsLoading',
      getGroup: 'groupModule/getGroup'
    })
  }
}
</script>