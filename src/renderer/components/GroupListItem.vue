<template>
  <mdc-table-row class="group-list-item" :selected="selected" v-bind="$attrs" v-on="$listeners">
    <mdc-table-column class="status">
      {{ group.id }}
    </mdc-table-column>
    <mdc-table-column class="name" @click="click">
      <mdc-text-field ref="name" :disabled="disabled" v-model="name" @blur="blur" @keydown="keydown" />
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import { mapActions } from 'vuex'
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
    name: {
      get () {
        return this.group.name
      },
      set (value) {
        this.updateGroup({ id: this.group.id, name: value })
      }
    }
  },
  methods: {
    click () {
      this.disabled = !this.selected
      this.$nextTick(() => {
        this.$refs.name.$el.querySelector('input').focus()
      })
    },
    blur () {
      this.disabled = true
    },
    keydown (e) {
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
