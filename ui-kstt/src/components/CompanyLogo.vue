<template lang="pug">
div(
  class="flex text-copy-primary hover:text-copy-hover min-w-[100px] mr-10 cursor-pointer select-none"
  @click="$router.push('/')"
)
  svg-logo
  div.font-bold.ml-2.text-xs.leading-none
    p {{ $t('logo-1') }}
    p {{ $t('logo-2') }}
</template>
<script>
export default {
  name: 'logo'
}
</script>