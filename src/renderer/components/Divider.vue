<template>
  <div class="divider" :style="styles" />
</template>

<script>
export default {
  props: {
    orientation: {
      type: String,
      default: 'horizontal'
    }
  },
  computed: {
    styles () {
      if (this.orientation === 'horizontal') {
        return {
          height: '1px'
        }
      } else {
        return {
          width: '1px'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.divider {
  background-color: var(--divider);
}
</style>
