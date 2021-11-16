<template lang="pug">
div(
  v-click-away="closeMenu"
  class="relative"
)
  div(
    class="flex duration-100 cursor-pointer h-6"
    @click.prevent="isMenuOpen = !isMenuOpen"
  )
    div.flex
      slot(name="icon")
      svg-down(
        v-if="arrow"
        class="duration-300 w-3"
        :class="{'rotate-180': isMenuOpen}"
      )
  transition(
    enter-active-class="transition ease-out duration-100"
    enter-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-75"
    leave-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  )
    div(
      v-if="isMenuOpen"
      :class="{'-mt-6 ml-5': listAlign === 'right', 'lg:mt-0 lg:right-0': listAlign === 'left', 'mt-0': listAlign === 'bottom'}, listWidthClass"
      class="text-gray-500 origin-top-right absolute border border-gray-400 rounded-sm shadow-lg text-sm overflow-hidden z-20"
    )
      div(
        class="rounded-md bg-white shadow-xs"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      )
        div
          div(class="bg-gray-100")
            div(
              class="w-full font-medium"
              @click="isMenuOpen = !isMenuOpen"
            )
              slot(name="items")
</template>
<script>
export default {
  name: 'ctx-menu',
  props: ['text', 'listAlign', 'listWidthClass', 'arrow'],
  data() {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    closeMenu() {
      this.isMenuOpen = false;
    }
  }
}
</script>