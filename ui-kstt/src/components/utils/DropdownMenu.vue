<template lang="pug">
div(
  class="relative"
  v-click-away="closeMenu"
)
  def-button(
    class="text-white bg-[#06d6a0] flex justify-between pl-[10px] py-[2px] active:bg-[#05b285] focus:outline-none focus:ring-2 focus:ring-[#05b285]"
    @click="isMenuOpen = !isMenuOpen"
  )
    slot(name="icon")
    span(class="pr-2" :class="textClass") {{ text }}
    svg-down(
      class="duration-300"
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
      :class="{'right-0': listAligh == 'right', 'left-0': listAligh == 'left'}, listWidthClass"
      class="origin-top-right absolute mt-1 rounded-sm shadow-lg text-sm overflow-hidden z-20"
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
  name: 'dropdown-menu',
  props: ['text', 'listAligh', 'listWidthClass', 'textClass'],
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