<template>
  <mdc-table-body>
    <mdc-table-row :style="`height: ${offsetTop}px;`" />
    <slot v-for="(item, index) in renderItems" :item="item" :index="index + offset" />
    <mdc-table-row :style="`height: ${offsetBottom}px;`" />
  </mdc-table-body>
</template>

<script>
import MdcTableBody from '../components/MdcTableBody'
import MdcTableRow from '../components/MdcTableRow'

export default {
  props: {
    items: {
      type: Array
    },
    estimatedHeight: {
      type: Number
    }
  },
  components: {
    MdcTableBody,
    MdcTableRow
  },
  mounted () {
    this.container = this.$el.parentNode.parentNode
    this.container.addEventListener('scroll', this.scroll)
    window.addEventListener('resize', this.scroll)
    this.scroll()
  },
  beforeDestory () {
    this.container.removeEventListener('scroll', this.scroll)
    window.removeEventListener('resize', this.scroll)
  },
  data () {
    return {
      container: null,
      offset: 0,
      offsetTop: 0,
      offsetBottom: 0,
      renderItems: []
    }
  },
  methods: {
    scroll () {
      const top = this.container.scrollTop
      const offset = Math.ceil(this.container.offsetHeight / this.estimatedHeight)
      const startIndex = Math.max(0, Math.floor(top / this.estimatedHeight))
      const endIndex = Math.min(startIndex + offset, this.items.length)
      this.offset = startIndex
      this.offsetTop = startIndex * this.estimatedHeight
      this.offsetBottom = (this.items.length - endIndex) * this.estimatedHeight
      this.renderItems = this.items.slice(startIndex, endIndex)
    }
  },
  watch: {
    items () {
      this.scroll()
    }
  }
}
</script>

<style scoped>
.mdc-table-row {
  border: none;
  margin: 0;
  padding: 0;
}
</style>
