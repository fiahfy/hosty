<template>
  <mdc-table-row
    v-bind="$attrs"
    class="preview-list-item"
    v-on="$listeners"
  >
    <mdc-table-column>
    </mdc-table-column>
    <mdc-table-column class="ip">
      <span>{{ host.ip }}</span>
    </mdc-table-column>
    <mdc-table-column class="name">
      {{ host.name }}
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'
import MdcTableColumn from './MdcTableColumn'
import MdcTableRow from './MdcTableRow'

export default {
  components: {
    MdcButton,
    MdcIcon,
    MdcTableColumn,
    MdcTableRow
  },
  props: {
    host: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.preview-list-item {
  height: 24px;
  .mdc-table-column {
    line-height: 20px;
    overflow: hidden;
    padding: 2px 8px;
    text-overflow: ellipsis;
    vertical-align: bottom;
    white-space: nowrap;
    .mdc-button {
      min-width: 36px;
      padding: 0;
      .mdc-icon {
        font-size: 24px;
        height: auto;
        margin: 0;
        padding: 0;
        width: auto;
      }
    }
  }
  &:hover .mdc-table-column {
    background-color: var(--hover);
  }
}
</style>
