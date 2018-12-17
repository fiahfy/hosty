<template>
  <sticky-data-table
    ref="table"
    class="host-table"
    :headers="headers"
    :items="hosts"
    item-key="id"
    no-data-text="No hosts."
    hide-actions
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
    @contextmenu.native.stop="onContextMenu"
  >
    <host-table-header-row
      slot="headers"
      slot-scope="props"
      :headers="props.headers"
    />
    <host-table-row
      slot="items"
      :ref="`row-${props.item.id}`"
      slot-scope="props"
      :host="props.item"
    />
  </sticky-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import HostTableHeaderRow from './HostTableHeaderRow'
import HostTableRow from './HostTableRow'
import StickyDataTable from './StickyDataTable'

export default {
  components: {
    HostTableHeaderRow,
    HostTableRow,
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
    ...mapState('local', ['selectedGroupId', 'selectedHostId', 'scrollTop']),
    ...mapGetters('local', ['hosts', 'selectedHostIndex', 'canPasteHost'])
  },
  watch: {
    selectedHostIndex(value) {
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
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onKeyDown(e) {
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
    onContextMenu() {
      const template = [
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
      this.$contextMenu.show(template)
    },
    focusSelectedRow() {
      this.$refs[`row-${this.selectedHostId}`].focus()
    },
    ...mapMutations('local', ['setScrollTop']),
    ...mapActions('local', [
      'createHost',
      'deleteHost',
      'copyHost',
      'pasteHost',
      'selectFirstHost',
      'selectLastHost',
      'selectPreviousHost',
      'selectNextHost'
    ])
  }
}
</script>

<style scoped lang="scss">
.host-table {
  outline: none;
}
</style>
