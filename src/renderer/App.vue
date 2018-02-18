<template>
  <div
    id="app"
    class="mdc-theme--background"
    :style="styles"
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
import { mapGetters, mapState } from 'vuex'
import ActivityBar from './components/ActivityBar'
import Divider from './components/Divider'
import MdcSnackbar from './components/MdcSnackbar'
import TitleBar from './components/TitleBar'
import Theme from './theme'

export default {
  components: {
    ActivityBar,
    Divider,
    MdcSnackbar,
    TitleBar
  },
  async asyncData ({ store }) {
    store.dispatch('initHosts')
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
  .container {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
    .content {
      flex: 1;
    }
  }
}
</style>
