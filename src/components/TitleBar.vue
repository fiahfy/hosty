<template>
  <v-system-bar
    :app="app"
    class="title-bar"
    height="22"
    status
  >
    <v-spacer/>
    <span>{{ title }}</span>
    <v-spacer/>
  </v-system-bar>
</template>

<script>
import { mapState } from 'vuex'
import Package from '~~/package.json'

export default {
  props: {
    app: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      title: state => {
        return state.app.title || Package.productName
      }
    })
  }
}
</script>

<style scoped lang="scss">
.system-bar {
  -webkit-app-region: drag;
}
</style>
