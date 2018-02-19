<template>
  <div class="title-bar">{{ title || '(No name)' }}</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      title: state => state.title
    })
  }
}
</script>

<style scoped lang="scss">
.title-bar {
  box-sizing: border-box;
  color: var(--mdc-theme-text-primary-on-background);
  font-size: smaller;
  height: 23px;
  line-height: 23px;
  overflow: hidden;
  padding: 0 68px;
  text-align: center;
  text-overflow: ellipsis;
  user-select: none;
  -webkit-app-region: drag;
}
</style>
