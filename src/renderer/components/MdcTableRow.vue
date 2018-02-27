<template>
  <tr
    v-bind="$attrs"
    class="mdc-table-row"
    v-on="$listeners"
  >
    <slot />
  </tr>
</template>
