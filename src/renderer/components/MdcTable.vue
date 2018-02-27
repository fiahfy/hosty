<template>
  <table
    v-bind="$attrs"
    class="mdc-table"
    v-on="$listeners"
  >
    <slot />
  </table>
</template>
