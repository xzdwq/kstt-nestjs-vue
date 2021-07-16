<template lang="pug">
div.text-4xl
  p {{ $t('welcome', { user: 'guest' }) }}
</template>

<script>
export default {
  name: 'index'
}
</script>