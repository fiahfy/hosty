<template>
  <table
    class="mdc-table"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </table>
</template>

<style scoped lang="scss">
.mdc-table {
  border-spacing: 0;
  width: 100%;
}
</style>
