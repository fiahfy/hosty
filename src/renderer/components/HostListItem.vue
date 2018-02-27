<template>
  <mdc-table-row
    :class="classes"
    v-bind="$attrs"
    class="host-list-item"
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
        :disabled="nameDisabled"
        v-model="name"
        fullwidth
        label="example.com"
        @blur="nameBlur"
        @keydown="nameKeydown"
      />
    </mdc-table-column>
    <mdc-table-column
      class="ip"
      @click="ipClick"
    >
      <mdc-text-field
        ref="ip"
        :disabled="ipDisabled"
        v-model="ip"
        fullwidth
        label="192.0.2.0"
        @blur="ipBlur"
        @keydown="ipKeydown"
      />
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
    host: {
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
      name: this.host.name,
      ip: this.host.ip,
      nameDisabled: true,
      ipDisabled: true
    }
  },
  computed: {
    classes () {
      return {
        selected: this.selected
      }
    },
    icon () {
      return this.host.disabled ? 'block' : 'check'
    },
    iconClasses () {
      return [
        'mdc-button__icon',
        this.icon
      ]
    },
    ...mapState({
      selectedGroupId: state => state.explorer.group.selectedId
    })
  },
  mounted () {
    this.nameInput = this.$refs.name.$el.querySelector('input')
    this.ipInput = this.$refs.ip.$el.querySelector('input')
  },
  methods: {
    focus () {
      this.nameClick()
    },
    statusClick () {
      this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, host: { disabled: !this.host.disabled } })
      this.focusList()
    },
    nameClick () {
      if (!this.nameDisabled || !this.selected) {
        return
      }
      this.nameDisabled = false
      this.$nextTick(() => {
        this.nameInput.focus()
        this.nameInput.selectionStart = 0
        this.nameInput.selectionEnd = this.nameInput.value.length
      })
    },
    nameBlur () {
      this.nameDisabled = true
      this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, host: { name: this.name } })
    },
    nameKeydown (e) {
      e.stopPropagation()
      switch (e.keyCode) {
        case 9:
          e.preventDefault()
          this.ipClick()
          break
        case 13:
          e.preventDefault()
          this.nameInput.blur()
          this.focusList()
          break
        case 27:
          e.preventDefault()
          this.name = this.host.name
          this.nameInput.blur()
          this.focusList()
          break
      }
    },
    ipClick () {
      if (!this.ipDisabled || !this.selected) {
        return
      }
      this.ipDisabled = false
      this.$nextTick(() => {
        this.ipInput.focus()
        this.ipInput.selectionStart = 0
        this.ipInput.selectionEnd = this.ipInput.value.length
      })
    },
    ipBlur () {
      this.ipDisabled = true
      this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, host: { ip: this.ip } })
    },
    ipKeydown (e) {
      e.stopPropagation()
      switch (e.keyCode) {
        case 9:
          if (e.shiftKey) {
            e.preventDefault()
            this.nameClick()
          }
          break
        case 13:
          e.preventDefault()
          this.ipInput.blur()
          this.focusList()
          break
        case 27:
          e.preventDefault()
          this.ip = this.host.ip
          this.ipInput.blur()
          this.focusList()
          break
      }
    },
    ...mapActions({
      updateHost: 'group/updateHost',
      focusList: 'explorer/host/focusList'
    })
  }
}
</script>

<style scoped lang="scss">
.host-list-item {
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
.host-list:focus .host-list-item.selected .mdc-table-column {
  background-color: var(--focus);
}
</style>
