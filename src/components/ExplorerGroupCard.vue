<template>
  <v-card
    class="explorer-group-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        :title="'Star'|accelerator('CmdOrCtrl+D')"
        color="primary"
        flat
        @click="createGroup"
      >
        New
      </v-btn>
      <v-btn
        :title="'Star'|accelerator('CmdOrCtrl+D')"
        color="primary"
        flat
        @click="deleteGroup"
      >
        Delete
      </v-btn>
      <!--
      <v-btn
        :title="'View'|accelerator('Enter')"
        :disabled="!filepath"
        flat
        icon
        @click="showViewer({ filepath })"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <v-spacer />
      <v-text-field
        v-model="queryInput"
        name="query"
        class="mx-3 my-2 pt-0"
        label="Search"
        append-icon="search"
        single-line
        hide-details
        clearable
        @keyup="onKeyUp"
        @contextmenu="onContextMenu"
      /> -->
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  // computed: {
  //   queryInput: {
  //     get () {
  //       return this.$store.state.app.explorer.queryInput
  //     },
  //     set (value) {
  //       this.$store.commit('app/explorer/setQueryInput', { queryInput: value })
  //     }
  //   },
  //   ...mapState({
  //     filepath: state => state.app.explorer.filepath
  //   }),
  //   ...mapGetters({
  //     isBookmarked: 'app/explorer/isBookmarked'
  //   })
  // },
  watch: {
    queryInput () {
      this.search()
    }
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onKeyUp (e) {
      if (e.keyCode === 13) {
        this.search()
      }
    },
    ...mapActions({
      createGroup: 'app/explorer/group/create',
      deleteGroup: 'app/explorer/group/delete'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-group-card /deep/ .input-group--text-field label {
  top: 0;
}
</style>
