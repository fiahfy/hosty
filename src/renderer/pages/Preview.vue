<template>
  <div
    :class="classes"
    class="preview"
  >
    <div />
    <textarea
      ref="textarea"
      v-model="preview"
      readonly
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      scrolling: false
    }
  },
  computed: {
    classes () {
      return {
        scrolling: this.scrolling
      }
    },
    ...mapGetters({
      preview: 'preview'
    })
  },
  mounted () {
    this.$refs.textarea.addEventListener('scroll', this.scroll)
  },
  beforeDestroy () {
    this.$refs.textarea.removeEventListener('scroll', this.scroll)
  },
  methods: {
    scroll () {
      const scrollTop = this.$refs.textarea.scrollTop
      this.scrolling = scrollTop > 0
    }
  }
}
</script>

<style scoped lang="scss">
.preview {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  div {
    height: 0;
    left: 0;
    position: absolute;
    right: 0;
  }
  textarea {
    background-color: inherit;
    border: 0;
    color: var(--mdc-theme-text-primary-on-background);
    flex: 1;
    font-family: inherit;
    font-size: inherit;
    outline: 0;
    padding: 15px;
    resize: none;
    tab-size: 32;
  }
  &.scrolling div {
    box-shadow: 0 0 3px 1px var(--shadow);
  }
}
</style>
