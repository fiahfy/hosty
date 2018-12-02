<template>
  <v-navigation-drawer class="activity-bar" mini-variant permanent app>
    <v-list class="pt-0">
      <v-list-tile
        v-for="item in items"
        :key="item.id"
        :title="item.title | accelerator(item.accelerator)"
        :style="item.style"
        @click="(e) => onItemClick(e, item)"
      >
        <v-list-tile-action>
          <v-badge color="error" :value="item.badge && badgeCount">
            <span slot="badge">{{ badgeCount }}</span>
            <v-icon :color="getColor(item)">{{ item.icon }}</v-icon>
          </v-badge>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import { Name } from '~/router'

export default {
  data() {
    return {
      items: [
        {
          id: 1,
          icon: 'explore',
          title: 'Explorer',
          badge: false,
          accelerator: 'CmdOrCtrl+Shift+E',
          location: {
            name: Name.explorer
          }
        },
        {
          id: 2,
          icon: 'search',
          title: 'Search',
          badge: false,
          accelerator: 'CmdOrCtrl+Shift+F',
          location: {
            name: Name.search
          }
        },
        {
          id: 3,
          icon: 'error',
          title: 'Problems',
          badge: true,
          accelerator: 'CmdOrCtrl+Shift+M',
          location: {
            name: Name.problems
          }
        },
        {
          id: 4,
          icon: 'settings',
          title: 'Settings',
          badge: false,
          accelerator: 'CmdOrCtrl+,',
          location: {
            name: Name.settings
          },
          style: { position: 'absolute', bottom: 0 }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['badgeCount'])
  },
  methods: {
    onItemClick(e, item) {
      this.$router.push(item.location)
    },
    getColor(item) {
      return this.getActive(item) ? 'primary' : null
    },
    getActive(item) {
      return item.location.name === this.$route.name
    }
  }
}
</script>

<style scoped lang="scss">
.activity-bar {
  /deep/ .v-badge__badge {
    font-size: 9px;
    height: 16px;
    line-height: 16px;
    right: -16px;
    top: -8px;
    width: 16px;
  }
}
</style>
