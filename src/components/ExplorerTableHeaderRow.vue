<template>
  <tr class="explorer-table-header-row">
    <th
      v-for="header in headers"
      :key="header.text"
      :class="getClass(header)"
      :style="getStyle(header)"
      @click="(e) => onHeaderClick(e, header)"
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
    ...mapState('local/explorer', ['order'])
  },
  methods: {
    getClass(header) {
      return [
        'column sortable px-0',
        this.order.descending ? 'desc' : 'asc',
        header.value === this.order.by ? 'active' : ''
      ]
    },
    getStyle(header) {
      return {
        'box-sizing': 'content-box',
        width: header.width ? `${header.width}px` : null
      }
    },
    onHeaderClick(e, header) {
      this.changeOrderBy({ orderBy: header.value })
    },
    ...mapActions('local/explorer', ['changeOrderBy'])
  }
}
</script>
