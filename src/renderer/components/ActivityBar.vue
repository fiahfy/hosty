<template>
  <div class="activity-bar">
    <ul>
      <li
        v-for="item in items"
        :key="item.name"
      >
        <mdc-button
          :title="item.title"
          @click="changeRoute({ name: item.name })"
        >
          <mdc-icon
            :icon="item.icon"
            :class="item.classes"
          />
        </mdc-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'
import { buildText } from '../utils/accelerator'

export default {
  components: {
    MdcButton,
    MdcIcon
  },
  data () {
    return {
      items: [
        { name: 'explorer', icon: 'view_list', title: `explorer (${buildText('CmdOrCtrl+Shift+E')})` },
        { name: 'settings', icon: 'settings', title: `settings (${buildText('CmdOrCtrl+,')})` }
      ]
    }
  },
  watch: {
    '$route' (to) { // eslint-disable-line object-shorthand
      this.updateItems(to.name)
    }
  },
  mounted () {
    this.updateItems(this.$route.name)
  },
  methods: {
    updateItems (name) {
      this.items = this.items.map(item => ({
        ...item,
        classes: {
          selected: item.name === name
        }
      }))
    },
    ...mapActions({
      changeRoute: 'changeRoute'
    })
  }
}
</script>

<style scoped lang="scss">
.activity-bar {
  overflow: hidden;
  width: 48px;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    .mdc-button {
      border-radius: 0;
      height: auto;
      line-height: initial;
      min-width: auto;
      padding: 0;
      .mdc-icon {
        padding: 12px;
        &:not(.selected) {
          color: var(--mdc-theme-text-icon-on-background);
          &:hover {
            color: inherit;
          }
        }
      }
    }
  }
}
</style>
