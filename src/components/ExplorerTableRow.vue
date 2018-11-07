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
        @click.stop="onButtonClick"
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
          :position-x="menu.x"
          :position-y="menu.y"
          :min-width="menu.width"
          :close-on-content-click="false"
          lazy
          transition="slide-x-reverse-transition"
        >
          <v-card>
            <v-card-text class="py-0 overflow-hidden">
              <v-text-field
                ref="text"
                v-model="name"
                label="Group"
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
import { mapActions, mapGetters, mapState } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  props: {
    group: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
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
    active() {
      return this.isSelectedGroup({ id: this.group.id })
    },
    color() {
      if (this.group.disabled) {
        return this.darkTheme ? 'grey darken-1' : 'grey lighten-2'
      }
      return 'success'
    },
    nameClasses() {
      return ['spacer ellipsis', this.group.name ? '' : 'grey--text']
    },
    numberClasses() {
      return [
        'ml-3 caption text-xs-right',
        this.group.hosts.length ? '' : 'grey--text'
      ]
    },
    ...mapState('settings', ['darkTheme']),
    ...mapGetters('local/explorer', ['isSelectedGroup', 'canPasteGroup'])
  },
  methods: {
    onClick() {
      this.selectGroup({ id: this.group.id })
    },
    onContextMenu(e) {
      this.selectGroup({ id: this.group.id })
      const templates = [
        {
          label: 'New Group',
          click: () => this.createGroup(),
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Copy',
          click: () => this.copyGroup({ id: this.group.id }),
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
          click: () => this.deleteGroup({ id: this.group.id }),
          accelerator: 'CmdOrCtrl+Backspace'
        }
      ]
      ContextMenu.show(e, templates)
    },
    onButtonClick() {
      this.updateGroup({
        id: this.group.id,
        group: { disabled: !this.group.disabled }
      })
    },
    onColumnDblClick() {
      this.focus()
    },
    onTextKeyDown(e) {
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
    onTextBlur() {
      this.menu.show = false
      if (this.cancel) {
        return
      }
      this.updateGroup({ id: this.group.id, group: { name: this.name } })
    },
    onTextContextMenu(e) {
      ContextMenu.showTextMenu(e)
    },
    focus() {
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
    ...mapActions('local/explorer', [
      'createGroup',
      'updateGroup',
      'deleteGroup',
      'copyGroup',
      'pasteGroup',
      'selectGroup',
      'focusTable'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-table-row {
  cursor: pointer;
}
</style>
