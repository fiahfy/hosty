<template>
  <v-container class="problems-treeview pa-0" fluid>
    <v-container
      id="problems-treeview-scroll-target"
      ref="treeview"
      class="pa-0"
      fluid
      fill-height
      scroll-y
    >
      <v-layout v-if="results.length">
        <div v-if="scrolling" class="shadow" />
        <v-treeview
          v-scroll:#problems-treeview-scroll-target="onScroll"
          item-key="key"
          item-text="text"
          open-all
          open-on-click
          activatable
          hoverable
          :items="results"
          :active.sync="active"
        >
          <template slot="prepend" slot-scope="{ item }">
            <v-icon :color="getColor(item)">{{ getIcon(item) }}</v-icon>
          </template>
          <template slot="label" slot-scope="{ item }">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div :title="getText(item)" v-html="getHtml(item)" />
          </template>
        </v-treeview>
      </v-layout>
      <v-layout v-else>
        <v-flex class="ma-3 caption text-xs-center">
          No problems have been detected.
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      scrolling: false,
      active: []
    }
  },
  computed: {
    ...mapState('settings', ['darkTheme']),
    ...mapState('local/problems', ['scrollTop']),
    ...mapGetters('local/problems', ['results'])
  },
  watch: {
    active(value) {
      if (!value.length) {
        return null
      }
      const key = value[0]
      this.viewResult({ key })
    },
    results(value) {
      if (!value.length) {
        this.scrolling = false
      }
    }
  },
  mounted() {
    // wait for treeview.open-all
    this.$nextTick(() => {
      this.$refs.treeview.scrollTop = this.scrollTop
    })
  },
  methods: {
    onScroll(e) {
      const scrollTop = e.target.scrollTop
      this.setScrollTop({ scrollTop })
      this.scrolling = scrollTop > 0
    },
    getColor(item) {
      return item.type === 'group' ? null : 'error'
    },
    getIcon(item) {
      return item.type === 'group' ? 'list' : 'error'
    },
    getText(item) {
      if (item.type === 'group' && !item.text) {
        return '(Untitled)'
      }
      return item.text
    },
    getHtml(item) {
      if (item.type === 'group' && !item.text) {
        return '<span class="grey--text">(Untitled)</span>'
      }
      return item.text
    },
    ...mapMutations('local/problems', ['setScrollTop']),
    ...mapActions('local/problems', ['viewResult'])
  }
}
</script>

<style scoped lang="scss">
.problems-treeview {
  position: relative;
  .shadow {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
    content: '';
    height: 10px;
    position: absolute;
    top: -10px;
    width: 100%;
  }
  .v-treeview {
    width: 100%;
  }
  /deep/ .v-treeview-node__content {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    .v-treeview-node__label {
      font-size: 13px;
    }
  }
}
</style>
