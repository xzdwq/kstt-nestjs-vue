<template lang="pug">
div(class="h-full rounded-md bg-background-secondary")
  tab-wrapper
    tab(title="Электронная подпись") Tab 1
    tab(title="Список доступных ЭП") Tab 2
</template>
<script>
import TabWrapper from '@/components/tab/TabWrapper.vue'
import Tab from '@/components/tab/Tab.vue'
export default {
  name: 'tabs-panel',
  components: { TabWrapper, Tab }
}
</script>