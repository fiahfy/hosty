<template>
  <v-container
    class="finder"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
      <finder-card />
      <v-container
        fluid
        pa-0
        overflow-hidden
      >
        <finder-table class="fill-height" />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import FinderCard from '~/components/FinderCard'
import FinderTable from '~/components/FinderTable'

export default {
  components: {
    FinderCard,
    FinderTable
  }
}
</script>
