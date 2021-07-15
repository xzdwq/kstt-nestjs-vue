<template lang="pug">
div.text-4xl
  p {{ $t('welcome', { user: 'guest' }) }}
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'index'
}
</script>