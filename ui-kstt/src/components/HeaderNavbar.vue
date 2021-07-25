<template lang="pug">
nav(class="sticky top-0 z-10 md:container md:mx-auto flex justify-between p-3 border-2 border-transparent rounded-lg bg-background-secondary")
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
    cog-settings
    bell-notification
    theme-switcher
    locales-switcher
</template>

<script>
export default {
  name: 'header-navbar'
}
</script>