<template>
  <tr
    :active="active"
    class="explorer-host-table-row"
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
      @dblclick="onColumnDblClick"
    >
      {{ host.name }}
      <v-menu
        v-model="menu"
        :transition="false"
        :position-x="x"
        :position-y="y - scrollTop"
        :min-width="width"
        :close-on-content-click="false"
      >
        <v-card>
          <v-card-text>
            <v-text-field
              ref="text"
              v-model="name"
              label="example.com"
              class="pt-0"
              hide-details
              single-line
              @keyup="onTextKeyup"
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
    host: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      menu: false,
      x: 0,
      y: 0,
      width: 0,
      name: '',
      cancel: false
    }
  },
  computed: {
    active () {
      return this.isSelected({ id: this.host.id })
    },
    icon () {
      return this.host.disabled ? 'block' : 'done'
    },
    color () {
      return this.host.disabled ? 'gray' : 'primary'
    },
    ...mapState({
      scrollTop: state => state.app.explorer.host.scrollTop
    }),
    ...mapGetters({
      isSelected: 'app/explorer/host/isSelected',
      canPaste: 'app/explorer/host/canPaste'
    })
  },
  mounted () {
    this.$nextTick(() => {
      const rect = this.$refs.column.getBoundingClientRect()
      this.x = rect.left
      this.y = rect.top + 1
      this.width = rect.width
    })
  },
  methods: {
    onClick () {
      this.select({ id: this.host.id })
    },
    onContextMenu (e) {
      this.select({ id: this.host.id })
      const templates = [
        {
          label: 'New Group',
          click: this.create,
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Copy',
          click: this.copy,
          accelerator: 'CmdOrCtrl+C'
        },
        {
          label: 'Paste',
          click: this.paste,
          accelerator: 'CmdOrCtrl+V',
          enabled: this.canPaste
        },
        { type: 'separator' },
        {
          label: 'Edit',
          click: this.focus,
          accelerator: 'Enter'
        },
        {
          label: 'Delete',
          click: this.delete,
          accelerator: 'CmdOrCtrl+Backspace'
        }
      ]
      ContextMenu.show(e, templates)
    },
    onButtonClick () {
      this.update({ id: this.host.id, host: { disabled: !this.host.disabled } })
    },
    onColumnDblClick () {
      this.focus()
    },
    onTextKeyup (e) {
      switch (e.keyCode) {
        case 13:
          e.target.blur()
          this.focusTable()
          break
        case 27:
          this.cancel = true
          e.target.blur()
          this.focusTable()
          break
      }
    },
    onTextBlur () {
      this.menu = false
      if (this.cancel) {
        return
      }
      this.update({ id: this.host.id, host: { name: this.name } })
    },
    onTextContextMenu () {
      ContextMenu.showTextMenu()
    },
    focus () {
      this.name = this.host.name
      this.cancel = false
      this.$nextTick(() => {
        this.menu = true
        setTimeout(() => {
          this.$refs.text.focus()
        }, 200)
      })
    },
    ...mapActions({
      create: 'app/explorer/host/create',
      update: 'app/explorer/host/update',
      delete: 'app/explorer/host/delete',
      copy: 'app/explorer/host/copy',
      paste: 'app/explorer/host/paste',
      select: 'app/explorer/host/select',
      focusTable: 'app/explorer/host/focusTable'
    })
  }
}
</script>

<style lang="scss">
.menu__content .input-host--text-field label {
  top: 0;
}
</style>

<style scoped lang="scss">
.explorer-host-table-row {
  cursor: pointer;
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
