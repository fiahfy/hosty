<template>
  <v-card class="search-tool-card" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-text-field
        v-model="query"
        class="pt-0"
        name="query"
        label="Search"
        prepend-icon="search"
        single-line
        hide-details
        clearable
        @contextmenu.stop="onTextContextMenu"
        @keydown="onTextKeyDown"
      />
      <v-btn
        :color="regExpColor"
        :title="'Use Regular Expression' | accelerator('Alt+CmdOrCtrl+R')"
        class="regexp"
        flat
        icon
        @click="onRegExpClick"
      >
        RE
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    query: {
      get() {
        return this.$store.state.local.search.query
      },
      set(value) {
        this.$store.commit('local/search/setQuery', { query: value })
      }
    },
    regExpColor() {
      return this.regExpEnabled ? 'primary' : ''
    },
    ...mapState('local/search', ['regExpEnabled'])
  },
  methods: {
    onTextContextMenu() {
      this.$contextMenu.show([
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ])
    },
    onTextKeyDown(e) {
      if (
        e.altKey &&
        ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) &&
        e.keyCode === 82
      ) {
        this.toggleRegExpEnabled()
      }
    },
    onRegExpClick() {
      this.toggleRegExpEnabled()
    },
    ...mapMutations('local/search', ['toggleRegExpEnabled'])
  }
}
</script>
