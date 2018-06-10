<template>
  <v-container class="settings">
    <v-subheader class="pa-0">General</v-subheader>
    <v-checkbox
      v-model="darkTheme"
      label="Use dark theme"
    />
  </v-container>
</template>

<script>
export default {
  computed: {
    darkTheme: {
      get () {
        return this.$store.state.settings.darkTheme
      },
      set (value) {
        this.$store.commit('settings/setDarkTheme', { darkTheme: value })
      }
    }
  }
}
</script>
