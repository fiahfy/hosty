<template>
  <v-system-bar
    v-if="titleBar"
    class="title-bar"
    height="22"
    app
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
