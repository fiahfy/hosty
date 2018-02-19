<template>
  <mdc-table-row
    class="group-list-item"
    :selected="selected"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <mdc-table-column class="status">
      <mdc-button
        title="Toggle status"
        tabindex="-1"
        @click="statusClick"
      >
        <mdc-icon
          slot="icon"
          :icon="icon"
          :class="classes"
        />
      </mdc-button>
    </mdc-table-column>
    <mdc-table-column
      class="name"
      @click="nameClick"
    >
      <mdc-text-field
        ref="name"
        fullwidth
        label="Group"
        :disabled="disabled"
        v-model="name"
        @blur="nameBlur"
        @keydown="nameKeydown"
      />
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
  mounted () {
    this.nameInput = this.$refs.name.$el.querySelector('input')
  },
  computed: {
    icon () {
      return this.group.disabled ? 'block' : 'check'
    },
    classes () {
      return [
        'mdc-button__icon',
        this.icon
      ]
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
    focus () {
      this.nameClick()
    },
    statusClick () {
      this.updateGroup({ id: this.group.id, params: { disabled: !this.group.disabled } })
    },
    nameClick () {
      if (!this.disabled || !this.selected) {
        return
      }
      this.disabled = false
      this.$nextTick(() => {
        this.nameInput.focus()
        this.nameInput.selectionStart = 0
        this.nameInput.selectionEnd = this.nameInput.value.length
      })
    },
    nameBlur () {
      this.disabled = true
    },
    nameKeydown (e) {
      e.stopPropagation()
      if (e.keyCode === 13) {
        e.preventDefault()
        this.nameInput.blur()
        this.focusGroupList()
      }
    },
    ...mapActions({
      focusGroupList: 'focusGroupList',
      updateGroup: 'group/updateGroup'
    })
  }
}
</script>

<style scoped lang="scss">
.group-list-item .mdc-table-column {
  line-height: 20px;
  padding: 2px 8px;
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
      &.block {
        color: var(--mdc-theme-text-icon-on-background);
      }
    }
  }
  .mdc-text-field {
    border: 0;
    height: 32px;
    margin: 0 0 2px;
    & /deep/ input:disabled {
      color: var(--mdc-theme-text-primary-on-background);
    }
  }
}
</style>
