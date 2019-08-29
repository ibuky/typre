<template>
  <nav class="navbar is-transparent is-fixed-bottom">
    <p>タイプ数: {{ countTyped }} </p>&nbsp;
    <p>ミス数: {{ countMiss }} </p>&nbsp;
    <p>完了数: {{ countComp }} </p>&nbsp;
    <p>残数: {{ countLastSentence }} </p>&nbsp;
    <p>総数: {{ countStartSentence }} </p>&nbsp;
  </nav>
</template>

<script>
export default {
  name: 'CurrentStatus',
  props: [
    'countTyped',
    'countMiss',
    'countComp',
    'countStartSentence',
    'countLastSentence'
  ]
}
</script>
