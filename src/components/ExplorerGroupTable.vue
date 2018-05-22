<template>
  <v-data-table
    ref="table"
    :headers="headers"
    :items="items"
    :pagination.sync="pagination"
    v-model="selected"
    class="explorer-group-table"
    item-key="id"
    hide-actions
    must-sort
  >
    <!-- <template
      slot="headers"
      slot-scope="props"
    >
      <explorer-group-table-header-row :headers="props.headers" />
    </template> -->
    <template
      slot="items"
      slot-scope="props"
    >
      <explorer-group-table-row
        :active="props.selected"
        :item="props.item"
        @click.native="selected = [props.item]"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
import ExplorerGroupTableHeaderRow from './ExplorerGroupTableHeaderRow'
import ExplorerGroupTableRow from './ExplorerGroupTableRow'

export default {
  components: {
    ExplorerGroupTableHeaderRow,
    ExplorerGroupTableRow
  },
  data () {
    return {
      selected: [],
      pagination: {
        sortBy: 'name',
        rowsPerPage: -1
      },
      headers: [
        {
          text: 'Status',
          value: 'disabled'
        },
        {
          text: 'Group',
          value: 'name'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      items: 'app/explorer/group/items'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-group-table {
  outline: none;
  & /deep/ .datatable {
    table-layout: fixed;
  }
}
</style>
