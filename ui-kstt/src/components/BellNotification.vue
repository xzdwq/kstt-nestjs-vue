<template lang="pug">
Popover(v-slot="{ open }")
  PopoverButton(
    :class="open ? 'text-opacity-90' : ''"
    class="flex text-copy-primary hover:text-copy-hover mr-2"
    @click="readNotification"
  )
    svg(
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="origin-top"
      :class="{ 'animate-swing text-red-500' : getNotification > 0}"
    )
      path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9")
    span(class="-ml-0.5 align-text-top text-base tracking-tighter font-bold select-none" :class="{ 'text-red-500' : getNotification > 0 }")
      sup {{ getNotification }}
  PopoverOverlay.bg-black(
    :class='open ? "opacity-50 fixed inset-0" : "opacity-0"'
  )
  transition(name="pop")
  PopoverPanel(
    class="absolute z-10 rounded-md pop-area overflow-auto w-10/12 sm:w-96 top-16 right-5 text-copy-primary bg-background-secondary"
  )
    div(class="relative grid gap-8 p-7 lg:grid-cols-2 text-right break-words")
      div 123
      div 456
      div 7891011213141516 sfsdhfj hjshdf hsdkfjhk jsdf
      div Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus tenetur nihil provident! Laboriosam rerum sint harum magnam itaque accusantium quia aspernatur error corrupti vitae, est adipisci quas sunt excepturi repellat. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit accusantium inventore possimus animi aliquid corporis quod, commodi maxime? Provident harum error unde dignissimos distinctio nostrum veniam inventore, reprehenderit quis esse?
</template>
<script>
import {
  mapGetters,
  mapMutations
} from 'vuex'
export default {
  name: 'bell-notification',
  computed: {
    ...mapGetters({
      getNotification: 'bellNotificationModule/getNotification'
    })
  },
  methods: {
    ...mapMutations({
      readNotification: 'bellNotificationModule/readNotification'
    })
  }
}
</script>