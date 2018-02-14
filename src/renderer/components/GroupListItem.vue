<template>
  <mdc-table-row class="group-list-item" :selected="selected" v-bind="$attrs" v-on="$listeners">
    <mdc-table-column class="status">
      {{ group.id }}
    </mdc-table-column>
    <mdc-table-column class="name">
      {{ group.name }}
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import MdcIcon from './MdcIcon'
import MdcTableColumn from './MdcTableColumn'
import MdcTableRow from './MdcTableRow'

export default {
  props: {
    group: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MdcIcon,
    MdcTableColumn,
    MdcTableRow
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
.mdc-table-column {
  line-height: 20px;
  vertical-align: bottom;
  white-space: nowrap;
}
</style>
