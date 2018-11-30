<template>
  <v-toolbar class="host-toolbar" flat dense>
    <v-btn :color="color" flat icon @click="onButtonClick">
      <v-icon>check_circle</v-icon>
    </v-btn>
    <v-text-field
      v-model="name"
      class="pt-0"
      label="Untitled"
      single-line
      hide-details
      @contextmenu.stop="onTextContextMenu"
    />
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  computed: {
    name: {
      get() {
        return this.selectedGroup.name
      },
      set(value) {
        this.updateGroup({
          id: this.selectedGroup.id,
          group: { name: value }
        })
      }
    },
    color() {
      if (this.selectedGroup.disabled) {
        return this.darkTheme ? 'grey darken-1' : 'grey lighten-2'
      }
      return 'success'
    },
    ...mapState('settings', ['darkTheme']),
    ...mapGetters('local', ['selectedGroup'])
  },
  methods: {
    onButtonClick() {
      this.updateGroup({
        id: this.selectedGroup.id,
        group: { disabled: !this.selectedGroup.disabled }
      })
    },
    onTextContextMenu(e) {
      ContextMenu.showTextMenu(e)
    },
    ...mapActions('local/explorer', ['updateGroup'])
  }
}
</script>
