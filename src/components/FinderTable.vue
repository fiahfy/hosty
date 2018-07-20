<template>
  <v-data-table
    ref="table"
    :headers="headers"
    :items="filteredItems"
    :disable-initial-sort="true"
    :class="classes"
    class="finder-table"
    item-key="id"
    no-data-text="No results"
    hide-actions
    tabindex="0"
    @keydown.native="onKeyDown"
    @click.native="onClick"
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <finder-table-header-row :headers="props.headers" />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <finder-table-row
        :ref="`row-${props.item.id}`"
        :item="props.item"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import FinderTableHeaderRow from './FinderTableHeaderRow'
import FinderTableRow from './FinderTableRow'

export default {
  components: {
    FinderTableHeaderRow,
    FinderTableRow
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
          value: 'group'
        },
        {
          text: 'IP',
          value: 'ip'
        },
        {
          text: 'Host',
          value: 'host'
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
    ...mapState('local/finder', [
      'selectedItemId',
      'scrollTop'
    ]),
    ...mapGetters('local/finder', [
      'filteredItems',
      'selectedItemIndex'
    ])
  },
  watch: {
    selectedItemIndex (value) {
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
    this.loadItems()
    this.container = this.$el.querySelector('.v-table__overflow')
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
        case 13:
          e.preventDefault()
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstItem()
          } else {
            this.selectPreviousItem()
          }
          break
        case 40:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastItem()
          } else {
            this.selectNextItem()
          }
          break
      }
    },
    onClick () {
      this.unselectItem()
    },
    ...mapMutations('local/finder/', [
      'setScrollTop'
    ]),
    ...mapActions('local/finder/', [
      'loadItems',
      'unselectItem',
      'selectFirstItem',
      'selectLastItem',
      'selectPreviousItem',
      'selectNextItem'
    ])
  }
}
</script>

<style scoped lang="scss">
.finder-table {
  outline: none;
  & /deep/ .v-table__overflow {
    height: 100%;
    overflow-y: scroll;
    .v-datatable {
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
          &.v-datatable__progress>th {
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
  &.scrolling /deep/ .v-datatable>thead>tr {
    border-bottom: none;
    &.v-datatable__progress>th:after {
      height: 10px;
    }
  }
}
</style>
