<template>
  <tr
    :active="active"
    class="finder-table-row"
    @click.stop="onClick"
    @dblclick="onDblClick"
    @contextmenu.stop="onContextMenu"
  >
    <td>
      <v-icon
        :color="color"
        class="d-flex"
      >check_circle</v-icon>
    </td>
    <td :class="groupClasses">
      {{ item.group || 'Group' }}
    </td>
    <td :class="ipClasses">
      {{ item.ip || '192.0.2.0' }}
    </td>
    <td :class="hostClasses">
      {{ item.host || 'example.com' }}
    </td>
  </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    active () {
      return this.isSelectedItem({ id: this.item.id })
    },
    color () {
      return this.item.disabled ? 'grey lighten-2' : 'success'
    },
    groupClasses () {
      return [
        'spacer ellipsis',
        this.item.group ? '' : 'grey--text'
      ]
    },
    ipClasses () {
      return [
        'ellipsis',
        this.item.ip ? '' : 'grey--text'
      ]
    },
    hostClasses () {
      return [
        'ellipsis',
        this.item.host ? '' : 'grey--text'
      ]
    },
    ...mapGetters('local/finder', [
      'isSelectedItem'
    ])
  },
  methods: {
    onClick () {
      this.selectItem({ id: this.item.id })
    },
    onDblClick () {
      this.viewItem()
    },
    onContextMenu (e) {
      this.selectItem({ id: this.item.id })
      const templates = [
        {
          label: 'View',
          click: () => this.viewItem(),
          accelerator: 'Enter'
        }
      ]
      ContextMenu.show(e, templates)
    },
    view () {
      this.viewItem()
    },
    ...mapActions('local/finder', [
      'selectItem',
      'viewItem'
    ])
  }
}
</script>

<style scoped lang="scss">
.finder-table-row {
  cursor: pointer;
}
</style>
