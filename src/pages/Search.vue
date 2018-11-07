<template>
  <v-container
    class="search"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
      <search-tool-card />
      <v-container
        fluid
        pa-0
        overflow-hidden
      >
        <search-result-treeview class="fill-height" />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import SearchToolCard from '~/components/SearchToolCard'
import SearchResultTreeview from '~/components/SearchResultTreeview'

export default {
  components: {
    SearchToolCard,
    SearchResultTreeview
  }
}
</script>
