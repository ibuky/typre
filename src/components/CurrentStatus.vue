<template>
  <nav class="navbar is-transparent is-fixed-bottom">
    <p>タイプ数: {{ countTyped }}</p>
    <p>ミス数: {{ countMiss }}</p>
    <p>完了数: {{ countComp }}</p>
  </nav>
</template>

<script>
export default {
  name: 'CurrentStatus',
  props: ['countTyped', 'countMiss', 'countComp']
}
</script>
