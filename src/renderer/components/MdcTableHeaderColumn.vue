<template>
  <th class="mdc-table-header-column mdc-theme--background" v-bind="$attrs" v-on="$listeners">
    <slot />
  </th>
</template>

<style scoped lang="scss">
.mdc-table-header-column {
  color: var(--mdc-theme-text-secondary-on-background);
  font-size: smaller;
  font-weight: normal;
  padding: 8px;
  user-select: none;
}
</style>
