<template>
  <div
    class="host-list"
    tabindex="0"
    :class="classes"
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
              :icon="icon"
              v-if="sortOption.key === 'disabled'"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="name"
            @click="e => click(e, 'name')"
          >
            <span>Host</span>
            <mdc-icon
              :icon="icon"
              v-if="sortOption.key === 'name'"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="ip"
            @click="e => click(e, 'ip')"
          >
            <span>IP</span>
            <mdc-icon
              :icon="icon"
              v-if="sortOption.key === 'ip'"
            />
          </mdc-table-header-column>
        </mdc-table-row>
        <mdc-table-row class="shadow">
          <mdc-table-header-column colspan="3" />
        </mdc-table-row>
      </mdc-table-header>
      <mdc-table-body >
        <host-list-item
          :ref="`item_${host.id}`"
          :key="`${selectedGroupId}_${host.id}`"
          :host="host"
          :selected="isSelected({ id: host.id })"
          @click="select({ id: host.id })"
          v-for="host in hosts"
        />
      </mdc-table-body>
    </mdc-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import HostListItem from './HostListItem'
import MdcIcon from './MdcIcon'
import MdcTable from './MdcTable'
import MdcTableBody from './MdcTableBody'
import MdcTableHeader from './MdcTableHeader'
import MdcTableHeaderColumn from './MdcTableHeaderColumn'
import MdcTableRow from './MdcTableRow'

export default {
  components: {
    HostListItem,
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
      selectedId: state => state.explorer.host.selectedId,
      scrollTop: state => state.explorer.host.scrollTop,
      sortOption: state => state.explorer.host.sortOption
    }),
    ...mapGetters({
      hosts: 'explorer/host/hosts',
      selectedIndex: 'explorer/host/selectedIndex',
      isSelected: 'explorer/host/isSelected',
      selectedGroupId: 'explorer/host/selectedGroupId'
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
          e.preventDefault()
          this.delete()
          break
        case 13:
          e.preventDefault()
          this.focusSelectedItem()
          break
        case 37:
          e.preventDefault()
          this.leaveList()
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
        case 78:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.create()
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
    focusSelectedItem () {
      this.$refs[`item_${this.selectedId}`][0].focus()
    },
    ...mapMutations({
      setScrollTop: 'explorer/host/setScrollTop'
    }),
    ...mapActions({
      create: 'explorer/host/create',
      delete: 'explorer/host/delete',
      select: 'explorer/host/select',
      selectFirst: 'explorer/host/selectFirst',
      selectLast: 'explorer/host/selectLast',
      selectPrevious: 'explorer/host/selectPrevious',
      selectNext: 'explorer/host/selectNext',
      changeSortKey: 'explorer/host/changeSortKey',
      leaveList: 'explorer/host/leaveList'
    })
  }
}
</script>

<style scoped lang="scss">
.host-list {
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
