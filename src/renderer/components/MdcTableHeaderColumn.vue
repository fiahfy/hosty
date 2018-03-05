<template>
  <th
    v-bind="$attrs"
    class="mdc-table-header-column mdc-theme--background"
    v-on="$listeners"
  >
    <slot />
  </th>
</template>
