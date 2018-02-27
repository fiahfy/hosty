<template>
  <button
    v-bind="$attrs"
    class="mdc-button"
    v-on="$listeners"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<script>
import { MDCRipple } from '@material/ripple'

export default {
  data () {
    return {
      mdcRipple: null
    }
  },
  mounted () {
    this.mdcRipple = MDCRipple.attachTo(this.$el)
    if (this.$slots.icon) {
      this.$slots.icon.map(n => {
        n.elm.classList.add('mdc-button__icon')
      })
    }
  },
  beforeDestroy () {
    this.mdcRipple.destroy()
  }
}
</script>
