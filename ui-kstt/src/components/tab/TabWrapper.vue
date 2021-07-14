<template lang="pug">
div
  ul(class="flex justify-between bg-background-primary text-gray-500")
    li(
      class="flex w-full select-none cursor-pointer justify-center rounded-t-md p-1 mr-2"
      v-for="title in tabTitles"
      :key="title"
      :class="{ 'text-copy-primary bg-background-secondary': title == selectedTitle }"
      @click="selectedTitle = title"
    ) {{ title }}
  slot
</template>
<script>
import { ref, provide } from 'vue';
export default {
  name: 'tab-warapper',
  setup(props, { slots }) {
    const tabTitles = ref(slots.default().map((tab) => tab.props.title))
    const selectedTitle = ref(tabTitles.value[0])
    provide("selectedTitle", selectedTitle)
    return {
      selectedTitle,
      tabTitles
    }
  }
}
</script>