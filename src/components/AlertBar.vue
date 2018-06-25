<template>
  <v-alert
    :value="permission === false"
    class="alert-bar ma-0"
    type="error"
  >
    <v-layout
      row
      align-center
    >
      <div class="spacer ellipsis">Grant permission required.</div>
      <v-btn
        class="ma-0"
        color="white"
        flat
        small
        @click="initialize"
      >Resolve</v-btn>
    </v-layout>
  </v-alert>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      permission: state => state.permission
    })
  },
  methods: {
    ...mapActions({
      initialize: 'initialize'
    })
  }
}
</script>

<style scoped lang="scss">
.alert /deep/ div {
  overflow: hidden;
}
</style>
