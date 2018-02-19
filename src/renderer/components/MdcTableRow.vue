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
.mdc-table-row {
  &:hover /deep/ .mdc-table-column {
    background-color: var(--hover);
  }
  &.selected /deep/ .mdc-table-column {
    background-color: var(--selected);
  }
}
.mdc-table:focus {
  .mdc-table-row.selected /deep/ .mdc-table-column {
    background-color: var(--focus);
  }
}
</style>
