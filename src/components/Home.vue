<template>
  <div class="home">
    <section class="hero is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">
            typre
          </h1>
          <h2 class="subtitle">keyboard typing demonstration</h2>
          <br>
          <button class="button is-info" @click="$router.push({name: 'Type', params: {gameMode: '1'}})">
            Start
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
h1 {
  font-size: 2em;
}
</style>
