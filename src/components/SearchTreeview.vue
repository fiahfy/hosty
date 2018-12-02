<template>
  <v-container class="search-treeview pa-0" fluid>
    <v-container
      id="scroll-target"
      ref="treeview"
      class="pa-0"
      fluid
      fill-height
      scroll-y
    >
      <v-layout v-if="results.length">
        <div v-if="scrolling" class="shadow" />
        <v-treeview
          v-scroll:#scroll-target="onScroll"
          class="spacer"
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
        </v-treeview>
      </v-layout>
      <v-layout v-else>
        <v-flex class="ma-3 caption text-xs-center">No results found.</v-flex>
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
    ...mapState('local/search', ['scrollTop']),
    ...mapGetters('local/search', ['results'])
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
        this.scrolling = 0
      }
    }
  },
  mounted() {
    // wait for treeview.open-all
    this.$nextTick(() => {
      this.$refs.treeview.scrollTop = this.scrollTop
    })
  },
  activated() {
    this.$refs.treeview.scrollTop = this.scrollTop
  },
  methods: {
    onScroll(e) {
      const scrollTop = e.target.scrollTop
      this.setScrollTop({ scrollTop })
      this.scrolling = scrollTop > 0
    },
    getColor(item) {
      if (item.type === 'group') {
        return null
      }
      if (item.disabled) {
        return this.darkTheme ? 'grey darken-1' : 'grey lighten-2'
      }
      return 'success'
    },
    getIcon(item) {
      return item.type === 'group' ? 'list' : 'check_circle'
    },
    ...mapMutations('local/search', ['setScrollTop']),
    ...mapActions('local/search', ['viewResult'])
  }
}
</script>

<style scoped lang="scss">
.search-treeview {
  position: relative;
  .shadow {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
    content: '';
    height: 10px;
    position: absolute;
    top: -10px;
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
