<template>
  <v-card
    class="explorer-card"
    flat
    tile
  >
    <v-toolbar
      color="transparent"
      flat
    >
      <v-btn
        :title="'New Group'|accelerator('CmdOrCtrl+N')"
        :disabled="!canCreateGroup"
        flat
        icon
        @click="onNewClick"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn
        :title="'Delete'|accelerator('CmdOrCtrl+Backspace')"
        :disabled="!canDeleteGroup"
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
    color () {
      return this.filtered ? 'primary' : ''
    },
    ...mapState('local/explorer', [
      'selectedGroupId',
      'filtered'
    ]),
    ...mapGetters('local/explorer', [
      'canCreateGroup',
      'canDeleteGroup'
    ])
  },
  methods: {
    onNewClick () {
      this.createGroup()
    },
    onDeleteClick () {
      this.deleteGroup({ id: this.selectedGroupId })
    },
    onFilterClick () {
      this.toggleFiltered()
    },
    ...mapActions('local/explorer', [
      'createGroup',
      'deleteGroup',
      'toggleFiltered'
    ])
  }
}
</script>
