<template>
  <v-card
    class="explorer-child-card"
    flat
    tile
  >
    <v-toolbar
      color="transparent"
      flat
    >
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
        title="Filter Enabled"
        flat
        icon
        @click="onFilterClick"
      >
        <v-icon>filter_list</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    color() {
      return this.filtered ? 'primary' : ''
    },
    ...mapState('local/explorer/child', ['selectedHostId', 'filtered']),
    ...mapGetters('local/explorer/child', ['canCreateHost', 'canDeleteHost'])
  },
  methods: {
    onNewClick() {
      this.createHost()
    },
    onDeleteClick() {
      this.deleteHost({ id: this.selectedHostId })
    },
    onFilterClick() {
      this.toggleFiltered()
    },
    ...mapActions('local/explorer/child', [
      'createHost',
      'deleteHost',
      'toggleFiltered'
    ])
  }
}
</script>
