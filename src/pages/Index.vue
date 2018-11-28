<template>
  <v-container class="index" fill-height fluid pa-0>
    <v-layout row>
      <v-flex xs4>
        <keep-alive><component :is="sidebarComponent" /></keep-alive>
      </v-flex>
      <v-flex xs8>
        <v-layout column fill-height>
          <explorer-child-card />
          <v-container fluid pa-0 overflow-hidden>
            <explorer-child-table class="fill-height" />
          </v-container>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ExplorerSidebar from '~/components/ExplorerSidebar'
import ProblemsSidebar from '~/components/ProblemsSidebar'
import SearchSidebar from '~/components/SearchSidebar'
import ExplorerChildCard from '~/components/ExplorerChildCard'
import ExplorerChildTable from '~/components/ExplorerChildTable'

export default {
  components: {
    ExplorerChildCard,
    ExplorerChildTable
  },
  computed: {
    sidebarComponent() {
      switch (this.$route.query.sidebar) {
        case 'search':
          return SearchSidebar
        case 'problems':
          return ProblemsSidebar
        default:
          return ExplorerSidebar
      }
    }
  }
}
</script>
