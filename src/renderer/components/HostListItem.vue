<template>
  <mdc-table-row class="host-list-item" :selected="selected" v-bind="$attrs" v-on="$listeners">
    <mdc-table-column class="status">
      <mdc-button
          title="Toggle status"
          @click="statusClick"
        >
        <mdc-icon slot="icon" :icon="icon" :class="classes" />
      </mdc-button>
    </mdc-table-column>
    <mdc-table-column class="name" @click="nameClick">
      <mdc-text-field ref="name" placeholder="example.com" :disabled="nameDisabled" v-model="name" @blur="nameBlur" @keydown="nameKeydown" />
    </mdc-table-column>
    <mdc-table-column class="ip" @click="ipClick">
      <mdc-text-field ref="ip" placeholder="192.0.2.0" :disabled="ipDisabled" v-model="ip" @blur="ipBlur" @keydown="ipKeydown" />
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
  components: {
    MdcButton,
    MdcIcon,
    MdcTableColumn,
    MdcTableRow,
    MdcTextField
  },
  data () {
    return {
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
    name: {
      get () {
        return this.host.name
      },
      set (value) {
        this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, params: { name: value } })
      }
    },
    ip: {
      get () {
        return this.host.ip
      },
      set (value) {
        this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, params: { ip: value } })
      }
    },
    ...mapState({
      selectedGroupId: state => state.explorer.group.selectedId
    })
  },
  methods: {
    statusClick () {
      this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, params: { disabled: !this.host.disabled } })
    },
    nameClick () {
      this.nameDisabled = !this.selected
      this.$nextTick(() => {
        this.$refs.name.$el.querySelector('input').focus()
      })
    },
    nameBlur () {
      this.nameDisabled = true
    },
    nameKeydown (e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        this.$refs.name.$el.querySelector('input').blur()
      } else if (e.keyCode === 9) {
        e.preventDefault()
        this.ipClick()
      }
    },
    ipClick () {
      this.ipDisabled = !this.selected
      this.$nextTick(() => {
        this.$refs.ip.$el.querySelector('input').focus()
      })
    },
    ipBlur () {
      this.ipDisabled = true
    },
    ipKeydown (e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        this.$refs.ip.$el.querySelector('input').blur()
      } else if (e.keyCode === 9 && e.shiftKey) {
        e.preventDefault()
        this.nameClick()
      }
    },
    ...mapActions({
      updateHost: 'group/updateHost'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@material/theme/_color-palette";

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
        color: $material-color-grey-400;
      }
    }
  }
  .mdc-text-field {
    height: auto!important;
    margin: 0 0 2px;
    width: 100%;
    & /deep/ input {
      background-color: transparent!important;
      border: 0;
      &:disabled {
        color: inherit;
      }
    }
  }
}
</style>
