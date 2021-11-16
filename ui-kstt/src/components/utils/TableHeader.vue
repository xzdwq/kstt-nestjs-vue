<template lang="pug">
th(
  v-for="(head, h_idx) in headers"
  class="relative px-1 border border-border-color-primary select-none h-full"
  :class="{'min-w-[150px]': head.search}"
)
  div(
    v-if="!head.type"
    class="flex items-center justify-center h-full"
  )
    div(
      :class="{ 'flex-1': head.sorted, '-mt-4': head.search }"
    ) {{ head.title ? $t(`${head.title}`) : null }}
    div(
      v-if="head.sorted"
      class="flex-0 cursor-pointer pl-1"
      :class="{'text-gray-300': sortIndex != head.sorted, '-mt-4': head.search}"
      @click="setSorted(head, head.sorted)"
    )
      svg-sort-asc(v-if="head.asc")
      svg-sort-desc(v-else)
  input(
    v-if="head.type === 'checkbox'"
    type="checkbox"
    ref="checked_header"
    class="cursor-pointer"
    @change="chancgeCheckbox($event, item)"
  )
  div(
    v-if="head.type === 'truncate'"
    class="cursor-pointer flex justify-center"
    @click="showHideText"
  )
    svg-plus(v-if="truncate")
    svg-minus(v-else)
  div(v-if="head.search" class="w-full h-7 flex absolute bottom-0 p-0 pr-2")
    input(
      type="search"
      class="rounded-sm"
      @input="updateSearch($event, head.search)"
    )
</template>
<script>
export default {
  name: 'table-header',
  props: ['headers', 'store'],
  data() {
    return {
      delay: 800,
      truncate: true,
      sortIndex: null
    }
  },
  methods: {
    chancgeCheckbox(e, item) {
      const checked = e.target.checked
      this.store.forEach(i => {
        i.checked = checked
      })
    },
    showHideText() {
      this.truncate = !this.truncate
      this.store.forEach(i => {
        if(this.truncate) {
          i.truncate = true
        } else {
          i.truncate = false
        }
      })
    },
    setSorted(head, idx) {
      this.sortIndex = idx
      // this.store.sort((a, b) => {
      //   if(head.asc) {
      //     if(head.data) return new Date(a[idx]) - new Date(b[idx])
      //     return a[idx] > b[idx] ? 1 : -1
      //   } else {
      //     if(head.data) return new Date(a[idx]) + new Date(b[idx])
      //     return a[idx] < b[idx] ? 1 : -1
      //   }
      // })
      head.asc = !head.asc
      this.$emit('update:setSorted', head, idx)
    },
    updateSearch(event, index) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit('update:searchQuery', event.target.value, index)
      }, +this.delay);
    }
  },
  async mounted() {
    this.timer;
  }
}
</script>