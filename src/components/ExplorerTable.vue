<template>
  <sticky-data-table
    ref="table"
    :headers="headers"
    :items="groups"
    class="explorer-table"
    item-key="id"
    no-data-text="No groups"
    hide-actions
    tabindex="0"
    @scroll="onScroll"
    @click.native="onClick"
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
      slot-scope="props"
      :ref="`row-${props.item.id}`"
      :group="props.item"
    />
  </sticky-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ExplorerTableHeaderRow from './ExplorerTableHeaderRow'
import ExplorerTableRow from './ExplorerTableRow'
import StickyDataTable from './StickyDataTable'
import * as ContextMenu from '~/utils/context-menu'

export default {
  components: {
    ExplorerTableHeaderRow,
    ExplorerTableRow,
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
          text: 'Group',
          value: 'name'
        }
      ]
    }
  },
  computed: {
    ...mapState('local/explorer', [
      'groups',
      'selectedGroupId',
      'scrollTop'
    ]),
    ...mapGetters('local/explorer', [
      'selectedGroupIndex',
      'canPasteGroup'
    ])
  },
  watch: {
    selectedGroupIndex (value) {
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
      this.unselectGroup()
    },
    onKeyDown (e) {
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
    onContextMenu (e) {
      this.unselectGroup()
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
      ContextMenu.show(e, templates)
    },
    focusSelectedRow () {
      this.$refs[`row-${this.selectedGroupId}`].focus()
    },
    ...mapMutations('local/explorer', [
      'setScrollTop'
    ]),
    ...mapActions('local/explorer', [
      'createGroup',
      'deleteGroup',
      'copyGroup',
      'pasteGroup',
      'unselectGroup',
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
