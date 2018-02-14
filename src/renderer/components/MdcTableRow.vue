<template>
  <tr class="mdc-table-row" :class="classes" v-bind="$attrs" v-on="$listeners">
    <slot />
  </tr>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes () {
      return {
        selected: this.selected
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@material/theme/_color-palette";

.mdc-table-row {
  & /deep/ .mdc-table-header-column,
  & /deep/ .mdc-table-column {
    border-bottom: {
      color: $material-color-grey-300;
      style: solid;
      width: 1px;
    }
  }
  &:hover /deep/ .mdc-table-column {
    background-color: $material-color-grey-100;
  }
  &.selected /deep/ .mdc-table-column {
    background-color: $material-color-grey-300;
  }
}
.mdc-theme--dark .mdc-table-row {
  & /deep/ .mdc-table-header-column,
  & /deep/ .mdc-table-column {
    border-bottom-color: $material-color-grey-600;
  }
  &:hover /deep/ .mdc-table-column {
    background-color: $material-color-grey-800;
  }
  &.selected /deep/ .mdc-table-column {
    background-color: $material-color-grey-600;
  }
}
</style>
