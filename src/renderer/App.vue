<template>
  <div
    id="app"
    class="mdc-theme--background"
    :class="classes"
    @dragover.prevent
    @drop.prevent="drop"
  >
    <title-bar v-if="titleBar" />
    <divider />
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

export default {
  components: {
    ActivityBar,
    Divider,
    MdcSnackbar,
    TitleBar
  },
  async asyncData ({ store }) {
    //
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
  },
  methods: {
    drop (e) {
      // const files = Array.from(e.dataTransfer.files)
      // if (!files.length) {
      //   return
      // }
      // const filepathes = files.map(file => file.path)
      // this.open({ filepathes })
    },
    // ...mapActions({
    //   open: 'open'
    // })
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

::-webkit-scrollbar {
  -webkit-appearance: none;
  border-left-color: $material-color-grey-300;
  border-left-style: solid;
  border-left-width: 1px;
  width: 14px;
}
::-webkit-scrollbar-thumb {
  background-color: $material-color-grey-300;
  &:hover {
    background-color: $material-color-grey-400;
  }
  &:active {
    background-color: $material-color-grey-500;
  }
}

.mdc-theme--dark {
  color: white;
  &.mdc-theme--background, .mdc-theme--background {
    background-color: #303030;
  }
  ::-webkit-scrollbar {
    border-left-color: $material-color-grey-600;
  }
  ::-webkit-scrollbar-thumb {
    background-color: $material-color-grey-600;
    &:hover {
      background-color: $material-color-grey-500;
    }
    &:active {
      background-color: $material-color-grey-400;
    }
  }
}
</style>
