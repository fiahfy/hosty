<template>
  <div
    :class="classes"
    class="group-list"
    tabindex="0"
    @keydown="keydown"
  >
    <mdc-table>
      <mdc-table-header>
        <mdc-table-row>
          <mdc-table-header-column
            class="status"
            @click="e => click(e, 'disabled')"
          >
            <span>Status</span>
            <mdc-icon
              v-if="sortOption.key === 'disabled'"
              :icon="icon"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="name"
            @click="e => click(e, 'name')"
          >
            <span>Group</span>
            <mdc-icon
              v-if="sortOption.key === 'name'"
              :icon="icon"
            />
          </mdc-table-header-column>
        </mdc-table-row>
        <mdc-table-row class="shadow">
          <mdc-table-header-column colspan="2" />
        </mdc-table-row>
      </mdc-table-header>
      <mdc-table-body >
        <group-list-item
          v-for="group in groups"
          :ref="`item_${group.id}`"
          :key="group.id"
          :group="group"
          :selected="isSelected({ id: group.id })"
          @click="select({ id: group.id })"
          @contextmenu="(e) => contextmenu(e, { id: group.id })"
        />
      </mdc-table-body>
    </mdc-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import GroupListItem from './GroupListItem'
import MdcIcon from './MdcIcon'
import MdcTable from './MdcTable'
import MdcTableBody from './MdcTableBody'
import MdcTableHeader from './MdcTableHeader'
import MdcTableHeaderColumn from './MdcTableHeaderColumn'
import MdcTableRow from './MdcTableRow'
import * as ContextMenu from '../utils/context-menu'

export default {
  components: {
    GroupListItem,
    MdcIcon,
    MdcTable,
    MdcTableBody,
    MdcTableHeader,
    MdcTableHeaderColumn,
    MdcTableRow
  },
  data () {
    return {
      scrolling: false
    }
  },
  computed: {
    classes () {
      return {
        scrolling: this.scrolling
      }
    },
    icon () {
      return this.sortOption.order === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'
    },
    ...mapState({
      selectedId: state => state.explorer.group.selectedId,
      scrollTop: state => state.explorer.group.scrollTop,
      sortOption: state => state.explorer.group.sortOption
    }),
    ...mapGetters({
      groups: 'explorer/group/groups',
      selectedIndex: 'explorer/group/selectedIndex',
      isSelected: 'explorer/group/isSelected'
    })
  },
  watch: {
    selectedId () {
      this.$nextTick(() => {
        const index = this.selectedIndex
        if (index === -1) {
          return
        }
        const rowHeight = 41
        const offsetHeight = 41
        const el = {
          offsetTop: rowHeight * index + offsetHeight,
          offsetHeight: rowHeight
        }
        if (el.offsetTop - el.offsetHeight < this.$el.scrollTop) {
          this.$el.scrollTop = el.offsetTop - el.offsetHeight
        } else if (el.offsetTop + el.offsetHeight > this.$el.scrollTop + this.$el.offsetHeight) {
          this.$el.scrollTop = el.offsetTop + el.offsetHeight - this.$el.offsetHeight
        }
      })
    }
  },
  mounted () {
    this.$el.addEventListener('scroll', this.scroll)
    this.$nextTick(() => {
      this.$el.scrollTop = this.scrollTop
    })
    this.selectIndex({ index: 0 })
  },
  beforeDestroy () {
    this.$el.removeEventListener('scroll', this.scroll)
  },
  methods: {
    scroll () {
      const scrollTop = this.$el.scrollTop
      this.scrolling = scrollTop > 0
      this.setScrollTop({ scrollTop })
    },
    keydown (e) {
      switch (e.keyCode) {
        case 8:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.delete()
          }
          break
        case 13:
          e.preventDefault()
          this.focusSelectedItem()
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirst()
          } else {
            this.selectPrevious()
          }
          break
        case 39:
          e.preventDefault()
          this.enterHostList()
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
    click (e, sortKey) {
      this.changeSortKey({ sortKey })
      this.$nextTick(() => {
        this.$el.scrollTop = 0
      })
    },
    contextmenu (e, { id }) {
      this.select({ id })
      ContextMenu.show(e, [
        {
          label: 'New Group',
          click: this.create,
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Copy',
          click: this.copy,
          accelerator: 'CmdOrCtrl+C'
        },
        {
          label: 'Paste',
          click: this.paste,
          accelerator: 'CmdOrCtrl+V'
        },
        { type: 'separator' },
        {
          label: 'Edit',
          click: this.focusSelectedItem,
          accelerator: 'Enter'
        },
        {
          label: 'Delete',
          click: this.delete,
          accelerator: 'CmdOrCtrl+Backspace'
        }
      ])
    },
    focusSelectedItem () {
      this.$refs[`item_${this.selectedId}`][0].focus()
    },
    ...mapMutations({
      setScrollTop: 'explorer/group/setScrollTop'
    }),
    ...mapActions({
      create: 'explorer/group/create',
      delete: 'explorer/group/delete',
      copy: 'explorer/group/copy',
      paste: 'explorer/group/paste',
      select: 'explorer/group/select',
      selectIndex: 'explorer/group/selectIndex',
      selectFirst: 'explorer/group/selectFirst',
      selectLast: 'explorer/group/selectLast',
      selectPrevious: 'explorer/group/selectPrevious',
      selectNext: 'explorer/group/selectNext',
      changeSortKey: 'explorer/group/changeSortKey',
      enterHostList: 'explorer/host/enterList'
    })
  }
}
</script>

<style scoped lang="scss">
.group-list {
  height: 100%;
  overflow-y: scroll;
  .mdc-table {
    border-spacing: 0;
    outline: none;
    table-layout: fixed;
    width: 100%;
    .mdc-table-header {
      .mdc-table-row {
        cursor: pointer;
        height: 40px;
        .mdc-table-header-column {
          border: 0;
          color: var(--mdc-theme-text-secondary-on-background);
          font-size: smaller;
          font-weight: normal;
          line-height: 20px;
          padding: 8px;
          position: sticky;
          top: 0;
          user-select: none;
          vertical-align: bottom;
          white-space: nowrap;
          z-index: 1;
          &.status {
            width: 44px;
          }
          .mdc-icon {
            padding: 0;
            vertical-align: bottom;
          }
        }
        &.shadow {
          height: 0;
          .mdc-table-header-column {
            padding: 0;
            position: sticky;
            top: 40px;
            z-index: 0;
            &:after {
              bottom: 0;
              content:'';
              left: 0;
              position: absolute;
              width: 100%;
            }
          }
        }
      }
    }
  }
  &.scrolling .mdc-table-row.shadow .mdc-table-header-column:after {
    box-shadow: 0 0 3px 1px var(--shadow);
  }
}
</style>
