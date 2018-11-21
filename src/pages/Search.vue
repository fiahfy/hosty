<template>
  <v-container class="search" fill-height fluid pa-0>
    <v-layout column>
      <search-tool-card />
      <v-container fluid pa-0 overflow-hidden>
        <search-treeview class="fill-height" />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import SearchToolCard from '~/components/SearchToolCard'
import SearchTreeview from '~/components/SearchTreeview'

export default {
  components: {
    SearchToolCard,
    SearchTreeview
  }
}
</script>
