<template>
  <mdc-table-row class="host-list-item" :selected="selected" v-bind="$attrs" v-on="$listeners">
    <mdc-table-column class="status">
      {{ host.id }}
    </mdc-table-column>
    <mdc-table-column class="name" @click="nameClick">
      <mdc-text-field ref="name" :disabled="nameDisabled" v-model="name" @blur="nameBlur" @keydown="nameKeydown" />
    </mdc-table-column>
    <mdc-table-column class="ip" @click="ipClick">
      <mdc-text-field ref="ip" :disabled="ipDisabled" v-model="ip" @blur="ipBlur" @keydown="ipKeydown" />
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
    name: {
      get () {
        return this.host.name
      },
      set (value) {
        this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, name: value })
      }
    },
    ip: {
      get () {
        return this.host.ip
      },
      set (value) {
        this.updateHost({ groupId: this.selectedGroupId, id: this.host.id, ip: value })
      }
    },
    ...mapState({
      selectedGroupId: state => state.explorer.group.selectedId
    })
  },
  methods: {
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
.mdc-table-column {
  line-height: 20px;
  vertical-align: bottom;
  white-space: nowrap;
  .mdc-text-field {
    height: auto!important;
    margin: 0;
    padding-top: 8px;
  }
}
</style>
