<template>
  <tr
    :active="isSelected({ id: item.id })"
    class="explorer-group-table-row"
    @click="select({ id: item.id })"
    @contextmenu="onContextMenu"
  >
    <td class="px-2">
      <v-btn
        :color="color"
        flat
        icon
        @click="onClick"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </td>
    <td
      ref="column"
      @dblclick="onDblClick"
    >
      {{ item.name }}
      <v-menu
        v-model="menu"
        :transition="false"
        :position-x="x"
        :position-y="y"
        :min-width="width"
        :close-on-content-click="false"
      >
        <v-card>
          <v-card-text>
            <v-text-field
              ref="input"
              v-model="name"
              label="Group"
              class="pt-0"
              hide-details
              single-line
              @keyup="onKeyup"
              @blur="onBlur"
              @contextmenu="onContextMenu"
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
    item: {
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
    icon () {
      return this.item.disabled ? 'block' : 'done'
    },
    color () {
      return this.item.disabled ? 'gray' : 'primary'
    },
    ...mapGetters({
      isSelected: 'app/explorer/group/isSelected'
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
    onContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onClick () {
      this.update({ id: this.item.id, group: { disabled: !this.item.disabled } })
    },
    onKeyup (e) {
      switch (e.keyCode) {
        case 13:
          e.target.blur()
          break
        case 27:
          this.cancel = true
          e.target.blur()
          break
      }
    },
    onBlur () {
      this.menu = false
      if (this.cancel) {
        return
      }
      this.update({ id: this.item.id, group: { name: this.name } })
    },
    onDblClick () {
      this.name = this.item.name
      this.cancel = false
      this.$nextTick(() => {
        this.menu = true
        setTimeout(() => {
          this.$refs.input.focus()
        }, 100)
      })
    },
    ...mapActions({
      select: 'app/explorer/group/select',
      update: 'app/explorer/group/update'
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
