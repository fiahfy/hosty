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
        class="my-0"
        flat
        icon
        @click="onButtonClick"
      >
        <v-icon>check_circle</v-icon>
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
        :position-x="ipMenu.x"
        :position-y="ipMenu.y"
        :min-width="ipMenu.width"
        :close-on-content-click="false"
        lazy
        transition="slide-x-reverse-transition"
      >
        <v-card>
          <v-card-text>
            <v-text-field
              ref="ipText"
              v-model="ip"
              class="mt-0"
              label="192.0.2.0"
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
        :position-x="nameMenu.x"
        :position-y="nameMenu.y"
        :min-width="nameMenu.width"
        :close-on-content-click="false"
        lazy
        transition="slide-x-reverse-transition"
      >
        <v-card>
          <v-card-text>
            <v-text-field
              ref="nameText"
              v-model="name"
              class="mt-0"
              label="example.com"
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
import { mapActions, mapGetters } from 'vuex'
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
      return this.isSelectedHost({ id: this.host.id })
    },
    color () {
      return this.host.disabled ? 'grey' : 'success'
    },
    ipClasses () {
      return [
        'ellipsis',
        this.host.ip ? '' : 'grey--text'
      ]
    },
    nameClasses () {
      return [
        'ellipsis',
        this.host.name ? '' : 'grey--text'
      ]
    },
    ...mapGetters({
      isSelectedHost: 'explorer/child/isSelectedHost',
      canPasteHost: 'explorer/child/canPasteHost'
    })
  },
  methods: {
    onClick () {
      this.selectHost({ id: this.host.id })
    },
    onContextMenu (e) {
      this.selectHost({ id: this.host.id })
      const templates = [
        {
          label: 'New Host',
          click: () => this.createHost(),
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Copy',
          click: () => this.copyHost(),
          accelerator: 'CmdOrCtrl+C'
        },
        {
          label: 'Paste',
          click: () => this.pasteHost(),
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
          click: () => this.deleteHost(),
          accelerator: 'CmdOrCtrl+Backspace'
        }
      ]
      ContextMenu.show(e, templates)
    },
    onButtonClick () {
      this.selectHost({ id: this.host.id })
      this.updateHost({ host: { disabled: !this.host.disabled } })
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
      this.updateHost({ host: { [value]: this[value] } })
    },
    onTextContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    focus (value = 'ip') {
      this[value] = this.host[value]
      this.cancel = false
      this.$nextTick(() => {
        const rect = this.$refs[`${value}Column`].getBoundingClientRect()
        this[`${value}Menu`].x = rect.left
        this[`${value}Menu`].y = rect.top + 1
        this[`${value}Menu`].width = rect.width
        this[`${value}Menu`].show = true
        setTimeout(() => {
          this.$refs[`${value}Text`].focus()
        }, 200)
      })
    },
    ...mapActions({
      createHost: 'explorer/child/createHost',
      updateHost: 'explorer/child/updateHost',
      deleteHost: 'explorer/child/deleteHost',
      copyHost: 'explorer/child/copyHost',
      pasteHost: 'explorer/child/pasteHost',
      selectHost: 'explorer/child/selectHost',
      focusTable: 'explorer/child/focusTable'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-child-table-row {
  cursor: pointer;
}
</style>
