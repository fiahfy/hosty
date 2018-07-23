<template>
  <v-data-table
    ref="table"
    v-bind="$attrs"
    v-model="model"
    :pagination.sync="paginationModel"
    :items="renderItems"
    :class="classes"
    :disable-initial-sort="true"
    class="virtual-data-table"
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <slot
        v-bind="props"
        name="headers"
      />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <tr
        v-if="props.index === 0"
        :style="{ height: `${padding.top}px` }"
      />
      <slot
        v-bind="props"
        name="items"
      />
      <tr
        v-if="props.index === renderItems.length - 1"
        :style="{ height: `${padding.bottom}px` }"
      />
    </template>
    <template slot="no-data">
      <slot name="no-data" />
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    stickyHeaders: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      estimatedHeight: 48,
      threshold: 1024,
      scrolling: false,
      padding: {
        top: 0,
        bottom: 0
      },
      renderItems: []
    }
  },
  computed: {
    paginationModel: {
      get () {
        return this.pagination
      },
      set (value) {
        this.$emit('update:pagination', value)
      }
    },
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    classes () {
      return {
        'sticky-headers': this.stickyHeaders,
        scrolling: this.scrolling
      }
    }
  },
  watch: {
    items () {
      this.adjustItems()
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.container = this.$el.querySelector('.v-table__overflow')
    this.container.addEventListener('scroll', this.onScroll)
    this.$nextTick(() => {
      this.adjustItems()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    this.container.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    getScrollTop () {
      return this.container.scrollTop
    },
    setScrollTop (value) {
      this.$nextTick(() => {
        this.container.scrollTop = value
      })
    },
    getOffsetHeight () {
      return this.container.offsetHeight
    },
    adjustItems () {
      const { scrollTop, offsetHeight } = this.container
      const offset = Math.ceil(offsetHeight / this.estimatedHeight)
      const thresholdOffset = Math.ceil(this.threshold / this.estimatedHeight)

      const firstIndex = Math.max(0, Math.floor(scrollTop / this.estimatedHeight) - thresholdOffset)
      const lastIndex = Math.min(firstIndex + offset + thresholdOffset * 2, this.items.length)

      this.scrolling = scrollTop > 0
      this.padding = {
        top: firstIndex * this.estimatedHeight,
        bottom: (this.items.length - lastIndex) * this.estimatedHeight
      }
      this.renderItems = this.items.slice(firstIndex, lastIndex)
    },
    onResize () {
      this.adjustItems()
    },
    onScroll (e) {
      this.adjustItems()
      this.$emit('scroll', e)
    }
  }
}
</script>

<style lang="scss">
.theme--dark .virtual-data-table.sticky-headers .v-table__overflow::-webkit-scrollbar-thumb {
  background-color: #424242!important;
  &:hover {
    background-color: #505050!important;
  }
  &:active {
    background-color: #616161!important;
  }
}
</style>

<style scoped lang="scss">
.virtual-data-table.sticky-headers {
  & /deep/ .v-table__overflow {
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 14px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #eee;
      &:hover {
        background-color: #ddd;
      }
      &:active {
        background-color: #ccc;
      }
    }
    .v-datatable>thead {
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
  &.scrolling /deep/ .v-datatable>thead>tr {
    border-bottom: none;
    &.v-datatable__progress>th:after {
      height: 10px;
    }
  }
}
</style>
