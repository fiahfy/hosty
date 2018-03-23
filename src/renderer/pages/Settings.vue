<template>
  <div class="settings">
    <h4>General</h4>
    <div>
      <mdc-form-field>
        <mdc-checkbox
          id="dark-theme"
          v-model="darkTheme"
        />
        <label for="dark-theme">Use dark theme</label>
      </mdc-form-field>
    </div>
  </div>
</template>

<script>
import MdcCheckbox from '../components/MdcCheckbox'
import MdcFormField from '../components/MdcFormField'

export default {
  components: {
    MdcCheckbox,
    MdcFormField
  },
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

<style scoped lang="scss">
.settings {
  margin: 15px;
  h4 {
    color: var(--mdc-theme-text-secondary-on-background);
  }
  label {
    cursor: pointer;
  }
}
</style>
