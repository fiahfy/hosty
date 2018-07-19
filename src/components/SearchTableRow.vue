<template>
  <tr
    :active="active"
    class="search-table-row"
    @click.stop="onClick"
    @contextmenu.stop="onContextMenu"
  >
    <td class="px-2">
      <v-btn
        :color="color"
        class="my-0"
        flat
        icon
      >
        <v-icon>check_circle</v-icon>
      </v-btn>
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
      return this.item.disabled ? 'grey' : 'success'
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
    ...mapGetters({
      isSelectedItem: 'search/isSelectedItem'
    })
  },
  methods: {
    onClick () {
      this.selectItem({ id: this.item.id })
    },
    onContextMenu (e) {
      this.selectItem({ id: this.item.id })
      const templates = [
      ]
      ContextMenu.show(e, templates)
    },
    ...mapActions({
      selectItem: 'search/selectItem'
    })
  }
}
</script>

<style scoped lang="scss">
.search-table-row {
  cursor: pointer;
}
</style>
