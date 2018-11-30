<template>
  <v-container class="index" fill-height fluid pa-0>
    <v-layout row>
      <v-flex xs4>
        <v-layout row fill-height>
          <v-layout column fill-height>
            <v-toolbar flat dense>
              <v-subheader class="pl-0">{{ headline }}</v-subheader>
            </v-toolbar>
            <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
            <keep-alive><component :is="sidebarComponent"/></keep-alive>
          </v-layout>
          <v-divider vertical />
        </v-layout>
      </v-flex>
      <v-flex xs8>
        <v-layout column fill-height>
          <v-toolbar flat dense>
            <v-btn color="red" flat icon @click.stop="">
              <v-icon>check_circle</v-icon>
            </v-btn>
            <span class="spacer ellipsis">{{ 'Untitled' }}</span>
          </v-toolbar>
          <host-card />
          <v-container fluid pa-0 overflow-hidden>
            <host-table class="fill-height" />
          </v-container>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ExplorerSidebar from '~/components/ExplorerSidebar'
import HostCard from '~/components/HostCard'
import HostTable from '~/components/HostTable'
import ProblemsSidebar from '~/components/ProblemsSidebar'
import SearchSidebar from '~/components/SearchSidebar'

export default {
  components: {
    HostCard,
    HostTable
  },
  computed: {
    headline() {
      return (this.$route.query.sidebar || 'explorer').toUpperCase()
    },
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
