<template>
  <div class="typing-test">
    <section class="hero is-fullheight-with-navbar">
      <div class="hero-body">
        <div ref="count" class="container">
          <h1 class="title is-1">{{ countDown }}</h1>
        </div>
        <div ref="sentence" class="container">
          <DispJp :sentenceJp="sentenceJp"></DispJp>
          <br>
          <DispRm :sentenceRmDisp="sentenceRmDisp" :sentenceMt="sentenceMt"></DispRm>
          <input v-focus ref="input" type="text" @blur="setFocus" @keydown="onKeydown">
        </div>
      </div>
    </section>
    <CurrentStatus :countTyped="countTyped" :countMiss="countMiss"></CurrentStatus>
  </div>
</template>

<script>
import DispJp from '@/components/DispJp.vue'
import DispRm from '@/components/DispRm.vue'
import CurrentStatus from '@/components/CurrentStatus.vue'

import dict from '../../lib/wordList.json'

export default {
  name: 'Type',
  components: {
    'DispJp': DispJp,
    'DispRm': DispRm,
    'CurrentStatus': CurrentStatus
  },
  data () {
    return {
      dictionary: [],     // 単語辞書
      sentenceJp: '',     // 表示する日本語
      sentenceRm: [],     // 入力可能なローマ字全件
      sentenceRmDisp: '', // 表示するローマ字
      sentenceMt: '',     // 一致したキャラクタ

      countDown: 3,       // 開始までのカウントダウン

      timeStart: null,    // 開始時間
      timeEnd: null,      // 終了時間
      countTyped: 0,      // タイプ数(ミスは除く)
      countMiss: 0,       // ミス数
      countComp: 0,       // 完了数
      countGreat: 0,      // ミスなし完了数

      keyMiss: {}         // ミスしたキーの情報
    }
  },
  methods: {
    /**
     * 初期化の処理
     */
    initSentence: function () {
      this.setRandomSentence()
      this.$refs.input.focus()
    },

    /**
     * キー押下時の処理
     */
    onKeydown: function (e) {
      if (this.isModKeys(e.key)) return // 修飾キーは無視
      if (e.repeat) return              // キーリピート状態は無視

      // 正誤判定
      if (this.compareCharNext(e.key)) {
        // 正しい
        this.onCorrect()
      } else {
        // 間違い
        this.onMismatch()
      }
    },

    /**
     * 修飾キーかどうか判定します
     * @param {String} xKey キー
     * @returns {boolean} 修飾キーの場合、true
     */
    isModKeys: function (xKey) {
      console.log('typed: ' + xKey)
      const modKeys = [
        'Tab', 'Shift', 'Control', 'Escape',
        'Meta', 'Alt', 'KanjiMode',
        'ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight',
        'Enter', 'Backspace'
      ]
      return modKeys.includes(xKey)
    },

    /**
     * @param {event} xKey キー入力イベント
     * @returns {boolean} いずれかの候補に当てはまらる場合、ture
     */
    compareCharNext: function (xKey) {
      // どのcharNextにも当てはまらない場合
      if (!this.sentenceRm.some(s => s.charNext === xKey)) return false
      // 配列ごとに処理。当てはまらないものを削除
      this.sentenceRm = this.sentenceRm.filter(s => s.charNext === xKey)
      return true
    },

    /**
     * ランダムな文を画面上にセットします
     */
    setRandomSentence: function () {
      const dict = this.dictionary
      const sentenceRandom = dict[Math.floor(Math.random() * Math.floor(dict.length))]
      const sentenceRmWithNextKey = sentenceRandom.sentenceRm.map((s) => {
        // charNextを追加してそのまま返す
        const charFirst = this.getFirstChar(s)
        return {
          romaji: s,
          charNext: charFirst
        }
      })

      this.sentenceJp = sentenceRandom.sentenceJp
      this.sentenceRm = sentenceRmWithNextKey
      this.sentenceRmDisp = this.sentenceRm[0].romaji
    },

    /**
     * input要素にフォーカスをセットします
     * @param {object} e 要素
     */
    setFocus: function (e) {
      e.target.focus()
    },

    /**
     * 入力ミス時の処理
     */
    onMismatch: function () {
      this.countMiss++
    },

    /**
     * 入力正解時の処理
     */
    onCorrect: function () {
      this.countTyped++

      // 正解した文字を削る
      this.sentenceRm = this.sentenceRm.map(s => {
        return {
          romaji: s.romaji.slice(1),
          charNext: s.charNext
        }
      })

      // すべて入力し終えているか判定
      if (this.sentenceRm.some(s => s.romaji === '')) {
        // 完了している場合
        this.completeSentence()
      } else {
        // 残っている場合
        this.sentenceRmDisp = this.sentenceRm[0].romaji
        this.sentenceMt += this.sentenceRm[0].charNext
        this.sentenceRm.forEach(s => {
          return (s.charNext = this.getFirstChar(s.romaji))
        })
      }
    },

    /**
     * 候補文章の、残りの中から最初の文字を取得します
     * @param {String} xSentence 文章
     */
    getFirstChar: function (xSentence) {
      if (xSentence == null) return console.log('no sentence given')
      return xSentence.slice(0, 1)
    },

    /**
     * 文章の最後の文字の入力が完了したときの処理
     */
    completeSentence: function () {
      this.clearDisplay()
      this.setRandomSentence()
    },

    clearDisplay: function () {
      this.sentenceMt = ''
    },

    startCountDown: function () {
      let timer = setInterval(() => {
        this.countDown--
        if (this.countDown === 0) {
          this.$refs.count.classList.add('display-none')
          this.$refs.sentence.classList.remove('display-none')
          this.initSentence()
          clearInterval(timer)
        }
      }, 1000)
    }
  },
  mounted () {
    this.dictionary = dict.dictionary
    // 辞書内からランダムに選択
    this.$refs.sentence.classList.add('display-none')
    this.startCountDown()
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus() // フォーカスが外れないようにする
      }
    }
  }
}
</script>

<style scoped>
/* キー入力を受け取るためのインプットを見えない、触れないようにする */
input {
  opacity: 0;
  pointer-events: none;
}

.display-none {
  display: none;
}
</style>
