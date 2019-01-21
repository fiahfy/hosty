<template>
  <v-container class="settings">
    <v-subheader class="pl-0">GENERAL</v-subheader>
    <v-checkbox v-model="darkTheme" class="mt-0" label="Dark Theme" />
    <v-subheader class="pl-0">EXPLORER</v-subheader>
    <v-checkbox
      v-model="deleteConfirmation"
      class="mt-0"
      label="Confirm Delete Group"
    />
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
    },
    deleteConfirmation: {
      get() {
        return this.$store.state.settings.deleteConfirmation
      },
      set(value) {
        this.$store.commit('settings/setDeleteConfirmation', {
          deleteConfirmation: value
        })
      }
    }
  }
}
</script>
