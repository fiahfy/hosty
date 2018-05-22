<template>
  <v-data-table
    ref="table"
    :headers="headers"
    :items="items"
    :no-data-text="noDataText"
    class="explorer-group-table"
    item-key="path"
    hide-actions
    must-sort
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <explorer-table-header-row :headers="props.headers" />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <explorer-table-row
        :key="props.item.path"
        :item="props.item"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
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
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Size',
          value: 'size',
          width: 64
        },
        {
          text: 'Date Modified',
          value: 'mtime',
          width: 128
        }
      ]
    }
  },
  computed: {
    noDataText () {
      return this.query ? 'No matching records found' : 'No data available'
    },
    ...mapState({
      query: state => state.app.explorer.group.query,
      id: state => state.app.explorer.group.id
    }),
    ...mapGetters({
      items: 'app/explorer/group/filteredItems',
      scrollTop: 'app/explorer/group/scrollTop',
      selectedIndex: 'app/explorer/group/selectedIndex'
    })
  },
  watch: {
    id () {
      this.$nextTick(() => {
        const index = this.selectedIndex
        if (index === -1) {
          return
        }
        const rowHeight = 48
        const headerHeight = 58
        const el = {
          offsetTop: rowHeight * (index + 1),
          offsetHeight: rowHeight
        }
        const table = {
          scrollTop: this.$refs.table.getScrollTop(),
          offsetHeight: this.$refs.table.getOffsetHeight()
        }
        if (el.offsetTop - el.offsetHeight < table.scrollTop) {
          this.$refs.table.setScrollTop(el.offsetTop - el.offsetHeight)
        } else if (el.offsetTop + headerHeight > table.scrollTop + table.offsetHeight) {
          this.$refs.table.setScrollTop(el.offsetTop + headerHeight - table.offsetHeight)
        }
      })
    }
  },
  mounted () {
    this.restore()
  },
  methods: {
    restore () {
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
    onScroll (e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onKeyDown (e) {
      switch (e.keyCode) {
        // case 13:
        //   e.preventDefault()
        //   this.showViewer({ filepath: this.filepath })
        //   break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirst()
          } else {
            this.selectPrevious()
          }
          break
        case 40:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLast()
          } else {
            this.selectNext()
          }
          break
        // case 68:
        //   if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
        //     e.preventDefault()
        //     this.toggleBookmark({ filepath: this.filepath })
        //   }
        //   break
      }
    },
    ...mapActions({
      selectFirst: 'app/explorer/group/selectFirst',
      selectLast: 'app/explorer/group/selectLast',
      selectPrevious: 'app/explorer/group/selectPrevious',
      selectNext: 'app/explorer/group/selectNext',
      setScrollTop: 'app/explorer/group/setScrollTop'
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
