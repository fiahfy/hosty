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
        :ref="`row-${props.item.id}`"
        :group="props.item"
      />
    </template>
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
            e.preventDefault()
            this.deleteGroup()
          }
          break
        case 13:
          e.preventDefault()
          this.focusSelectedRow()
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstGroup()
          } else {
            this.selectPreviousGroup()
          }
          break
        case 40:
          e.preventDefault()
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
            e.preventDefault()
            this.copyGroup()
          }
          break
        case 78:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.createGroup()
          }
          break
        case 86:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
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
  & /deep/ .v-datatable {
    table-layout: fixed;
  }
}
</style>
