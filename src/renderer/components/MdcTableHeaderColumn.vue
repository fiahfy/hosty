<template>
  <th
    class="mdc-table-header-column mdc-theme--background"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </th>
</template>
