<template>
  <div ref="typeRoot">
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
    <CurrentStatus
      :countTyped="countTyped"
      :countMiss="countMiss"
      :countComp="countComp"
      :countStartSentence="countStartSentence"
      :countLastSentence="countLastSentence"
    ></CurrentStatus>
  </div>
</template>

<script>
import DispJp         from '@/components/DispJp.vue'
import DispRm         from '@/components/DispRm.vue'
import CurrentStatus  from '@/components/CurrentStatus.vue'

import dict from '../../lib/wordList.json'

const moment  = require('moment')
const _       = require('lodash')
const C       = require('../../lib/typreConst')

let timer = null

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

      timeStart: null,        // 開始時間
      timeEnd: null,          // 終了時間
      countStartSentence: 0,  // 開始時のセンテンス数
      countLastSentence: 0,   // 残りのセンテンス数
      countTyped: 0,          // タイプ数(ミスは除く)
      countMiss: 0,           // ミス数
      countComp: 0,           // 完了数
      countGreat: 0,          // ミスなし完了数

      keyMiss: {}             // ミスしたキーの情報
    }
  },
  methods: {
    /**
     * 初期化の処理
     */
    initSentence: function () {
      const mode = this.$router.params.gameMode
      if (mode === C.GAMEMODE_RANDOM) {
        // ランダム単語
        _.shuffle(this.dictionary)
      }

      this.countStartSentence = this.dictionary.length
      this.countLastSentence = this.countStartSentence

      this.setSentence()
      this.$refs.input.focus()
      this.timeStart = moment.now()

      clearInterval(timer)
    },

    /**
     * キー押下時の処理
     */
    onKeydown: function (e) {
      if (e.key === 'Escape') this.onKeydownEscape()

      if (this.isModKeys(e.key)) return // 修飾キーは無視
      if (e.repeat) return              // キーリピート状態は無視

      // 正誤判定
      this.compareCharNext(e.key) ? this.onCorrect() : this.onMismatch()
    },

    /**
     * 修飾キーかどうか判定
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
     * @returns {boolean} いずれかの候補に当てはまる場合、true
     */
    compareCharNext: function (xKey) {
      // どのcharNextにも当てはまらない場合
      if (!this.sentenceRm.some(s => s.charNext === xKey)) return false
      // 配列ごとに処理。当てはまらないものを削除
      this.sentenceRm = this.sentenceRm.filter(s => s.charNext === xKey)
      return true
    },

    /**
     * 文を画面上にセット
     */
    setSentence: function () {
      const sentence = this.dictionary[0]
      const sentenceRmWithNextKey = sentence.sentenceRm.map((s) => {
        // charNextを追加してそのまま返す
        const charFirst = this.getFirstChar(s)
        return {
          romaji: s,
          charNext: charFirst
        }
      })

      this.sentenceJp = sentence.sentenceJp
      this.sentenceRm = sentenceRmWithNextKey
      this.sentenceRmDisp = this.sentenceRm[0].romaji
    },

    /**
     * input要素にフォーカスをセット
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
      this.setBackgroundFlash()
    },

    /**
     * 背景色をフラッシュ
     * 色はこのファイルのCSSのblinkBackgroundを編集
     */
    setBackgroundFlash: function () {
      this.$refs.typeRoot.classList.add('blink')
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
     * 候補文章の、残りの中から最初の文字を取得
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
      this.countComp++
      this.countLastSentence--

      this.dictionary.shift() // 辞書から完了した文章を削除
      this.clearDisplay()     // 画面から完了した文書を削除

      // 文章の残りが0となった時終了
      if (this.dictionary.length === 0) {
        this.completeGame(true)
      } else {
        // 続行。次の文章をセット
        this.setSentence()
      }
    },

    /**
     * 終了処理
     * @param {boolean} xCompF trueの場合完了、falseの場合途中終了
     */
    completeGame: function (xCompF) {
      this.timeEnd = moment.now()

      const params = {
        timeSpent: this.timeEnd - this.timeStart, // 経過時間
        countTyped: this.countTyped,  // タイプ数(ミスは除く)
        countMiss: this.countMiss,    // ミス数
        countComp: this.countComp,    // 完了数
        countGreat: this.countGreat,  // ミスなし完了数
        keyMiss: null                 // ミスしたキーの情報
      }

      // 結果ポップアップを表示
      this.$router.push({name: 'Result', params: params})
    },

    /**
     * タイピング部分の表示内容をクリア
     */
    clearDisplay: function () {
      this.sentenceMt = ''
    },

    /**
     * カウントダウンをスタート
     */
    startCountDown: function () {
      timer = setInterval(() => {
        this.countDown--
        if (this.countDown === 0) {
          this.$refs.count.classList.add('display-none')
          this.$refs.sentence.classList.remove('display-none')
          this.initSentence()
        }
      }, 1000)
    },

    /**
     * 終了画面へ遷移
     */
    onKeydownEscape: function () {
      this.completeGame(false)
    }
  },
  mounted () {
    this.dictionary = dict.dictionary.slice()
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.blink {
  animation: blinkBackground 300ms
}

@keyframes blinkBackground {
  0% { background: #FFFFFF }
  5% { background: #fde991 }
  30% { background: #fff9e0 }
  100% { background: #FFFFFF }
}
</style>
