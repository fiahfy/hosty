<template>
  <mdc-table-row
    :class="classes"
    v-bind="$attrs"
    class="group-list-item"
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
          :class="iconClasses"
        />
      </mdc-button>
    </mdc-table-column>
    <mdc-table-column
      class="name"
      @click="nameClick"
    >
      <mdc-text-field
        ref="name"
        :disabled="disabled"
        v-model="name"
        fullwidth
        label="Group"
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
  components: {
    MdcButton,
    MdcIcon,
    MdcTableColumn,
    MdcTableRow,
    MdcTextField
  },
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
  data () {
    return {
      name: this.group.name,
      disabled: true
    }
  },
  computed: {
    classes () {
      return {
        selected: this.selected
      }
    },
    icon () {
      return this.group.disabled ? 'block' : 'check'
    },
    iconClasses () {
      return [
        'mdc-button__icon',
        this.icon
      ]
    }
  },
  mounted () {
    this.nameInput = this.$refs.name.$el.querySelector('input')
  },
  methods: {
    focus () {
      this.nameClick()
    },
    statusClick () {
      this.updateGroup({ id: this.group.id, group: { disabled: !this.group.disabled } })
      this.focusList()
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
      this.updateGroup({ id: this.group.id, group: { name: this.name } })
    },
    nameKeydown (e) {
      e.stopPropagation()
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.nameInput.blur()
          this.focusList()
          break
        case 27:
          e.preventDefault()
          this.name = this.group.name
          this.nameInput.blur()
          this.focusList()
          break
      }
    },
    ...mapActions({
      updateGroup: 'group/updateGroup',
      focusList: 'explorer/group/focusList'
    })
  }
}
</script>

<style scoped lang="scss">
.group-list-item {
  cursor: pointer;
  height: 41px;
  .mdc-table-column {
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
  &:hover .mdc-table-column {
    background-color: var(--hover);
  }
  &.selected .mdc-table-column {
    background-color: var(--selected);
  }
}
.group-list:focus .group-list-item.selected .mdc-table-column {
  background-color: var(--focus);
}
</style>
