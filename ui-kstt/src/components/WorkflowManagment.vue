<template lang="pug">
div(
  class="pr-2 flex text-copy-primary hover:text-copy-hover cursor-pointer"
  @click="$router.push('/workflowmanagment/')"
)
  svg-usersgroup(v-ttip="$t('workflow-managment')")
</template>
<script>
export default {
  name: 'workflow-managment'
}
</script>