<template>
  <div id="app">
    <NavBar></NavBar>
    <transition mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: { NavBar }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Kosugi+Maru|Noto+Sans+JP&display=swap');

#app {
  font-family: 'Kosugi Maru', 'Noto Sans JP', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}
.v-enter, .v-leave-to {
  opacity: 0;
}
</style>
