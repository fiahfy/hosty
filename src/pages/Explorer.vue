<template>
  <v-container
    class="explorer"
    fill-height
    fluid
    pa-0
  >
    <v-layout row>
      <v-flex xs4>
        <v-layout column>
          <explorer-card />
          <v-container
            fluid
            pa-0
            overflow-hidden
          >
            <explorer-table class="fill-height" />
          </v-container>
        </v-layout>
      </v-flex>
      <v-flex xs8>
        <v-layout column>
          <explorer-child-card />
          <v-container
            fluid
            pa-0
            overflow-hidden
          >
            <explorer-child-table class="fill-height" />
          </v-container>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ExplorerCard from '~/components/ExplorerCard'
import ExplorerTable from '~/components/ExplorerTable'
import ExplorerChildCard from '~/components/ExplorerChildCard'
import ExplorerChildTable from '~/components/ExplorerChildTable'

export default {
  components: {
    ExplorerCard,
    ExplorerTable,
    ExplorerChildCard,
    ExplorerChildTable
  }
}
</script>
