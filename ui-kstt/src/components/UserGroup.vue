<template lang="pug">
div(
  class="flex text-copy-primary hover:text-copy-hover cursor-pointer"
  @click="$router.push('/usergroup/')"
)
  svg-usersgroup
</template>
<script>
export default {
  name: 'user-group'
}
</script>