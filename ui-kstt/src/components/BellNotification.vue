<template>
  <a
    href="#"
    class="flex text-copy-primary hover:text-copy-hover mr-2"
  >
    <svg
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
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
      </path>
    </svg>
    <span
      class="-ml-0.5 align-text-top text-base tracking-tighter font-bold"
      :class="{ 'text-red-500' : getNotification > 0 }"
    >
      <sup>{{ getNotification }}</sup>
    </span>
  </a>
</template>
<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'bell-notification',
  computed: {
    ...mapGetters({
      getNotification: 'bellNotification/getNotification'
    })
  },
}
</script>