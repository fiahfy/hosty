<template>
  <mdc-table-row
    v-bind="$attrs"
    class="preview-list-item"
    v-on="$listeners"
  >
    <mdc-table-column class="icon">
      <mdc-button
        title="Edit"
        @click="click"
      >
        <mdc-icon
          slot="icon"
          icon="edit"
          class="mdc-button__icon"
        />
      </mdc-button>
    </mdc-table-column>
    <mdc-table-column class="ip">
      <span ref="shrink">{{ host.ip }}</span>
    </mdc-table-column>
    <mdc-table-column class="name">
      <span>{{ host.name }}</span>
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import { mapActions } from 'vuex'
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
  },
  methods: {
    click () {
      this.edit({ groupId: this.host.groupId, hostId: this.host.hostId })
    },
    getShrinkedWidth () {
      return this.$refs.shrink.offsetWidth
    },
    ...mapActions({
      edit: 'preview/edit'
    })
  }
}
</script>

<style scoped lang="scss">
.preview-list-item {
  height: 24px;
  .mdc-table-column {
    color: var(--mdc-theme-text-primary-on-background);
    line-height: 21px;
    overflow: hidden;
    padding: 4px 8px 2px 8px;
    text-overflow: ellipsis;
    vertical-align: bottom;
    white-space: nowrap;
    .mdc-button {
      height: 27px;
      min-width: 27px;
      padding: 0;
      .mdc-icon {
        font-size: 18px;
        height: auto;
        line-height: 27px;
        margin: 0;
        padding: 0;
        width: auto;
      }
    }
    &.icon {
      padding: 0;
      .mdc-button {
        visibility: hidden;
      }
    }
  }
  &:hover .mdc-table-column {
    background-color: var(--hover);
      .mdc-button {
        visibility: visible;
      }
  }
}
</style>
