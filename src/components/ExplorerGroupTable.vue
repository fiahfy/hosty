<template>
  <v-data-table
    ref="table"
    :headers="headers"
    :items="items"
    :disable-initial-sort="true"
    :class="classes"
    class="explorer-group-table"
    item-key="id"
    hide-actions
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <explorer-group-table-header-row :headers="props.headers" />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <explorer-group-table-row
        :active="props.selected"
        :item="props.item"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import ExplorerGroupTableHeaderRow from './ExplorerGroupTableHeaderRow'
import ExplorerGroupTableRow from './ExplorerGroupTableRow'

export default {
  components: {
    ExplorerGroupTableHeaderRow,
    ExplorerGroupTableRow
  },
  data () {
    return {
      headers: [
        {
          text: 'Status',
          value: 'disabled',
          width: 68
        },
        {
          text: 'Group',
          value: 'name'
        }
      ],
      scrolling: false
    }
  },
  computed: {
    classes () {
      return {
        scrolling: this.scrolling
      }
    },
    ...mapState({
      scrollTop: state => state.app.explorer.group.scrollTop
    }),
    ...mapGetters({
      items: 'app/explorer/group/items'
    })
  },
  mounted () {
    this.container = this.$el.querySelector('.table__overflow')
    this.container.addEventListener('scroll', this.onScroll)
    const scrollTop = this.scrollTop
    this.$nextTick(() => {
      this.container.scrollTop = scrollTop
    })
  },
  beforeDestroy () {
    this.container.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll (e) {
      this.scrolling = e.target.scrollTop > 0
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    ...mapMutations({
      setScrollTop: 'app/explorer/group/setScrollTop'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-group-table {
  & /deep/ .table__overflow {
    height: 100%;
    overflow-y: scroll;
    .datatable {
      table-layout: fixed;
      &>thead {
        background: inherit;
        &>tr {
          background: inherit;
          &>th {
            background: inherit;
            position: sticky;
            top: 0;
            z-index: 1;
          }
          &.datatable__progress>th {
            top: 56px;
            z-index: 0;
            &:after {
              bottom: 0;
              box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
              content: '';
              left: 0;
              position: absolute;
              width: 100%;
            }
          }
        }
      }
    }
  }
  &.scrolling /deep/ .datatable>thead>tr {
    border-bottom: none;
    &.datatable__progress>th:after {
      height: 10px;
    }
  }
}
</style>
