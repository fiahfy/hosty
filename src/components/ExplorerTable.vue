<template>
  <v-data-table
    ref="table"
    :headers="headers"
    :items="groups"
    :disable-initial-sort="true"
    :class="classes"
    class="explorer-table"
    item-key="id"
    no-data-text="No Groups"
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
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ExplorerTableHeaderRow from './ExplorerTableHeaderRow'
import ExplorerTableRow from './ExplorerTableRow'
import * as ContextMenu from '~/utils/context-menu'

export default {
  components: {
    ExplorerTableHeaderRow,
    ExplorerTableRow
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
      selectedGroupId: state => state.explorer.selectedGroupId,
      scrollTop: state => state.explorer.scrollTop
    }),
    ...mapGetters({
      groups: 'explorer/filteredGroups',
      selectedGroupIndex: 'explorer/selectedGroupIndex',
      canPasteGroup: 'explorer/canPasteGroup'
    })
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
    onClick () {
      this.unselectGroup()
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
    ...mapMutations({
      setScrollTop: 'explorer/setScrollTop'
    }),
    ...mapActions({
      createGroup: 'explorer/createGroup',
      deleteGroup: 'explorer/deleteGroup',
      copyGroup: 'explorer/copyGroup',
      pasteGroup: 'explorer/pasteGroup',
      unselectGroup: 'explorer/unselectGroup',
      selectFirstGroup: 'explorer/selectFirstGroup',
      selectLastGroup: 'explorer/selectLastGroup',
      selectPreviousGroup: 'explorer/selectPreviousGroup',
      selectNextGroup: 'explorer/selectNextGroup'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-table {
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
