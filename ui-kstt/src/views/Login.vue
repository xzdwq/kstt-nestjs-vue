<template lang="pug">
div(class="relative flex h-[calc(100vh-150px)] w-full")
  div(class="flex w-full items-center justify-center")
    div(class="relative max-w-md w-full")
      h2(class="mt-6 text-center text-3xl font-extrabold") {{ $t('authorization') }}
      span(
        v-if="errorAuthData"
        class="absolute w-full flex justify-center items-center text-red-500"
      ) {{ $t('error-auth-data') }}
      form(
        @submit.prevent
        class="mt-8 space-y-6"
      )
        div(class="rounded-md shadow-sm -space-y-px")
          div
            label(for="username" class="sr-only") Login
            input(v-model="username" id="username" name="username" type="username" autocomplete="current-login" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Login")
          div
            label(for="password" class="sr-only") Password
            input(v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password")
        button(@click="submit" type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500") {{ $t('login') }}
</template>
<script>
import axios from 'axios'
export default {
  name: 'login',
  data() {
    return {
      username: null,
      password: null,
      errorAuthData: null
    }
  },
  methods: {
    async submit() {
      const jump = this.$route.query.jump
      const data = await axios.post('login', {
        username: this.username,
        password: this.password,
        jump: jump
      })
      if(data?.data.isAuth) {
        this.errorAuthData = null
        this.$store.commit('authModule/setAuth', data.data.isAuth)
        this.$store.commit('authModule/setUser', data.data.user)
        const jumpPath = jump ? jump : '/'
        this.$router.push(jumpPath)
      } else {
        this.errorAuthData = 1
        this.$store.commit('authModule/setAuth', false)
        this.$store.commit('authModule/setUser', {})
      }
    }
  }
}
</script>