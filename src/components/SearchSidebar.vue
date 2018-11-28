<template>
  <v-layout column fill-height>
    <search-tool-card />
    <v-container fluid pa-0 overflow-hidden>
      <search-treeview class="fill-height" />
    </v-container>
  </v-layout>
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
