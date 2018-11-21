<template>
  <v-container class="inspector" fill-height fluid pa-0>
    <v-layout column>
      <v-container fluid pa-0 overflow-hidden>
        <inspector-result-treeview class="fill-height" />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import InspectorResultTreeview from '~/components/InspectorResultTreeview'

export default {
  components: {
    InspectorResultTreeview
  }
}
</script>
