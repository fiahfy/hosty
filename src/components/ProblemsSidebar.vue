<template>
  <v-layout column fill-height>
    <v-container fluid pa-0 overflow-hidden>
      <problems-treeview class="fill-height" />
    </v-container>
  </v-layout>
</template>

<script>
import ProblemsTreeview from '~/components/ProblemsTreeview'

export default {
  components: {
    ProblemsTreeview
  }
}
</script>
