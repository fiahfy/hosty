<template>
  <v-snackbar
    v-model="snackbar"
    class="notification-bar"
  >
    {{ text }}
    <v-btn
      flat
      @click.native="onCloseClick"
    >Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      snackbar: false,
      text: '',
      messages: []
    }
  },
  computed: {
    ...mapState({
      message: state => state.message
    })
  },
  watch: {
    snackbar (value) {
      if (value) {
        return
      }
      this.$nextTick(() => {
        this.showSnackbar()
      })
    },
    message (value) {
      if (!value) {
        return
      }
      this.messages.push(value)
      this.setMessage({ message: '' })
      if (this.snackbar) {
        return
      }
      this.showSnackbar()
    }
  },
  methods: {
    onCloseClick () {
      this.snackbar = false
    },
    showSnackbar () {
      this.text = this.messages.shift()
      if (this.text) {
        this.snackbar = true
      }
    },
    ...mapMutations({
      setMessage: 'setMessage'
    })
  }
}
</script>
