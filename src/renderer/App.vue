<template>
  <div
    id="app"
    class="mdc-theme--background"
    :class="classes"
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
    classes () {
      return {
        'mdc-theme--dark': this.darkTheme
      }
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

<style lang="scss">
$mdc-theme-primary: #ff4081;
$mdc-theme-secondary: #ff4081;
$mdc-theme-background: #fff;

@import '~material-design-icons/iconfont/material-icons.css';
@import 'material-components-web/material-components-web';
@import "@material/theme/_color-palette";

.mdc-theme--dark {
  color: white;
  &.mdc-theme--background, .mdc-theme--background {
    background-color: #303030;
  }
}
</style>
