<template>
  <v-card
    class="finder-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-text-field
        v-model="query"
        name="query"
        class="ml-3 mr-2 my-2 pt-0"
        label="Search"
        append-icon="search"
        single-line
        hide-details
        clearable
        @contextmenu.stop="onTextContextMenu"
        @keydown="onTextKeyDown"
      />
      <v-btn
        :color="regExpColor"
        :title="'Use RegExp'|accelerator('Alt+CmdOrCtrl+R')"
        flat
        icon
        @click="onRegExpClick"
      >
        <v-icon>explicit</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        :color="filterColor"
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
import { mapActions, mapState } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  computed: {
    query: {
      get () {
        return this.$store.state.local.finder.query
      },
      set (value) {
        this.$store.commit('local/finder/setQuery', { query: value })
      }
    },
    filterColor () {
      return this.filtered ? 'primary' : ''
    },
    regExpColor () {
      return this.regExp ? 'primary' : ''
    },
    ...mapState('local/finder/', [
      'filtered',
      'regExp'
    ])
  },
  methods: {
    onTextContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onTextKeyDown (e) {
      if (e.altKey && ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.keyCode === 82) {
        this.toggleRegExp()
      }
    },
    onFilterClick () {
      this.toggleFilter()
    },
    onRegExpClick () {
      this.toggleRegExp()
    },
    ...mapActions('local/finder/', [
      'toggleFilter',
      'toggleRegExp'
    ])
  }
}
</script>
