<template>
  <v-navigation-drawer
    class="activity-bar"
    mini-variant
    permanent
    app
  >
    <v-list class="pt-0">
      <v-list-tile
        v-for="item in items"
        :key="item.name"
        :title="item.title"
        @click="(e) => onItemClick(e, item)"
      >
        <v-list-tile-action>
          <v-icon :color="item.color">{{ item.icon }}</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { buildText } from '~/utils/accelerator'

export default {
  data () {
    return {
      items: [
        { name: 'explorer', icon: 'view_list', title: `Explorer (${buildText('CmdOrCtrl+Shift+E')})` },
        { name: 'settings', icon: 'settings', title: `Settings (${buildText('CmdOrCtrl+,')})` }
      ]
    }
  },
  watch: {
    '$route' (to) { // eslint-disable-line object-shorthand
      this.updateItems(to.name)
    }
  },
  mounted () {
    this.updateItems(this.$route.name)
  },
  methods: {
    onItemClick (e, item) {
      this.$router.push({ name: item.name })
    },
    updateItems (name) {
      this.items = this.items.map(item => ({
        ...item,
        color: item.name === name ? 'primary' : null
      }))
    }
  }
}
</script>
