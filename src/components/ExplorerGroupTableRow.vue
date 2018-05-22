<template>
  <tr
    class="explorer-group-table-row"
    @contextmenu="onContextMenu"
  >
    <td>
      <v-btn
        flat
        icon
      >
        <v-icon>star</v-icon>
      </v-btn>
    </td>
    <td
      ref="column"
      class="text-xs-left"
      @dblclick="show"
    >
      {{ item.name }}
      <v-menu
        v-model="menu"
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
              class=""
              hide-details
              single-line
              @blur="onBlur"
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </td>
  </tr>
</template>

<script>
import { mapActions } from 'vuex'
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
      autofocus: false
    }
  },
  watch: {
    menu (value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    }
  },
  mounted () {
    console.log(this.item)
    const rect = this.$refs.column.getBoundingClientRect()
    this.x = rect.left
    this.y = rect.top
    this.width = rect.width
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onBlur () {
      this.menu = false
      this.updateGroup({ id: this.item.id, group: { name: this.name } })
    },
    show (e) {
      this.name = this.item.name
      this.$nextTick(() => {
        this.menu = true
        // setTimeout(() => {
          // console.log(this.$refs.input)
          // console.log(this.$refs.input.$el.querySelector('input'))
          // this.$refs.input.focus()
        // }, 1000)
      })
    },
    ...mapActions({
      updateGroup: 'app/explorer/group/update'
    })
  }
}
</script>

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
