<template>
  <v-system-bar
    v-if="titleBar"
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
import { mapGetters, mapState } from 'vuex'

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
    }),
    ...mapGetters({
      titleBar: 'titleBar'
    })
  }
}
</script>

<style scoped lang="scss">
.title-bar {
  -webkit-app-region: drag;
}
</style>
