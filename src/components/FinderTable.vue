<template>
  <virtual-data-table
    ref="table"
    :headers="headers"
    :items="filteredItems"
    class="finder-table"
    item-key="id"
    no-data-text="No results"
    hide-actions
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @click.native="onClick"
    @keydown.native="onKeyDown"
  >
    <finder-table-header-row
      slot="headers"
      slot-scope="props"
      :headers="props.headers"
    />
    <finder-table-row
      slot="items"
      slot-scope="props"
      :ref="`row-${props.item.id}`"
      :key="props.item.id"
      :item="props.item"
    />
  </virtual-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import FinderTableHeaderRow from './FinderTableHeaderRow'
import FinderTableRow from './FinderTableRow'
import VirtualDataTable from './VirtualDataTable'

export default {
  components: {
    FinderTableHeaderRow,
    FinderTableRow,
    VirtualDataTable
  },
  data () {
    return {
      headers: [
        {
          text: 'Enabled',
          value: 'disabled',
          width: 68
        },
        {
          text: 'Group',
          value: 'group'
        },
        {
          text: 'IP',
          value: 'ip'
        },
        {
          text: 'Host',
          value: 'host'
        }
      ]
    }
  },
  computed: {
    ...mapState('local/finder', [
      'selectedItemId',
      'scrollTop'
    ]),
    ...mapGetters('local/finder', [
      'filteredItems',
      'selectedItemIndex'
    ])
  },
  watch: {
    selectedItemIndex (value) {
      this.$nextTick(() => {
        const index = value
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
    this.loadItems()
    const scrollTop = this.scrollTop
    this.$nextTick(() => {
      this.$refs.table.setScrollTop(scrollTop)
    })
  },
  methods: {
    onScroll (e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onClick () {
      this.unselectItem()
    },
    onKeyDown (e) {
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.viewSelectedRow()
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstItem()
          } else {
            this.selectPreviousItem()
          }
          break
        case 40:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastItem()
          } else {
            this.selectNextItem()
          }
          break
      }
    },
    viewSelectedRow () {
      this.$refs[`row-${this.selectedItemId}`].view()
    },
    ...mapMutations('local/finder/', [
      'setScrollTop'
    ]),
    ...mapActions('local/finder/', [
      'loadItems',
      'unselectItem',
      'selectFirstItem',
      'selectLastItem',
      'selectPreviousItem',
      'selectNextItem'
    ])
  }
}
</script>

<style scoped lang="scss">
.finder-table {
  outline: none;
}
</style>
