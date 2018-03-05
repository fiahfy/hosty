<template>
  <div class="mdc-checkbox">
    <input
      v-model="model"
      v-bind="$attrs"
      type="checkbox"
      class="mdc-checkbox__native-control"
      v-on="listeners"
    >
    <div class="mdc-checkbox__background">
      <svg
        class="mdc-checkbox__checkmark"
        viewBox="0 0 24 24"
      >
        <path
          class="mdc-checkbox__checkmark-path"
          fill="none"
          stroke="white"
          d="M1.73,12.91 8.1,19.28 22.79,4.59"
        />
      </svg>
      <div class="mdc-checkbox__mixedmark" />
    </div>
  </div>
</template>

<script>
import { MDCCheckbox } from '@material/checkbox'

export default {
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      mdcCheckbox: null
    }
  },
  computed: {
    listeners () {
      const listeners = this.$listeners
      delete listeners.change
      return listeners
    },
    model: {
      get () {
        return this.checked
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  },
  mounted () {
    this.mdcCheckbox = MDCCheckbox.attachTo(this.$el)
  },
  beforeDestroy () {
    this.mdcCheckbox.destroy()
  }
}
</script>
