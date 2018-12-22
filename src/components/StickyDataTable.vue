<template>
  <v-data-table
    ref="table"
    v-model="model"
    v-resize="onResize"
    v-bind="$attrs"
    :pagination.sync="paginationModel"
    :items="items"
    :class="classes"
    :disable-initial-sort="true"
    class="sticky-data-table"
  >
    <template slot="headers" slot-scope="props">
      <slot v-bind="props" name="headers" />
    </template>
    <template slot="items" slot-scope="props">
      <slot v-bind="props" name="items" />
    </template>
    <slot slot="progress" name="progress" />
    <slot slot="no-data" name="no-data" />
    <slot slot="no-results" name="no-results" />
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
    }
  },
  data() {
    return {
      scrolling: false
    }
  },
  computed: {
    paginationModel: {
      get() {
        return this.pagination
      },
      set(value) {
        this.$emit('update:pagination', value)
      }
    },
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    classes() {
      return {
        scrolling: this.scrolling
      }
    }
  },
  watch: {
    items() {
      this.adjustItems()
    }
  },
  mounted() {
    this.container = this.$el.querySelector('.v-table__overflow')
    this.container.addEventListener('scroll', this.onScroll)
    this.adjustItems()
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    getScrollTop() {
      return this.container.scrollTop
    },
    setScrollTop(value) {
      this.container.scrollTop = value
    },
    getOffsetHeight() {
      return this.container.offsetHeight
    },
    adjustItems() {
      if (!this.container) {
        return
      }
      const { scrollTop } = this.container
      this.scrolling = scrollTop > 0
    },
    onResize() {
      this.adjustItems()
    },
    onScroll(e) {
      this.adjustItems()
      this.$emit('scroll', e)
    }
  }
}
</script>

<style scoped lang="scss">
.sticky-data-table {
  /deep/ .v-table__overflow {
    height: 100%;
    overflow-y: scroll;
    .v-datatable {
      table-layout: fixed;
      > thead {
        background: inherit;
        > tr {
          background: inherit;
          > th {
            background: inherit;
            position: sticky;
            top: 0;
            z-index: 1;
          }
          &.v-datatable__progress > th {
            top: 56px;
            z-index: 0;
            &:after {
              bottom: 0;
              box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
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
  &.scrolling /deep/ .v-datatable > thead > tr {
    border-bottom: none;
    &.v-datatable__progress > th:after {
      height: 10px;
    }
  }
}
</style>
