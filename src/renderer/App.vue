<template>
  <div
    id="app"
    :style="styles"
    class="mdc-theme--background"
    @contextmenu="contextmenu"
    @dragover.prevent
    @drop.prevent="drop"
  >
    <template v-if="titleBar">
      <title-bar />
      <divider />
    </template>
    <div class="container">
      <activity-bar />
      <divider orientation="vertical" />
      <div class="content">
        <router-view />
      </div>
    </div>
    <mdc-snackbar :message="message" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ActivityBar from './components/ActivityBar'
import Divider from './components/Divider'
import MdcSnackbar from './components/MdcSnackbar'
import TitleBar from './components/TitleBar'
import Theme from './theme'
import * as ContextMenu from './utils/context-menu'

export default {
  components: {
    ActivityBar,
    Divider,
    MdcSnackbar,
    TitleBar
  },
  async asyncData ({ store }) {
    await store.dispatch('initHosts')
  },
  computed: {
    styles () {
      return this.darkTheme ? Theme.dark : Theme.light
    },
    ...mapState({
      message: state => state.message,
      darkTheme: state => state.settings.darkTheme
    }),
    ...mapGetters({
      titleBar: 'titleBar'
    })
  },
  methods: {
    contextmenu (e) {
      ContextMenu.show(e)
    },
    drop (e) {
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) {
        return
      }
      const filepath = files[0].path
      this.importHosts({ filepath })
    },
    ...mapActions({
      importHosts: 'importHosts'
    })
  }
}
</script>

<style lang="scss">
@import '~material-design-icons/iconfont/material-icons.css';
@import '~material-components-web/material-components-web.scss';
</style>

<style scoped lang="scss">
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: small;
  height: 100%;
  user-select: none;
  .container {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
    .content {
      flex: 1;
      min-width: 256px;
      overflow: hidden;
    }
  }
}
</style>
