<template>
  <mdc-table-row
    class="host-list-item"
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
        label="example.com"
        :disabled="nameDisabled"
        v-model="name"
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
        fullwidth
        label="192.0.2.0"
        :disabled="ipDisabled"
        v-model="ip"
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
    icon () {
      return this.host.disabled ? 'block' : 'check'
    },
    classes () {
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
      this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, params: { disabled: !this.host.disabled } })
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
      this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, params: { name: this.name } })
    },
    nameKeydown (e) {
      e.stopPropagation()
      if (e.keyCode === 13) {
        e.preventDefault()
        this.nameInput.blur()
        this.focusList()
      } else if (e.keyCode === 9) {
        e.preventDefault()
        this.ipClick()
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
      this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, params: { ip: this.ip } })
    },
    ipKeydown (e) {
      e.stopPropagation()
      if (e.keyCode === 13) {
        e.preventDefault()
        this.ipInput.blur()
        this.focusList()
      } else if (e.keyCode === 9 && e.shiftKey) {
        e.preventDefault()
        this.nameClick()
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
</style>
