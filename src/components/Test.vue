<template>
  <div>
    <section class="hero is-fullheight-with-navbar">
      <div class="hero-body">
        <div ref="sentence" class="container">
          <pre><code>{{response}}</code></pre>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
const wiki = require('wikijs').default
const query = wiki({apiUrl: 'http://ja.wikipedia.org/w/api.php'})

export default {
  data () {
    return {
      response: 'test'
    }
  },
  methods: {
    sendGetRequest: function () {
      return true
    },
    getWikiIntroSentence () {
      query
        .page('日本語')
        .then(page => page.summary())
        .then(this.getSentenceJSON)
    },
    getSentenceJSON: (xSummary) => {
      return new Promise((resolve, reject) => {
        // 文章の整形
        xSummary = this.formatSentence(xSummary)
        if (xSummary === null) reject(new Error('error in formatting sentence.'))

        // 文ごとに配列化
        let sentences = this.parseSentence(xSummary)
        if (sentences === null) reject(new Error('error in parsing sentence.'))

        // 表示用データの取得
        const sentenceJson = this.convertSentence(sentences)
        if (sentenceJson === null) reject(new Error('error in converting sentence.'))

        resolve(sentenceJson)
      })
    },
    formatSentence: (xSummary) => {
      // かっこの除去
      // const prntRegex = /\(.*\)/g
      // 記号の除去
      return xSummary
    },
    parseSentence: (xSummary) => {
      let sentences = []
      // 句点でパース
      // 読点でパース
      return sentences
    },
    convertSentence: (xSentences) => {
      let sentenceJson
      // 句点の塊ごとに処理

      return sentenceJson
    }
  },
  mounted () {
    this.getWikiIntroSentence()
  }
}
</script>
