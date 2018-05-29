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
          <explorer-group-card />
          <v-container
            fluid
            pa-0
            overflow-hidden
          >
            <explorer-group-table class="fill-height" />
          </v-container>
        </v-layout>
      </v-flex>
      <v-flex xs8>
        <v-layout column>
          <explorer-host-card />
          <v-container
            fluid
            pa-0
            overflow-hidden
          >
            <explorer-host-table class="fill-height" />
          </v-container>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ExplorerGroupCard from '~/components/ExplorerGroupCard'
import ExplorerGroupTable from '~/components/ExplorerGroupTable'
import ExplorerHostCard from '~/components/ExplorerHostCard'
import ExplorerHostTable from '~/components/ExplorerHostTable'

export default {
  components: {
    ExplorerGroupCard,
    ExplorerGroupTable,
    ExplorerHostCard,
    ExplorerHostTable
  },
  created () {
    this.$store.dispatch('app/explorer/group/load')
  }
}
</script>
