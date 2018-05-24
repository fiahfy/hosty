<template>
  <v-card
    class="explorer-host-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        :title="'Star'|accelerator('CmdOrCtrl+D')"
        :disabled="!canCreate"
        color="primary"
        flat
        @click="onNewClick"
      >
        New
      </v-btn>
      <v-btn
        :title="'Star'|accelerator('CmdOrCtrl+D')"
        :disabled="!canDelete"
        color="primary"
        flat
        @click="onDeleteClick"
      >
        Delete
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      selectedId: state => state.app.explorer.host.selectedId
    }),
    ...mapGetters({
      canCreate: 'app/explorer/host/canCreate',
      canDelete: 'app/explorer/host/canDelete'
    })
  },
  methods: {
    onNewClick () {
      this.create()
    },
    onDeleteClick () {
      this.delete({ id: this.selectedId })
    },
    ...mapActions({
      create: 'app/explorer/host/create',
      delete: 'app/explorer/host/delete'
    })
  }
}
</script>
