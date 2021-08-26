<template lang="pug">
div(class="bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  div(class="flex items-center relative h-full")
    div(class="relative h-full pr-4")
      svg-question(class="relative w-full h-full")
    div {{ modalCfg.question }}
</template>
<script>
export default {
  name: 'delete-group-in-stage',
  props: ['modalCfg']
}
</script>