<template>
  <v-container
    class="search"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
      <search-card />
      <v-container
        fluid
        pa-0
        overflow-hidden
      >
        <search-table class="fill-height" />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import SearchCard from '~/components/SearchCard'
import SearchTable from '~/components/SearchTable'

export default {
  components: {
    SearchCard,
    SearchTable
  }
}
</script>
