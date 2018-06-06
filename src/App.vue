<template>
  <v-app
    :dark="darkTheme"
    @contextmenu.native="onContextMenu"
    @drop.native.prevent="onDrop"
    @dragover.native.prevent
  >
    <title-bar v-if="titleBar" />
    <activity-bar />
    <v-content class="fill-height">
      <v-layout
        column
        fill-height
      >
        <alert-bar />
        <router-view />
      </v-layout>
    </v-content>
    <notification-bar />
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ActivityBar from './components/ActivityBar'
import AlertBar from './components/AlertBar'
import NotificationBar from './components/NotificationBar'
import TitleBar from './components/TitleBar'
import * as ContextMenu from './utils/context-menu'

export default {
  components: {
    ActivityBar,
    AlertBar,
    NotificationBar,
    TitleBar
  },
  computed: {
    ...mapState({
      darkTheme: state => state.settings.darkTheme
    }),
    ...mapGetters({
      titleBar: 'titleBar'
    })
  },
  async created () {
    await this.initialize()
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.show(e)
    },
    onDrop (e) {
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) {
        return
      }
      const filepath = files[0].path
      this.import({ filepath })
    },
    ...mapActions({
      initialize: 'initialize',
      import: 'import'
    })
  }
}
</script>

<style lang="scss">
@import '~typeface-roboto/index.css';
@import '~material-design-icons/iconfont/material-icons.css';
@import '~vuetify/dist/vuetify.min.css';

html {
  overflow-y: hidden;
}
</style>
