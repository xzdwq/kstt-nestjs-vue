<template>
  <div class="content-wrapper text-copy-primary flex bg-background-primary justify-center items-center h-screen" :class="theme">
    <div class="text-4xl">
      Hello 👋🏼
      <div>
        <h1>&copy;nestjs-vuejs-tailwindcss</h1>
        <input type="radio"><div></div>
        <input
          type="checkbox"
          @change="toggleTheme($event)"
        ><span class="text-xl p-1.5">Change theme</span>
        <div></div>
        <input type="text" class="text-red-500"><div><br></div>
        <textarea name="comment" cols="40" rows="3" class="text-red-500"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'theme-light'
    }
  },
  methods: {
    toggleTheme: function(e) {
      this.theme = this.theme === 'theme-light' ? 'theme-dark' : 'theme-light'
    }
  }
}
</script>

<style>
</style>
