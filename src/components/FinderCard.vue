<template>
  <v-card
    class="finder-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-text-field
        v-model="query"
        name="query"
        class="mx-3 my-2 pt-0"
        label="Finder"
        append-icon="finder"
        single-line
        hide-details
        clearable
        @contextmenu.stop="onTextContextMenu"
      />
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
    color () {
      return this.filtered ? 'primary' : ''
    },
    ...mapState({
      filtered: state => state.local.finder.filtered
    })
  },
  methods: {
    onTextContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onFilterClick () {
      this.toggleFilter()
    },
    ...mapActions({
      toggleFilter: 'local/finder/toggleFilter'
    })
  }
}
</script>
