<template>
  <tr
    :active="active"
    class="explorer-group-table-row"
    @click.stop="onClick"
    @contextmenu.stop="onContextMenu"
  >
    <td class="px-2">
      <v-btn
        :color="color"
        flat
        icon
        class="my-0"
        @click="onButtonClick"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </td>
    <td
      ref="column"
      :class="classes"
      @dblclick="onColumnDblClick"
    >
      {{ group.name || 'Group' }}
      <v-menu
        v-model="menu.show"
        :transition="false"
        :position-x="menu.x"
        :position-y="menu.y - scrollTop"
        :min-width="menu.width"
        :close-on-content-click="false"
      >
        <v-card>
          <v-card-text>
            <v-text-field
              ref="text"
              v-model="name"
              label="Group"
              class="pt-0"
              hide-details
              single-line
              @keydown.native="onTextKeyDown"
              @blur="onTextBlur"
              @contextmenu.stop="onTextContextMenu"
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </td>
  </tr>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
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
      return this.isSelected({ id: this.group.id })
    },
    icon () {
      return this.group.disabled ? 'block' : 'done'
    },
    color () {
      return this.group.disabled ? 'gray' : 'primary'
    },
    classes () {
      return this.group.name ? [] : ['grey--text']
    },
    ...mapState({
      scrollTop: state => state.app.explorer.group.scrollTop
    }),
    ...mapGetters({
      isSelected: 'app/explorer/group/isSelected',
      canPaste: 'app/explorer/group/canPaste'
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.adjustMenu()
    })
  },
  methods: {
    onClick () {
      this.select({ id: this.group.id })
    },
    onContextMenu (e) {
      this.select({ id: this.group.id })
      const templates = [
        {
          label: 'New Group',
          click: () => this.create(),
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Copy',
          click: () => this.copy(),
          accelerator: 'CmdOrCtrl+C'
        },
        {
          label: 'Paste',
          click: () => this.paste(),
          accelerator: 'CmdOrCtrl+V',
          enabled: this.canPaste
        },
        { type: 'separator' },
        {
          label: 'Edit',
          click: () => this.focus(),
          accelerator: 'Enter'
        },
        {
          label: 'Delete',
          click: () => this.delete(),
          accelerator: 'CmdOrCtrl+Backspace'
        }
      ]
      ContextMenu.show(e, templates)
    },
    onButtonClick () {
      this.update({ group: { disabled: !this.group.disabled } })
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
      this.update({ group: { name: this.name } })
    },
    onTextContextMenu () {
      ContextMenu.showTextMenu()
    },
    focus () {
      this.name = this.group.name
      this.cancel = false
      this.$nextTick(() => {
        this.menu.show = true
        setTimeout(() => {
          this.$refs.text.focus()
        }, 200)
      })
    },
    adjustMenu () {
      const rect = this.$refs.column.getBoundingClientRect()
      this.menu.x = rect.left
      this.menu.y = rect.top + 1
      this.menu.width = rect.width
    },
    ...mapActions({
      create: 'app/explorer/group/create',
      update: 'app/explorer/group/update',
      delete: 'app/explorer/group/delete',
      copy: 'app/explorer/group/copy',
      paste: 'app/explorer/group/paste',
      select: 'app/explorer/group/select',
      focusTable: 'app/explorer/group/focusTable'
    })
  }
}
</script>

<style lang="scss">
.menu__content .input-group--text-field label {
  top: 0;
}
</style>

<style scoped lang="scss">
.explorer-group-table-row {
  cursor: pointer;
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
