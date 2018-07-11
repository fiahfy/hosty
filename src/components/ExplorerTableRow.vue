<template>
  <tr
    :active="active"
    class="explorer-table-row"
    @click.stop="onClick"
    @contextmenu.stop="onContextMenu"
  >
    <td class="px-2">
      <v-btn
        :color="color"
        class="my-0"
        flat
        icon
        @click="onButtonClick"
      >
        <v-icon>check_circle</v-icon>
      </v-btn>
    </td>
    <td
      ref="column"
      @dblclick="onColumnDblClick"
    >
      <v-layout class="align-center">
        <span :class="nameClasses">{{ group.name || 'Group' }}</span>
        <span :class="numberClasses">{{ group.hosts.length }}</span>
        <v-menu
          v-model="menu.show"
          :transition="false"
          :position-x="menu.x"
          :position-y="menu.y"
          :min-width="menu.width"
          :close-on-content-click="false"
          lazy
        >
          <v-card>
            <v-card-text>
              <v-text-field
                ref="text"
                v-model="name"
                class="mt-0"
                label="Group"
                hide-details
                single-line
                @keydown.native="onTextKeyDown"
                @blur="onTextBlur"
                @contextmenu.stop="onTextContextMenu"
              />
            </v-card-text>
          </v-card>
        </v-menu>
      </v-layout>
    </td>
  </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  props: {
    group: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      menu: {
        show: false,
        x: 0,
        y: 0,
        width: 0
      },
      name: '',
      cancel: false
    }
  },
  computed: {
    active () {
      return this.isSelectedGroup({ id: this.group.id })
    },
    color () {
      return this.group.disabled ? 'grey' : 'success'
    },
    nameClasses () {
      return [
        'spacer ellipsis',
        this.group.name ? '' : 'grey--text'
      ]
    },
    numberClasses () {
      return [
        'ml-3 text-xs-right',
        this.group.hosts.length ? '' : 'grey--text'
      ]
    },
    ...mapGetters({
      isSelectedGroup: 'explorer/isSelectedGroup',
      canPasteGroup: 'explorer/canPasteGroup'
    })
  },
  methods: {
    onClick () {
      this.selectGroup({ id: this.group.id })
    },
    onContextMenu (e) {
      this.selectGroup({ id: this.group.id })
      const templates = [
        {
          label: 'New Group',
          click: () => this.createGroup(),
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Copy',
          click: () => this.copyGroup(),
          accelerator: 'CmdOrCtrl+C'
        },
        {
          label: 'Paste',
          click: () => this.pasteGroup(),
          accelerator: 'CmdOrCtrl+V',
          enabled: this.canPasteGroup
        },
        { type: 'separator' },
        {
          label: 'Edit',
          click: () => this.focus(),
          accelerator: 'Enter'
        },
        {
          label: 'Delete',
          click: () => this.deleteGroup(),
          accelerator: 'CmdOrCtrl+Backspace'
        }
      ]
      ContextMenu.show(e, templates)
    },
    onButtonClick () {
      this.selectGroup({ id: this.group.id })
      this.updateGroup({ group: { disabled: !this.group.disabled } })
    },
    onColumnDblClick () {
      this.focus()
    },
    onTextKeyDown (e) {
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          e.target.blur()
          this.focusTable()
          break
        case 27:
          e.preventDefault()
          this.cancel = true
          e.target.blur()
          this.focusTable()
          break
      }
    },
    onTextBlur () {
      this.menu.show = false
      if (this.cancel) {
        return
      }
      this.updateGroup({ group: { name: this.name } })
    },
    onTextContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    focus () {
      this.name = this.group.name
      this.cancel = false
      this.$nextTick(() => {
        const rect = this.$refs.column.getBoundingClientRect()
        this.menu.x = rect.left
        this.menu.y = rect.top + 1
        this.menu.width = rect.width
        this.menu.show = true
        setTimeout(() => {
          this.$refs.text.focus()
        }, 200)
      })
    },
    ...mapActions({
      createGroup: 'explorer/createGroup',
      updateGroup: 'explorer/updateGroup',
      deleteGroup: 'explorer/deleteGroup',
      copyGroup: 'explorer/copyGroup',
      pasteGroup: 'explorer/pasteGroup',
      selectGroup: 'explorer/selectGroup',
      focusTable: 'explorer/focusTable'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-table-row {
  cursor: pointer;
}
</style>
