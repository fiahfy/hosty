<template>
  <tr
    class="mdc-table-row"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </tr>
</template>
