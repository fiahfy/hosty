<template>
  <v-container class="settings">
    <v-subheader class="pl-0">GENERAL</v-subheader>
    <v-checkbox v-model="darkTheme" class="mt-0" label="Use dark theme" />
  </v-container>
</template>

<script>
export default {
  computed: {
    darkTheme: {
      get() {
        return this.$store.state.settings.darkTheme
      },
      set(value) {
        this.$store.commit('settings/setDarkTheme', { darkTheme: value })
      }
    }
  }
}
</script>
