<template>
  <sticky-data-table
    ref="table"
    :headers="headers"
    :items="hosts"
    class="explorer-child-table"
    item-key="id"
    :no-data-text="noDataText"
    hide-actions
    tabindex="0"
    @scroll="onScroll"
    @click.native="onClick"
    @keydown.native="onKeyDown"
    @contextmenu.native.stop="onContextMenu"
  >
    <explorer-child-table-header-row
      slot="headers"
      slot-scope="props"
      :headers="props.headers"
    />
    <explorer-child-table-row
      slot="items"
      slot-scope="props"
      :ref="`row-${props.item.id}`"
      :host="props.item"
    />
  </sticky-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ExplorerChildTableHeaderRow from './ExplorerChildTableHeaderRow'
import ExplorerChildTableRow from './ExplorerChildTableRow'
import StickyDataTable from './StickyDataTable'
import * as ContextMenu from '~/utils/context-menu'

export default {
  components: {
    ExplorerChildTableHeaderRow,
    ExplorerChildTableRow,
    StickyDataTable
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
          text: 'IP',
          value: 'ip'
        },
        {
          text: 'Host',
          value: 'name'
        }
      ]
    }
  },
  computed: {
    noDataText () {
      return this.selectedGroupId ? 'No hosts' : 'No groups selected'
    },
    ...mapState('local/explorer/child', [
      'hosts',
      'selectedHostId',
      'scrollTop'
    ]),
    ...mapGetters('local/explorer/child', [
      'selectedGroupId',
      'selectedHostIndex',
      'canPasteHost'
    ])
  },
  watch: {
    selectedHostIndex (value) {
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
        } else if (table.scrollTop < el.offsetTop + el.offsetHeight - table.offsetHeight) {
          this.$refs.table.setScrollTop(el.offsetTop + el.offsetHeight - table.offsetHeight)
        }
      })
    }
  },
  mounted () {
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
      this.unselectHost()
    },
    onKeyDown (e) {
      switch (e.keyCode) {
        case 8:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.deleteHost({ id: this.selectedHostId })
          }
          break
        case 13:
          this.focusSelectedRow()
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstHost()
          } else {
            this.selectPreviousHost()
          }
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastHost()
          } else {
            this.selectNextHost()
          }
          break
        case 67:
          if (getSelection().toString()) {
            break
          }
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.copyHost({ id: this.selectedHostId })
          }
          break
        case 78:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.createHost()
          }
          break
        case 86:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.pasteHost()
          }
          break
      }
    },
    onContextMenu (e) {
      this.unselectHost()
      const templates = [
        {
          label: 'New Host',
          click: () => this.createHost(),
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Paste',
          click: () => this.pasteHost(),
          accelerator: 'CmdOrCtrl+V',
          enabled: this.canPasteHost
        }
      ]
      ContextMenu.show(e, templates)
    },
    focusSelectedRow () {
      this.$refs[`row-${this.selectedHostId}`].focus()
    },
    ...mapMutations('local/explorer/child', [
      'setScrollTop'
    ]),
    ...mapActions('local/explorer/child', [
      'createHost',
      'deleteHost',
      'copyHost',
      'pasteHost',
      'unselectHost',
      'selectFirstHost',
      'selectLastHost',
      'selectPreviousHost',
      'selectNextHost'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-child-table {
  outline: none;
}
</style>
