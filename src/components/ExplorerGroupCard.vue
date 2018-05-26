<template>
  <v-card
    class="explorer-group-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        :title="'New Group'|accelerator('CmdOrCtrl+N')"
        :disabled="!canCreate"
        flat
        icon
        @click="onNewClick"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn
        :title="'Delete'|accelerator('CmdOrCtrl+Backspace')"
        :disabled="!canDelete"
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
    ...mapState({
      filtered: state => state.app.explorer.group.filtered
    }),
    ...mapGetters({
      canCreate: 'app/explorer/group/canCreate',
      canDelete: 'app/explorer/group/canDelete'
    })
  },
  methods: {
    onNewClick () {
      this.create()
    },
    onDeleteClick () {
      this.delete()
    },
    onFilterClick () {
      this.toggleFilter()
    },
    ...mapActions({
      create: 'app/explorer/group/create',
      delete: 'app/explorer/group/delete',
      toggleFilter: 'app/explorer/group/toggleFilter'
    })
  }
}
</script>
