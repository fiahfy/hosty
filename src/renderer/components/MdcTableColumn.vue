<template>
  <td
    class="mdc-table-column mdc-theme--background"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </td>
</template>

<style scoped lang="scss">
.mdc-table-column {
  padding: 8px;
}
</style>
