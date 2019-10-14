<template>
  <div>
    <div class="columns">
      <div class="column is-6 vcenter">単語数</div>
      <div class="column is-6">
        <div class="select" @change="onChangeWordCount">
          <select>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50" selected>50</option>
            <option value="100">100</option>
            <option value="-1">∞</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsWordRandom',
  data () {
    return {
      settings: {
        wordCount: 50
      }
    }
  },
  methods: {
    onChangeWordCount: function (e) {
      this.settings.wordCount = parseInt(e.target.value)
      this.$emit('changeSettings', this.settings)
    }
  }
}
</script>

<style scoped>
  .vcenter {
    line-height: 2em;
  }
</style>
