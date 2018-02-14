<template>
  <th class="mdc-table-header-column mdc-theme--background" v-bind="$attrs" v-on="$listeners">
    <slot />
  </th>
</template>

<style scoped lang="scss">
@import "@material/theme/_color-palette";

.mdc-table-header-column {
  color: $material-color-grey-600;
  font-size: smaller;
  font-weight: normal;
  padding: 8px;
  user-select: none;
}
.mdc-theme--dark {
  .mdc-table-header-column {
    color: $material-color-grey-300;
  }
}
</style>
