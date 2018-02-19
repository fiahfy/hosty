<template>
  <div
    class="mdc-text-field"
    :class="classes"
  >
    <input
      type="text"
      class="mdc-text-field__input"
      :id="id"
      :placeholder="placeholder"
      :aria-label="placeholder"
      :disabled="disabled"
      v-model="model"
      v-bind="$attrs"
      v-on="listeners"
    >
    <label
      class="mdc-text-field__label"
      :for="id"
      v-if="!fullwidth"
    >{{ label }}</label>
    <div class="mdc-line-ripple" />
  </div>
</template>

<script>
import { MDCTextField } from '@material/textfield'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    fullwidth: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mdcTextField: null,
      id: -1
    }
  },
  computed: {
    listeners () {
      const listeners = this.$listeners
      delete listeners.change
      return listeners
    },
    classes () {
      return {
        'mdc-text-field--fullwidth': this.fullwidth,
        'mdc-text-field--disabled': this.disabled
      }
    },
    placeholder () {
      return this.fullwidth ? this.label : null
    },
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  },
  mounted () {
    this.mdcTextField = MDCTextField.attachTo(this.$el)
    this.id = this._uid // eslint-disable-line no-underscore-dangle
  },
  beforeDestroy () {
    this.mdcTextField.destroy()
  }
}
</script>
