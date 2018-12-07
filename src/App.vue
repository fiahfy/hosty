<template>
  <v-app
    :dark="darkTheme"
    @contextmenu.native="onContextMenu"
    @drop.native.prevent="onDrop"
    @dragover.native.prevent
  >
    <title-bar />
    <activity-bar />
    <v-content class="fill-height">
      <v-layout column fill-height>
        <alert-bar />
        <router-view />
      </v-layout>
    </v-content>
    <notification-bar />
    <v-dialog v-model="dialog" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Import hosty file?</v-card-title>
        <v-card-text>The current hosts settings will be deleted.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="info" flat @click.native="onCancelClick">Cancel</v-btn>
          <v-btn color="error" flat @click.native="onOKClick">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ActivityBar from './components/ActivityBar'
import AlertBar from './components/AlertBar'
import NotificationBar from './components/NotificationBar'
import TitleBar from './components/TitleBar'
import ContextMenu from './utils/context-menu'

export default {
  components: {
    ActivityBar,
    AlertBar,
    NotificationBar,
    TitleBar
  },
  data() {
    return {
      dialog: false,
      filepath: ''
    }
  },
  computed: {
    ...mapState('settings', ['darkTheme'])
  },
  async created() {
    await this.initialize()
  },
  methods: {
    onContextMenu() {
      ContextMenu.show()
    },
    onDrop(e) {
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) {
        return
      }
      this.dialog = true
      this.filepath = files[0].path
    },
    onCancelClick() {
      this.dialog = false
    },
    onOKClick() {
      this.dialog = false
      this.import({ filepath: this.filepath })
    },
    ...mapActions(['initialize', 'import'])
  }
}
</script>

<style lang="scss">
@import '~typeface-roboto/index.css';
@import '~material-design-icons-iconfont/dist/material-design-icons.css';
@import '~vuetify/dist/vuetify.min.css';

html {
  overflow-y: hidden;
}
</style>
