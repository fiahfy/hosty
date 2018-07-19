<template>
  <v-card
    class="explorer-child-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        :title="'New Host'|accelerator('CmdOrCtrl+N')"
        :disabled="!canCreateHost"
        flat
        icon
        @click="onNewClick"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn
        :title="'Delete'|accelerator('CmdOrCtrl+Backspace')"
        :disabled="!canDeleteHost"
        flat
        icon
        @click="onDeleteClick"
      >
        <v-icon>remove</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        :color="color"
        title="Filter Active"
        flat
        icon
        @click="onFilterClick"
      >
        <v-icon>filter_list</v-icon>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    color () {
      return this.filtered ? 'primary' : ''
    },
    ...mapState('local/explorer/child', [
      'filtered'
    ]),
    ...mapGetters('local/explorer/child', [
      'canCreateHost',
      'canDeleteHost'
    ])
  },
  methods: {
    onNewClick () {
      this.createHost()
    },
    onDeleteClick () {
      this.deleteHost()
    },
    onFilterClick () {
      this.toggleFilter()
    },
    ...mapActions('local/explorer/child', [
      'createHost',
      'deleteHost',
      'toggleFilter'
    ])
  }
}
</script>
