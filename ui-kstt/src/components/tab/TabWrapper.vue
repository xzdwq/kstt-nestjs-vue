<template lang="pug">
div(class="h-full")
  ul(class="flex justify-between bg-background-primary text-gray-500")
    li(
      class="flex text-center items-center w-full select-none cursor-pointer justify-center rounded-t-md p-1 ml-2 mr-2"
      v-for="title in tabTitles"
      :key="title"
      :class="{ 'text-copy-primary bg-background-secondary': title == selectedTitle }"
      @click="selectedTitle = title"
    )
      span.leading-none.p-2(v-html="title")
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