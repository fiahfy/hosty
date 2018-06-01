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

export default {
  props: {
    app: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      title: state => state.title
    })
  }
}
</script>

<style scoped lang="scss">
.system-bar {
  -webkit-app-region: drag;
}
</style>
