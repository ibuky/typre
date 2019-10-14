<template>
  <div class="home">
    <section class="hero is-fullheight-with-navbar has-navbar-fixed-bottom">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">
            typre
          </h1>
          <h2 class="subtitle">keyboard typing demonstration</h2>
          <br>

          <div class="buttons has-addons is-centered">
            <span class="button" ref="wordRandom" @click="onClickWordRandom">ランダム単語</span>
            <span class="button" ref="sentRandom" @click="onClickSentRandom">ランダム文章</span>
            <span class="button" ref="fromWikipe" @click="onClickFromWikipe">Wikipediaから</span>
          </div>

          <!-- Game Settings -->
          <div class="column is-4 is-offset-4 has-background-light game-settings">
            <transition name="game-settings">
              <div class="settings-word-random" v-if="gameMode === C.GAMEMODE_RANDOM_WORD">
                <SettingsWordRandom @changeSettings="changeSettings"></SettingsWordRandom>
              </div>
              <div class="settings-sent-random" v-else-if="gameMode === C.GAMEMODE_RANDOM_SENT">
                <SettingsSentRandom></SettingsSentRandom>
              </div>
              <div class="settings-from-wikipe" v-else-if="gameMode === C.GAMEMODE_RANDOM_WIKI">
                <SettingsFromWikipe></SettingsFromWikipe>
              </div>
            </transition>
          </div>

        </div>

        <nav class="navbar is-fixed-bottom">
          <div class="bottom-bar">
            <span class="button is-info is-size-5" @click="this.onClickStart">
              Start
            </span>
          </div>
        </nav>
      </div>
    </section>
  </div>
</template>

<script>
import SettingsWordRandom from '@/components/SettingsWordRandom.vue'
import SettingsSentRandom from '@/components/SettingsSentRandom.vue'
import SettingsFromWikipe from '@/components/SettingsFromWikipe.vue'

import C from '../../lib/typreConst'

export default {
  name: 'Home',
  components: {
    'SettingsWordRandom': SettingsWordRandom,
    'SettingsSentRandom': SettingsSentRandom,
    'SettingsFromWikipe': SettingsFromWikipe
  },
  data () {
    return {
      C: C,         // 定数を保持
      gameMode: '',
      settings: {
        wordCount: 50
      }
    }
  },
  methods: {
    /**
     * 初期化処理
     */
    initHome: function () {
      // ランダム単語を初期選択
      this.$refs.wordRandom.classList.add('is-primary')
      this.$refs.wordRandom.classList.add('is-selected')
      this.gameMode = '1'
    },

    /**
     * カテゴリボタンクリック時の基底処理
     * @param {Object} event onclickイベント
     * @param {String} xMode ゲームモード
     */
    onClickCategory: function (event, xMode) {
      // 選択状態をすべて解除
      for (const child of event.target.parentElement.children) {
        child.classList.remove('is-primary')
        child.classList.remove('is-selected')
      }

      // 選択されたボタンに対して処理
      event.target.classList.add('is-primary')
      event.target.classList.add('is-selected')
      this.gameMode = xMode
    },

    /**
     * wordRandomクリック時の処理
     */
    onClickWordRandom: function (event) {
      this.onClickCategory(event, C.GAMEMODE_RANDOM_WORD)
    },

    /**
     * sentRandomクリック時の処理
     */
    onClickSentRandom: function (event) {
      this.onClickCategory(event, C.GAMEMODE_RANDOM_SENT)
    },

    /**
     * fromWikipeクリック時の処理
     */
    onClickFromWikipe: function () {
      this.onClickCategory(event, C.GAMEMODE_RANDOM_WIKI)
    },

    /**
     * Startクリック時の処理
     */
    onClickStart: function () {
      // ゲーム画面へ遷移
      this.$router.push({name: 'Type', params: {gameMode: this.gameMode, settings: this.settings}})
    },

    /**
     * セッティング値が変更されたときに値を反映
     */
    changeSettings: function (xSet) {
      this.settings = xSet
    }
  },
  mounted () {
    this.initHome()
  }
}
</script>

<style scoped>
h1 {
  font-size: 3em;
}

.bottom-bar {
  padding-bottom: 50px;
  width: 100%;
  text-align: center;
}

.game-settings-enter-active, .game-settings-leave-active {
  transition: opacity .5s;
}

.game-settings-enter, .game-settings-leave-to {
  opacity: 0;
}

.game-settings {
  border-radius: 4px;
}

</style>
