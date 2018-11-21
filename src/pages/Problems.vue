<template>
  <v-container class="problems" fill-height fluid pa-0>
    <v-layout column>
      <v-container fluid pa-0 overflow-hidden>
        <problems-treeview class="fill-height" />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import ProblemsTreeview from '~/components/ProblemsTreeview'

export default {
  components: {
    ProblemsTreeview
  }
}
</script>
