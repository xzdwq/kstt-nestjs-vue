<template lang="pug">
div(class="")
  ul(
    class="flex bg-background-primary text-gray-500 overflow-auto"
    :class="tabflex ? 'justify-between' : ''"
  )
    li(
      class="text-center flex items-center justify-center select-none cursor-pointer rounded-t-md p-1 duration-200"
      v-for="item in tabs"
      :key="item"
      :class="item.code == selectedTitle ? 'text-copy-primary bg-background-secondary':'mt-1', tabflex ? 'w-full ml-2 mr-2':'ml-1', selectednoactivtab && item.code != selectedTitle ? 'bg-background-tertiary':''"
      @click="select(item.code)"
    )
      div.flex.items-center
        span.leading-none.p-2(v-html="$t(item.title)")
        span(v-if="item.countTitleModule" class="pr-1") ({{ getCount(item.countTitleModule) }})
  slot
</template>
<script>
export default {
  name: 'tab-warapper',
  props: ['tabflex', 'selectednoactivtab', 'uniqstate'],
  data() {
    return {
      tabs: [],
      selectedTitle: null
    }
  },
  async mounted() {
    const tabs = this.$slots.default().map((tab) => {
      return {
        title: tab.props.title,
        code: tab.props.code,
        countTitleModule: tab.props.countTitleModule
      }
    })
    this.tabs = tabs
    const selectIndex = this.$slots.default().map((tab) => tab.props.selected).findIndex((i) => i === true)
    this.select(this.tabs[selectIndex != -1 ? selectIndex : 0].code)
  },
  methods: {
    select(tab) {
      this.selectedTitle = tab
      const uniqstate = this.uniqstate
      this.$store.commit(`tabModule/settab_${uniqstate}`, tab)
    },
    getCount(module) {
      return this.$store.getters[`${module}`]
    }
  }
}
</script>