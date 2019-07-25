<template>
  <div class="typing-test">
    <section class="hero is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="container">
          <DispJp :sentenceJp="sentenceJp"></DispJp>
          <br>
          <DispRm :sentenceRmDisp="sentenceRmDisp" :sentenceMt="sentenceMt"></DispRm>
          <input v-focus type="text" @blur="setFocus" @keydown="onKeydown">
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

export default {
  name: 'Type',
  components: {
    'DispJp': DispJp,
    'DispRm': DispRm,
    'CurrentStatus': CurrentStatus
  },
  data () {
    return {
      dictionary: [
        // {
        //   sentenceJp: '天使',
        //   sentenceRm: ['tensi', 'tenshi', 'tennsi', 'tennshi']
        // },
        // {
        //   sentenceJp: '店長',
        //   sentenceRm: ['tentyou', 'tenchou', 'tentixyou', 'tenchixyou', 'tenntyou', 'tennchou', 'tenntixyou', 'tennchixyou']
        // }
        {
          sentenceJp: 'ルブおいしい',
          sentenceRm: [ 'rubuoisii', 'rubuoishii' ]
        },
        {
          sentenceJp: '遊舎工房',
          sentenceRm: [ 'yuusyakoubou', 'yuushakoubou', 'yuusixyakoubou', 'yuushixyakoubou' ]
        },
        {
          sentenceJp: '自作キーボード',
          sentenceRm: [ 'zisakuki-bo-do', 'jisakuki-bo-do' ]
        },
        {
          sentenceJp: '格子配列',
          sentenceRm: [ 'kousihairetu', 'koushihairetu', 'kousihairetsu', 'koushihairetsu' ]
        },
        {
          sentenceJp: 'もげないで',
          sentenceRm: [ 'mogenaide' ]
        },
        {
          sentenceJp: '進捗はどうですか',
          sentenceRm: [
            'sintyokuhadoudesuka',
            'shintyokuhadoudesuka',
            'sinchokuhadoudesuka',
            'shinchokuhadoudesuka',
            'sintixyokuhadoudesuka',
            'shintixyokuhadoudesuka',
            'sinchixyokuhadoudesuka',
            'shinchixyokuhadoudesuka',
            'sinntyokuhadoudesuka',
            'shinntyokuhadoudesuka',
            'sinnchokuhadoudesuka',
            'shinnchokuhadoudesuka',
            'sinntixyokuhadoudesuka',
            'shinntixyokuhadoudesuka',
            'sinnchixyokuhadoudesuka',
            'shinnchixyokuhadoudesuka'
          ]
        },
        {
          sentenceJp: 'キーキャップ',
          sentenceRm: [
            'ki-kyappu',
            'ki-kixyappu',
            'ki-kyaxtupu',
            'ki-kixyaxtupu',
            'ki-kyaxtsupu',
            'ki-kixyaxtsupu'
          ]
        },
        {
          sentenceJp: 'アルチザン',
          sentenceRm: [ 'arutizann', 'aruchizann' ]
        },
        {
          sentenceJp: 'スンマモニ',
          sentenceRm: [ 'sunmamoni', 'sunnmamoni' ]
        },
      ],
      sentenceJp: '',     // 表示する日本語
      sentenceRm: [],     // 入力可能なローマ字全件
      sentenceRmDisp: '', // 表示するローマ字
      sentenceMt: '',     // 一致したキャラクタ

      countTyped: 0,      // タイプ数(ミスは除く)
      countMiss: 0        // ミス数
    }
  },
  methods: {
    /**
     * 初期化の処理
     */
    initSentence: function () {
      this.setRandomSentence()
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

    // キー判定
    compareCharNext: function (xKey) {
      // どのcharNextにも当てはまらない場合
      if (!this.sentenceRm.some(s => s.charNext === xKey)) return false
      // 配列ごとに処理。当てはまらないものを削除
      this.sentenceRm = this.sentenceRm.filter(s => s.charNext === xKey)
      return true
    },

    // ランダムな文をセット
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

    // inputにフォーカスをセット
    setFocus: function (e) {
      e.target.focus()
    },

    onMismatch: function () {
      this.countMiss++
    },

    // 正解時の処理
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

    clearDisplay: function () {
      this.sentenceMt = ''
    }
  },
  mounted () {
    // 辞書内からランダムに選択
    this.initSentence()
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
  pointer-events: none;
}
</style>
