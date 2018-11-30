<template>
  <v-toolbar class="host-toolbar" flat dense>
    <template v-if="selectedGroup">
      <v-btn color="red" flat icon @click.stop="">
        <v-icon>check_circle</v-icon>
      </v-btn>
      <span class="spacer ellipsis">{{ selectedGroup.name }}</span>
    </template>
  </v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('local', ['selectedGroup'])
  }
}
</script>
