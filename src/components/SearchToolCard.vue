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
      <v-btn
        :color="filterColor"
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
import { mapMutations, mapState } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

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
    filterColor() {
      return this.filtered ? 'primary' : ''
    },
    regExpColor() {
      return this.regExp ? 'primary' : ''
    },
    ...mapState('local/search', ['filtered', 'regExp'])
  },
  methods: {
    onTextContextMenu(e) {
      ContextMenu.showTextMenu(e)
    },
    onTextKeyDown(e) {
      if (
        e.altKey &&
        ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) &&
        e.keyCode === 82
      ) {
        this.toggleRegExp()
      }
    },
    onFilterClick() {
      this.toggleFiltered()
    },
    onRegExpClick() {
      this.toggleRegExp()
    },
    ...mapMutations('local/search', ['toggleFiltered', 'toggleRegExp'])
  }
}
</script>
