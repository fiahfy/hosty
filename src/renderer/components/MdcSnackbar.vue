<template>
  <div
    class="mdc-snackbar"
    aria-atomic="true"
    aria-hidden="true"
    aria-live="assertive"
  >
    <div class="mdc-snackbar__text" />
    <div class="mdc-snackbar__action-wrapper">
      <button
        type="button"
        class="mdc-snackbar__action-button"
      />
    </div>
  </div>
</template>

<script>
import { MDCSnackbar } from '@material/snackbar'

export default {
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      mdcSnackbar: null
    }
  },
  watch: {
    message () {
      this.show()
    }
  },
  mounted () {
    this.mdcSnackbar = MDCSnackbar.attachTo(this.$el)
    this.show()
  },
  beforeDestroy () {
    this.mdcSnackbar.destroy()
  },
  methods: {
    show () {
      if (!this.message) {
        return
      }
      const dataObj = {
        message: this.message,
        actionText: 'Close',
        actionHandler: () => {}
      }
      this.mdcSnackbar.show(dataObj)
    }
  }
}
</script>
