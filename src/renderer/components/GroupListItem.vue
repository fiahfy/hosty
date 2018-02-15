<template>
  <mdc-table-row class="group-list-item" :selected="selected" v-bind="$attrs" v-on="$listeners">
    <mdc-table-column class="status">
      <mdc-button
          title="Toggle status"
          @click="statusClick"
        >
        <mdc-icon slot="icon" :icon="icon" />
      </mdc-button>
    </mdc-table-column>
    <mdc-table-column class="name" @click="nameClick">
      <mdc-text-field ref="name" :disabled="disabled" v-model="name" @blur="nameBlur" @keydown="nameKeydown" />
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import { mapActions } from 'vuex'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'
import MdcTableColumn from './MdcTableColumn'
import MdcTableRow from './MdcTableRow'
import MdcTextField from './MdcTextField'

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
    MdcButton,
    MdcIcon,
    MdcTableColumn,
    MdcTableRow,
    MdcTextField
  },
  data () {
    return {
      disabled: true
    }
  },
  computed: {
    icon () {
      return this.group.disabled ? 'block' : 'check'
    },
    name: {
      get () {
        return this.group.name
      },
      set (value) {
        this.updateGroup({ id: this.group.id, params: { name: value } })
      }
    }
  },
  methods: {
    statusClick () {
      this.updateGroup({ id: this.group.id, params: { disabled: !this.group.disabled } })
    },
    nameClick () {
      this.disabled = !this.selected
      this.$nextTick(() => {
        this.$refs.name.$el.querySelector('input').focus()
      })
    },
    nameBlur () {
      this.disabled = true
    },
    nameKeydown (e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        this.$refs.name.$el.querySelector('input').blur()
      }
    },
    ...mapActions({
      updateGroup: 'group/updateGroup'
    })
  }
}
</script>

<style scoped lang="scss">
.group-list-item .mdc-table-column {
  line-height: 20px;
  padding: 4px;
  vertical-align: bottom;
  white-space: nowrap;
  &.status {
    text-align: center;
  }
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
  .mdc-text-field {
    height: auto!important;
    margin: 0;
    padding-top: 8px;
  }
}
</style>
