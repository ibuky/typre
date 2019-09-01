<template>
  <h2 class="title">
    <span class="has-text-grey-dark">{{ sentenceMt }}</span>
    <span class="sentence-rm-display">{{ sentenceRmDisp }}</span>
  </h2>
</template>

<script>
export default {
  name: 'SentenceRm',
  props: ['sentenceRmDisp', 'sentenceMt']
}
</script>

<style scoped>
  .sentence-rm-display {
    color: rgba(0,0,0,.25)
  }
</style>
