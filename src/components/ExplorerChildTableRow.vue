<template>
  <tr
    :active="active"
    class="explorer-child-table-row"
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
      ref="ipColumn"
      :class="ipClasses"
      @dblclick="(e) => onColumnDblClick(e, 'ip')"
    >
      {{ host.ip || '192.0.2.0' }}
      <v-menu
        v-model="ipMenu.show"
        :transition="false"
        :position-x="ipMenu.x"
        :position-y="ipMenu.y - scrollTop"
        :min-width="ipMenu.width"
        :close-on-content-click="false"
        lazy
      >
        <v-card>
          <v-card-text>
            <v-text-field
              ref="ipText"
              v-model="ip"
              label="192.0.2.0"
              class="pt-0"
              hide-details
              single-line
              @keydown.native="(e) => onTextKeyDown(e, 'ip')"
              @blur="(e) => onTextBlur(e, 'ip')"
              @contextmenu.stop="onTextContextMenu"
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </td>
    <td
      ref="nameColumn"
      :class="nameClasses"
      @dblclick="(e) => onColumnDblClick(e, 'name')"
    >
      {{ host.name || 'example.com' }}
      <v-menu
        v-model="nameMenu.show"
        :transition="false"
        :position-x="nameMenu.x"
        :position-y="nameMenu.y - scrollTop"
        :min-width="nameMenu.width"
        :close-on-content-click="false"
        lazy
      >
        <v-card>
          <v-card-text>
            <v-text-field
              ref="nameText"
              v-model="name"
              label="example.com"
              class="pt-0"
              hide-details
              single-line
              @keydown.native="(e) => onTextKeyDown(e, 'name')"
              @blur="(e) => onTextBlur(e, 'name')"
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
      ipMenu: {
        show: false,
        x: 0,
        y: 0,
        width: 0
      },
      nameMenu: {
        show: false,
        x: 0,
        y: 0,
        width: 0
      },
      ip: '',
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
      return this.host.disabled ? 'grey' : 'primary'
    },
    ipClasses () {
      return this.host.ip ? '' : 'grey--text'
    },
    nameClasses () {
      return this.host.name ? '' : 'grey--text'
    },
    ...mapState({
      scrollTop: state => state.app.explorer.child.scrollTop
    }),
    ...mapGetters({
      isSelected: 'app/explorer/child/isSelected',
      canPaste: 'app/explorer/child/canPaste'
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.adjustMenu()
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
          label: 'New Host',
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
      this.select({ id: this.host.id })
      this.update({ host: { disabled: !this.host.disabled } })
    },
    onColumnDblClick (e, value) {
      this.focus(value)
    },
    onTextKeyDown (e, value) {
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
        case 9:
          e.preventDefault()
          e.target.blur()
          if (value === 'name' && e.shiftKey) {
            this.focus('ip')
            break
          } else if (value === 'ip' && !e.shiftKey) {
            this.focus('name')
            break
          }
          this.focusTable()
          break
      }
    },
    onTextBlur (e, value) {
      this[`${value}Menu`].show = false
      if (this.cancel) {
        return
      }
      this.update({ host: { [value]: this[value] } })
    },
    onTextContextMenu () {
      ContextMenu.showTextMenu()
    },
    focus (value = 'ip') {
      this[value] = this.host[value]
      this.cancel = false
      this.$nextTick(() => {
        this[`${value}Menu`].show = true
        setTimeout(() => {
          this.$refs[`${value}Text`].focus()
        }, 200)
      })
    },
    adjustMenu () {
      const ipRect = this.$refs.ipColumn.getBoundingClientRect()
      this.ipMenu.x = ipRect.left
      this.ipMenu.y = ipRect.top + 1
      this.ipMenu.width = ipRect.width
      const nameRect = this.$refs.nameColumn.getBoundingClientRect()
      this.nameMenu.x = nameRect.left
      this.nameMenu.y = nameRect.top + 1
      this.nameMenu.width = nameRect.width
    },
    ...mapActions({
      create: 'app/explorer/child/create',
      update: 'app/explorer/child/update',
      delete: 'app/explorer/child/delete',
      copy: 'app/explorer/child/copy',
      paste: 'app/explorer/child/paste',
      select: 'app/explorer/child/select',
      focusTable: 'app/explorer/child/focusTable'
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
.explorer-child-table-row {
  cursor: pointer;
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
