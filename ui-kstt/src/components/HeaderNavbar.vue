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
    popper(arrow :hover="true" placement="bottom"
      class="flex pr-2 popper-tips"
      :content="$t('workflow-managment')"
    )
      workflow-managment
    popper(arrow :hover="true" placement="bottom"
      class="flex pr-2 popper-tips"
      :content="$t('configuration')"
    )
      cog-settings
    popper(arrow :hover="true" placement="bottom"
      class="flex pr-2 popper-tips"
      :content="$t('notification')"
    )
      bell-notification
    popper(arrow :hover="true" placement="bottom"
      class="flex pr-2 popper-tips"
      :content="$t('theme-switch')"
    )
      theme-switcher
    popper(arrow :hover="true" placement="bottom"
      class="flex items-center pr-2 popper-tips"
      :content="$t('lang-switch')"
    )
      locales-switcher
</template>

<script>
export default {
  name: 'header-navbar'
}
</script>