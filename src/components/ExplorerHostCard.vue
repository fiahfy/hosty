<template>
  <v-card
    class="explorer-host-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        :title="'Star'|accelerator('CmdOrCtrl+N')"
        :disabled="!canCreate"
        flat
        icon
        @click="onNewClick"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn
        :title="'Star'|accelerator('CmdOrCtrl+Backspace')"
        :disabled="!canDelete"
        flat
        icon
        @click="onDeleteClick"
      >
        <v-icon>remove</v-icon>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
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
      this.delete()
    },
    ...mapActions({
      create: 'app/explorer/host/create',
      delete: 'app/explorer/host/delete'
    })
  }
}
</script>
