<template>
  <v-layout class="explorer-sidebar" column fill-height>
    <explorer-card />
    <v-container fluid pa-0 overflow-hidden>
      <explorer-table class="fill-height" />
    </v-container>
  </v-layout>
</template>

<script>
import ExplorerCard from '~/components/ExplorerCard'
import ExplorerTable from '~/components/ExplorerTable'

export default {
  components: {
    ExplorerCard,
    ExplorerTable
  }
}
</script>
