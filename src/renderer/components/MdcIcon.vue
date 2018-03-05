<template>
  <i
    :data-content="icon"
    class="mdc-icon material-icons"
  />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.mdc-icon::before {
  content: attr(data-content);
}
</style>
