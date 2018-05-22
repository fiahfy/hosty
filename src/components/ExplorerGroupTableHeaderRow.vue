<template>
  <tr class="explorer-group-table-header-row">
    <th
      v-for="header in headers"
      :key="header.text"
      :class="getClass(header)"
      :style="getStyle(header)"
      @click="changeOrderBy({ orderBy: header.value })"
    >
      <v-icon small>arrow_upward</v-icon>
      {{ header.text }}
    </th>
  </tr>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      order: state => state.app.explorer.group.order
    })
  },
  methods: {
    getClass (header) {
      return [
        'column sortable px-0',
        this.order.descending ? 'desc' : 'asc',
        header.value === this.order.by ? 'active' : ''
      ]
    },
    getStyle (header) {
      return {
        'box-sizing': 'content-box',
        width: header.width ? `${header.width}px` : null
      }
    },
    ...mapActions({
      changeOrderBy: 'app/explorer/group/changeOrderBy'
    })
  }
}
</script>
