<template>
  <v-data-table
    ref="table"
    :headers="headers"
    :items="hosts"
    :disable-initial-sort="true"
    :class="classes"
    class="explorer-child-table"
    item-key="id"
    no-data-text="No Hosts"
    hide-actions
    tabindex="0"
    @keydown.native="onKeyDown"
    @click.native="onClick"
    @contextmenu.native.stop="onContextMenu"
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <explorer-child-table-header-row :headers="props.headers" />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <explorer-child-table-row
        :ref="`row-${props.item.id}`"
        :host="props.item"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ExplorerChildTableHeaderRow from './ExplorerChildTableHeaderRow'
import ExplorerChildTableRow from './ExplorerChildTableRow'
import * as ContextMenu from '~/utils/context-menu'

export default {
  components: {
    ExplorerChildTableHeaderRow,
    ExplorerChildTableRow
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
          text: 'IP',
          value: 'ip'
        },
        {
          text: 'Host',
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
      selectedHostId: state => state.explorer.child.selectedHostId,
      scrollTop: state => state.explorer.child.scrollTop
    }),
    ...mapGetters({
      hosts: 'explorer/child/filteredHosts',
      selectedHostIndex: 'explorer/child/selectedHostIndex',
      canPasteHost: 'explorer/child/canPasteHost'
    })
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
          offsetTop: rowHeight * (index + 1),
          offsetHeight: rowHeight
        }
        const table = {
          scrollTop: this.container.scrollTop,
          offsetHeight: this.container.offsetHeight
        }
        if (el.offsetTop - el.offsetHeight < table.scrollTop) {
          this.container.scrollTop = el.offsetTop - el.offsetHeight
        } else if (el.offsetTop + headerHeight > table.scrollTop + table.offsetHeight) {
          this.container.scrollTop = el.offsetTop + headerHeight - table.offsetHeight
        }
      })
    }
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
    onKeyDown (e) {
      switch (e.keyCode) {
        case 8:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.deleteHost()
          }
          break
        case 13:
          e.preventDefault()
          this.focusSelectedRow()
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstHost()
          } else {
            this.selectPreviousHost()
          }
          break
        case 40:
          e.preventDefault()
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
            e.preventDefault()
            this.copyHost()
          }
          break
        case 78:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.createHost()
          }
          break
        case 86:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.pasteHost()
          }
          break
      }
    },
    onClick () {
      this.unselectHost()
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
    ...mapMutations({
      setScrollTop: 'explorer/child/setScrollTop'
    }),
    ...mapActions({
      createHost: 'explorer/child/createHost',
      deleteHost: 'explorer/child/deleteHost',
      copyHost: 'explorer/child/copyHost',
      pasteHost: 'explorer/child/pasteHost',
      unselectHost: 'explorer/child/unselectHost',
      selectFirstHost: 'explorer/child/selectFirstHost',
      selectLastHost: 'explorer/child/selectLastHost',
      selectPreviousHost: 'explorer/child/selectPreviousHost',
      selectNextHost: 'explorer/child/selectNextHost'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-child-table {
  outline: none;
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
