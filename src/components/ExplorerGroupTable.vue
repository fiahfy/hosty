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
    tabindex="0"
    @keydown.native="onKeyDown"
    @click.native="onClick"
    @contextmenu.native="onContextMenu"
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
        :ref="`row-${props.item.id}`"
        :active="isSelected({ id: props.item.id })"
        :item="props.item"
        @click.native.stop="(e) => onClick(e, { id: props.item.id })"
        @contextmenu.native.stop="(e) => onContextMenu(e, { id: props.item.id })"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ExplorerGroupTableHeaderRow from './ExplorerGroupTableHeaderRow'
import ExplorerGroupTableRow from './ExplorerGroupTableRow'
import * as ContextMenu from '~/utils/context-menu'

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
      selectedId: state => state.app.explorer.group.selectedId,
      scrollTop: state => state.app.explorer.group.scrollTop
    }),
    ...mapGetters({
      items: 'app/explorer/group/items',
      selectedIndex: 'app/explorer/group/selectedIndex',
      isSelected: 'app/explorer/group/isSelected'
    })
  },
  watch: {
    selectedId () {
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
            this.delete()
          }
          break
        case 13:
          e.preventDefault()
          this.focusSelectedRow()
          break
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
        case 67:
          if (getSelection().toString()) {
            break
          }
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.copy()
          }
          break
        case 78:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.create()
          }
          break
        case 86:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.paste()
          }
          break
      }
    },
    onClick (e, { id } = { id: 0 }) {
      this.select({ id })
    },
    onContextMenu (e, { id } = { id: 0 }) {
      this.select({ id })
      let templates = [
        {
          label: 'New Group',
          click: this.create,
          accelerator: 'CmdOrCtrl+N'
        }
      ]
      if (id) {
        templates = [
          ...templates,
          {
            label: 'Copy',
            click: this.copy,
            accelerator: 'CmdOrCtrl+C'
          }
        ]
      }
      templates = [
        ...templates,
        {
          label: 'Paste',
          click: this.paste,
          accelerator: 'CmdOrCtrl+V'
        }
      ]
      if (id) {
        templates = [
          ...templates,
          { type: 'separator' },
          {
            label: 'Edit',
            click: this.focusSelectedRow,
            accelerator: 'Enter'
          },
          {
            label: 'Delete',
            click: this.delete,
            accelerator: 'CmdOrCtrl+Backspace'
          }
        ]
      }
      ContextMenu.show(e, templates)
    },
    focusSelectedRow () {
      this.$refs[`row-${this.selectedId}`].focus()
    },
    ...mapMutations({
      setScrollTop: 'app/explorer/group/setScrollTop'
    }),
    ...mapActions({
      create: 'app/explorer/group/create',
      delete: 'app/explorer/group/delete',
      copy: 'app/explorer/group/copy',
      paste: 'app/explorer/group/paste',
      select: 'app/explorer/group/select',
      selectFirst: 'app/explorer/group/selectFirst',
      selectLast: 'app/explorer/group/selectLast',
      selectPrevious: 'app/explorer/group/selectPrevious',
      selectNext: 'app/explorer/group/selectNext'
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
