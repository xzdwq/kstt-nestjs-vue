<template>
<div>
  <nav>
    <div class="p-2">
      <ul class="flex">
        <li class="mr-6" v-for="link in links" :key="link">
          <router-link class="text-blue-500 hover:text-blue-800" :to="link.href">
            {{link.title}}
          </router-link>
        </li>
      <theme-switcher :theme="theme" @themeChanged="updateTheme" />
      </ul>
    </div>
  </nav>
</div>
</template>

<script>
export default {
  name: 'header-navbar',
  data: () => ({
    theme: '',
    links: [
      {
        title: 'Home',
        href: '/'
      },
      {
        title: 'About',
        href: '/about'
      }
    ]
  })
}
</script>