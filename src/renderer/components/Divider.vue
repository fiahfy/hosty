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
@import "@material/theme/_color-palette";

.divider {
  background-color: $material-color-grey-300;
}
.mdc-theme--dark .divider {
  background-color: $material-color-grey-600;
}
</style>
