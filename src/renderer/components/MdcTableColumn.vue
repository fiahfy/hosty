<template>
  <td
    v-bind="$attrs"
    class="mdc-table-column mdc-theme--background"
    v-on="$listeners"
  >
    <slot />
  </td>
</template>
