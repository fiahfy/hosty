<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    class="notification-bar"
  >
    {{ text }}
    <v-btn
      class="ml-3"
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
      color: '',
      text: '',
      messages: []
    }
  },
  computed: {
    ...mapState([
      'message'
    ])
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
      this.setMessage({ message: null })
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
      const message = this.messages.shift()
      if (!message) {
        return
      }
      this.snackbar = true
      this.color = message.color
      this.text = message.text
    },
    ...mapMutations([
      'setMessage'
    ])
  }
}
</script>
