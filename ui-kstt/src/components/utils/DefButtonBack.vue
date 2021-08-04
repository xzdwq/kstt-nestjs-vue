<template lang="pug">
def-button(
  class="text-white bg-[#579bae] flex justify-between"
  @click="$router.go(-1)"
)
  svg-left
  span(class="pr-2") {{ $t('back') }}
</template>
<script>
export default {
  name: 'def-button-back'
}
</script>