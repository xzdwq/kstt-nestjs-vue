<template lang="pug">
nav(class="z-10 md:mx-auto flex justify-between p-3 border-2 border-transparent rounded-lg bg-background-secondary")
  ul.flex
    logo
    //- li.flex
    //-   div(class="w-header-link")
    //-     router-link(
    //-       class="text-copy-primary hover:text-copy-hover select-none font-bold mr-4"
    //-       :to="'/'"
    //-     ) {{ $t('register-nav') }}
    //-   div(class="w-header-link")
    //-     router-link(
    //-       class="text-copy-primary hover:text-copy-hover select-none font-bold mr-4"
    //-       :to="'/about'"
    //-     ) {{ $t('about-nav') }}
  div.flex.w-auto
    div(
      v-if="$store.getters['authModule/getAuth']"
      class="flex w-auto"
    )
      div(v-if="workflowManagment")
        workflow-managment
      cog-settings
      bell-notification
    theme-switcher
    locales-switcher
    logout
</template>

<script>
import {
  mapGetters
} from 'vuex'
import matchRoles from '@/mixins/matchRoles'
export default {
  name: 'header-navbar',
  mixins: [matchRoles],
  data() {
    return {
      workflowManagment: false
    }
  },
  computed: {
    ...mapGetters({
      getAuth: 'authModule/getAuth'
    })
  },
  async mounted() {
    if(this.$store.getters['authModule/getAuth']) {
      await this.matchRole('workflowManagment')
    }
  },
  watch: {
    getAuth(val) {
      if(val) {
        if(this.$store.getters['authModule/getAuth']) {
          setTimeout(() => { this.matchRole('workflowManagment') }, 0)
        }
      }
    }
  }
}
</script>