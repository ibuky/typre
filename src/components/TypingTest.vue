<template>
  <div class="typing-test">
    <section class="hero is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="container">
          <DispJp :sentenceJp="sentenceJp"></DispJp>
          <br>
          <DispRm :sentenceRm="sentenceRm" :sentenceMatched="sentenceMatched"></DispRm>
          <br>
          <input v-focus type="text" @blur="setFocus" @keydown="onKeydown">
          <br>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import DispJp from '@/components/DispJp.vue'
import DispRm from '@/components/DispRm.vue'

export default {
  name: 'TypingTest',
  components: {
    'DispJp': DispJp,
    'DispRm': DispRm
  },
  data () {
    return {
      dictionary: [
        {
          sentenceJp: '天使',
          sentenceRm: [
            'tensi', 'tenshi', 'tennsi', 'tennshi'
          ]
        }
        // {
        //   sentenceJp: 'こんにちは',
        //   sentenceRm: 'konnnichiha'
        // },
        // {
        //   sentenceJp: '日本語入力',
        //   sentenceRm: 'nihonngonyuuryoku'
        // },
        // {
        //   sentenceJp: '自作キーボード',
        //   sentenceRm: 'jisakuki-bo-do'
        // },
        // {
        //   sentenceJp: 'メカニカルスイッチ',
        //   sentenceRm: 'mekanikarusuitti'
        // },
        // {
        //   sentenceJp: '遊舎工房',
        //   sentenceRm: 'yuushakoubou'
        // },
        // {
        //   sentenceJp: 'はんだこて',
        //   sentenceRm: 'hanndakote'
        // },
        // {
        //   sentenceJp: '沼に向かって一直線',
        //   sentenceRm: 'numanimukatteicchokusenn'
        // }
      ],
      sentenceJp: '',
      sentenceRm: '',
      sentenceRmAll: [],
      sentenceMatched: '',
      charNext: '',
      charNextAll: [],
      sentenceIndex: 0,
      countTyped: 0,
      countMiss: 0
    }
  },
  methods: {
    // inputにフォーカスをセット
    setFocus: function (e) {
      e.target.focus()
    },

    // キー入力時の処理
    onKeydown: function (e) {
      // 正誤判定
      if (this.compareCharNext(e.key)) {
        this.pushCharNext()
      } else {
        this.onMismatch()
      }
    },

    onMismatch: function () {
      console.log('miss')
    },

    // 次の文字と比較
    compareCharNext: function (xKey) {
      if (xKey === this.charNextAll[this.sentenceIndex]) return true
      return false
    },

    // 次の文字をセット
    pushCharNext: function () {
      const waiting = this.sentenceRm.slice(1)
      if (waiting === '') {
        this.completeSentence()
      } else {
        this.sentenceRm = this.sentenceRm.slice(1)
        this.sentenceMatched += this.charNext
        this.charNext = this.getFirstChar(this.sentenceRm)
      }
    },

    // 最初の文字を取得
    getFirstChar: function (xSentence) {
      if (xSentence == null) return console.log('no sentence given')
      return xSentence.slice(0, 1)
    },

    // 完了時の処理
    completeSentence: function () {
      this.clearDisplay()
      this.setRandomSentence()
    },

    // ランダムな文をセット
    setRandomSentence: function () {
      console.log('exec setRandomSentence')
      const dict = this.dictionary
      const sentence = dict[Math.floor(Math.random() * Math.floor(dict.length))]
      this.sentenceJp = sentence.sentenceJp
      this.sentenceRmAll = sentence.sentenceRm
      this.sentenceRm = sentence.sentenceRm[0]
      this.sentenceIndex = 0

      this.charNextAll = this.sentenceRmAll.map(s => this.getFirstChar(s))

      this.charNext = this.getFirstChar(this.sentenceRmAll[this.sentenceIndex])
    },

    clearDisplay: function () {
      this.sentenceMatched = ''
    }
  },
  mounted () {
    this.setRandomSentence()
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>

<style scoped>
input {
  opacity: 0;
}
</style>
