<template>
  <sticky-data-table
    ref="table"
    class="explorer-table"
    :headers="headers"
    :items="groups"
    item-key="id"
    no-data-text="No groups."
    hide-actions
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
    @contextmenu.native.stop="onContextMenu"
  >
    <explorer-table-header-row
      slot="headers"
      slot-scope="props"
      :headers="props.headers"
    />
    <explorer-table-row
      slot="items"
      :ref="`row-${props.item.id}`"
      slot-scope="props"
      :group="props.item"
    />
  </sticky-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ExplorerTableHeaderRow from './ExplorerTableHeaderRow'
import ExplorerTableRow from './ExplorerTableRow'
import StickyDataTable from './StickyDataTable'
import contextMenu from '~/utils/context-menu'

export default {
  components: {
    ExplorerTableHeaderRow,
    ExplorerTableRow,
    StickyDataTable
  },
  data() {
    return {
      headers: [
        {
          text: 'Enabled',
          value: 'disabled',
          width: 68
        },
        {
          text: 'Group',
          value: 'name'
        }
      ]
    }
  },
  computed: {
    ...mapState('local', ['selectedGroupId']),
    ...mapState('local/explorer', ['scrollTop']),
    ...mapGetters('local/explorer', [
      'groups',
      'selectedGroupIndex',
      'canPasteGroup'
    ])
  },
  watch: {
    selectedGroupIndex(value) {
      this.$nextTick(() => {
        const index = value
        if (index === -1) {
          return
        }
        const rowHeight = 48
        const headerHeight = 58
        const el = {
          offsetTop: rowHeight * index,
          offsetHeight: rowHeight
        }
        const table = {
          scrollTop: this.$refs.table.getScrollTop(),
          offsetHeight: this.$refs.table.getOffsetHeight() - headerHeight
        }
        if (table.scrollTop > el.offsetTop) {
          this.$refs.table.setScrollTop(el.offsetTop)
        } else if (
          table.scrollTop <
          el.offsetTop + el.offsetHeight - table.offsetHeight
        ) {
          this.$refs.table.setScrollTop(
            el.offsetTop + el.offsetHeight - table.offsetHeight
          )
        }
      })
    }
  },
  mounted() {
    this.$refs.table.setScrollTop(this.scrollTop)
  },
  methods: {
    onScroll(e) {
      const scrollTop = e.target.scrollTop
      this.setScrollTop({ scrollTop })
    },
    onKeyDown(e) {
      switch (e.keyCode) {
        case 8:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.deleteGroup({ id: this.selectedGroupId })
          }
          break
        case 13:
          this.focusSelectedRow()
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstGroup()
          } else {
            this.selectPreviousGroup()
          }
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastGroup()
          } else {
            this.selectNextGroup()
          }
          break
        case 67:
          if (getSelection().toString()) {
            break
          }
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.copyGroup({ id: this.selectedGroupId })
          }
          break
        case 78:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.createGroup()
          }
          break
        case 86:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.pasteGroup()
          }
          break
      }
    },
    onContextMenu() {
      const templates = [
        {
          label: 'New Group',
          click: () => this.createGroup(),
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Paste',
          click: () => this.pasteGroup(),
          accelerator: 'CmdOrCtrl+V',
          enabled: this.canPasteGroup
        }
      ]
      contextMenu.show(templates)
    },
    focusSelectedRow() {
      this.$refs[`row-${this.selectedGroupId}`].focus()
    },
    ...mapMutations('local/explorer', ['setScrollTop']),
    ...mapActions('local/explorer', [
      'createGroup',
      'deleteGroup',
      'copyGroup',
      'pasteGroup',
      'selectFirstGroup',
      'selectLastGroup',
      'selectPreviousGroup',
      'selectNextGroup'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-table {
  outline: none;
}
</style>
