<template>
  <div class="preview">
    <div />
    <preview-list />
  </div>
</template>

<script>
import PreviewList from '../components/PreviewList'

export default {
  components: {
    PreviewList
  }
}
</script>

<style scoped lang="scss">
.preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .preview-list {
    flex: 1;
  }
}
</style>
