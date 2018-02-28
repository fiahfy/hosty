<template>
  <div
    :class="classes"
    class="preview-list"
  >
    <mdc-table>
      <mdc-table-header>
        <mdc-table-row>
          <mdc-table-header-column class="icon" />
          <mdc-table-header-column
            :style="ipStyles"
            class="ip"
          />
          <mdc-table-header-column class="name" />
        </mdc-table-row>
        <mdc-table-row class="shadow">
          <mdc-table-header-column colspan="3" />
        </mdc-table-row>
      </mdc-table-header>
      <mdc-table-body >
        <preview-list-item
          v-for="(host, index) in hosts"
          :key="host.id + '-' + index"
          :host="host"
        />
      </mdc-table-body>
    </mdc-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import PreviewListItem from './PreviewListItem'
import MdcIcon from './MdcIcon'
import MdcTable from './MdcTable'
import MdcTableHeader from './MdcTableHeader'
import MdcTableHeaderColumn from './MdcTableHeaderColumn'
import MdcTableBody from './MdcTableBody'
import MdcTableRow from './MdcTableRow'

export default {
  components: {
    MdcIcon,
    MdcTable,
    MdcTableBody,
    MdcTableHeader,
    MdcTableHeaderColumn,
    MdcTableRow,
    PreviewListItem
  },
  data () {
    return {
      scrolling: false,
      ipWidth: 0
    }
  },
  computed: {
    classes () {
      return {
        scrolling: this.scrolling
      }
    },
    ipStyles () {
      return {
        width: this.ipWidth ? `${this.ipWidth}px` : null
      }
    },
    ...mapState({
      scrollTop: state => state.preview.scrollTop
    }),
    ...mapGetters({
      hosts: 'preview/hosts'
    })
  },
  mounted () {
    this.$el.addEventListener('scroll', this.scroll)
    this.$nextTick(() => {
      this.$el.scrollTop = this.scrollTop
      this.ipWidth = Math.max.apply(null, Array.from(
        this.$el.querySelectorAll('.preview-list-item span')
      ).map((item) => item.offsetWidth)) + 16
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
    ...mapMutations({
      setScrollTop: 'preview/setScrollTop'
    }),
    ...mapActions({
    })
  }
}
</script>

<style scoped lang="scss">
.preview-list {
  height: 100%;
  overflow-y: scroll;
  .mdc-table {
    border-spacing: 0;
    table-layout: fixed;
    width: 100%;
    .mdc-table-header {
      .mdc-table-row {
        height: 0;
        .mdc-table-header-column {
          &.icon {
            width: 44px;
          }
        }
        &.shadow {
          .mdc-table-header-column {
            padding: 0;
            position: sticky;
            top: 0;
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
