<template>
  <nav class="navbar is-transparent is-fixed-bottom">
    <p>タイプ数: {{ countTyped }}</p>
    <p>ミス数: {{ countMiss }}</p>
  </nav>
</template>

<script>
export default {
  name: 'CurrentStatus',
  props: ['countTyped', 'countMiss']
}
</script>
