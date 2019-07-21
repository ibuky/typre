<template>
  <h2 class="title">
    <span class="has-text-grey-dark">{{ sentenceMatched }}</span>
    <span class="has-text-grey-lighter">{{ sentenceRm }}</span>
  </h2>
</template>

<script>
export default {
  name: 'SentenceRm',
  props: ['sentenceRm', 'sentenceMatched']
}
</script>
