<template>
  <h2 class="title">
    <span class="has-text-grey-dark">{{ sentenceMt }}</span>
    <span class="has-text-grey-lighter">{{ sentenceRmDisp }}</span>
  </h2>
</template>

<script>
export default {
  name: 'SentenceRm',
  props: ['sentenceRmDisp', 'sentenceMt']
}
</script>
