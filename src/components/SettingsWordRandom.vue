<template>
  <div class="columns">
    <div class="column is-9">単語数</div>
    <div class="column is-3">
      <div class="select">
        <select>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsWordRandom'
}
</script>
