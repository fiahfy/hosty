<template>
  <mdc-table-row class="group-list-item" :selected="selected" v-bind="$attrs" v-on="$listeners">
    <mdc-table-column class="status">
      {{ group.id }}
    </mdc-table-column>
    <mdc-table-column class="name" @click="click">
      <mdc-text-field ref="name" :disabled="disabled" v-model="name" @blur="blur" />
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
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
      name: 'test',
      disabled: true
    }
  },
  computed: {
  },
  methods: {
    click () {
      this.disabled = !this.selected
      // console.log(this.disabled)
      // this.$refs.name.$el.focus()
    },
    blur () {
      this.disabled = true
    }
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
  }
}
</style>
