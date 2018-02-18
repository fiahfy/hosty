<template>
  <div class="group-list" :class="classes">
    <mdc-table
      tabindex="0"
      @keydown="keydown"
    >
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
            <span>Group</span>
            <mdc-icon
              :icon="icon"
              v-if="sortOption.key === 'name'"
            />
          </mdc-table-header-column>
        </mdc-table-row>
        <mdc-table-row class="shadow">
          <mdc-table-header-column colspan="2" />
        </mdc-table-row>
      </mdc-table-header>
      <mdc-table-body >
        <group-list-item
          ref="item"
          :key="group.id"
          :group="group"
          :selected="isSelected({ id: group.id })"
          @click="select({ id: group.id })"
          v-for="group in groups"
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
  mounted () {
    this.$el.addEventListener('scroll', this.scroll)
    this.$nextTick(() => {
      this.$el.scrollTop = this.scrollTop
    })
  },
  beforeDestroy () {
    this.$el.removeEventListener('scroll', this.scroll)
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
  methods: {
    scroll () {
      const scrollTop = this.$el.scrollTop
      this.scrolling = scrollTop > 0
      this.setScrollTop({ scrollTop })
    },
    keydown (e) {
      if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
        return
      }
      switch (e.keyCode) {
        case 8:
          e.preventDefault()
          this.delete()
          break
        case 13:
          e.preventDefault()
          this.$refs.item[this.selectedIndex].focus()
          break
        case 38:
          e.preventDefault()
          this.selectPrevious()
          break
        case 40:
          e.preventDefault()
          this.selectNext()
          break
      }
    },
    click (e, sortKey) {
      this.changeSortKey({ sortKey })
      this.$nextTick(() => {
        this.$el.scrollTop = 0
      })
    },
    ...mapMutations({
      setScrollTop: 'explorer/group/setScrollTop'
    }),
    ...mapActions({
      delete: 'explorer/group/delete',
      select: 'explorer/group/select',
      selectPrevious: 'explorer/group/selectPrevious',
      selectNext: 'explorer/group/selectNext',
      changeSortKey: 'explorer/group/changeSortKey'
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
  }
}
</script>

<style scoped lang="scss">
.group-list {
  height: 100%;
  overflow-y: scroll;
  .mdc-table {
    outline: none;
    table-layout: fixed;
    .mdc-table-header {
      .mdc-table-row {
        height: 40px;
        .mdc-table-header-column {
          border: 0;
          line-height: 20px;
          position: sticky;
          top: 0;
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
    .mdc-table-row {
      cursor: pointer;
      height: 41px;
    }
  }
  &.scrolling .mdc-table-row.shadow .mdc-table-header-column:after {
    box-shadow: 0 0 3px 1px var(--shadow);
  }
}
</style>
