<template>
  <v-navigation-drawer class="activity-bar" mini-variant permanent app>
    <v-list class="pt-0">
      <v-list-tile
        v-for="item in items"
        :key="item.name"
        :title="item.title | accelerator(item.accelerator)"
        @click="(e) => onItemClick(e, item)"
      >
        <v-list-tile-action>
          <v-badge :value="item.badge && badgeCount">
            <span slot="badge">{{ badgeCount }}</span>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-badge>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      items: [
        {
          name: 'explorer',
          icon: 'explore',
          title: 'Explorer',
          badge: false,
          accelerator: 'CmdOrCtrl+Shift+E'
        },
        {
          name: 'search',
          icon: 'search',
          title: 'Search',
          badge: false,
          accelerator: 'CmdOrCtrl+Shift+F'
        },
        {
          name: 'inspector',
          icon: 'error',
          title: 'Inspector',
          badge: true,
          accelerator: 'CmdOrCtrl+Shift+F'
        },
        {
          name: 'settings',
          icon: 'settings',
          title: 'Settings',
          badge: false,
          accelerator: 'CmdOrCtrl+,'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['badgeCount'])
  },
  watch: {
    $route(to) {
      this.updateItems(to.name)
    }
  },
  mounted() {
    this.updateItems(this.$route.name)
  },
  methods: {
    onItemClick(e, item) {
      this.$router.push({ name: item.name })
    },
    updateItems(name) {
      this.items = this.items.map((item) => ({
        ...item,
        color: item.name === name ? 'primary' : null
      }))
    }
  }
}
</script>

<style scoped lang="scss">
.activity-bar {
  /deep/ .v-badge__badge {
    font-size: 11px;
    height: 18px;
    right: -18px;
    top: -9px;
    width: 18px;
  }
}
</style>
