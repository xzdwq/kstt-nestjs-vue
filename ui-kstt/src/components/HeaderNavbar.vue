<template lang="pug">
nav(class="md:container md:mx-auto flex justify-between p-3 border-2 border-transparent rounded-lg bg-background-secondary")
  ul.flex
    logo.mr-6
    li.mr-4(v-for="link in links" :key="link")
      router-link(
        class="text-copy-primary hover:text-copy-hover select-none font-bold"
        :to="link.href"
      ) {{link.title}}
  div.flex.w-auto
    cog-settings
    bell-notification
    theme-switcher
</template>

<script>
import CogSettings from './CogSettings.vue'
export default {
  components: { CogSettings },
  name: 'header-navbar',
  data: () => ({
    theme: '',
    links: [
      {
        title: 'Home',
        href: '/'
      },
      {
        title: 'About',
        href: '/about'
      }
    ]
  })
}
</script>