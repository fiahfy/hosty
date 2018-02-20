<template>
  <table
    class="mdc-table"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </table>
</template>
