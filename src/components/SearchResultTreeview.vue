<template>
  <v-container
    id="scroll-target"
    ref="treeview"
    class="search-result-treeview scroll-y pa-0"
    fluid
  >
    <v-layout v-if="results.length">
      <v-treeview
        v-scroll:#scroll-target="onScroll"
        item-children="hosts"
        item-key="key"
        item-text="text"
        open-all
        open-on-click
        activatable
        :items="results"
        :active.sync="active"
      >
        <template
          slot="prepend"
          slot-scope="{ item }"
        >
          <span
            v-if="item.disabled"
            class="dummy-icon"
          />
          <v-icon v-else>check_circle</v-icon>
        </template>
      </v-treeview>
    </v-layout>
    <v-layout
      v-else
      align-center
      justify-center
    >
      <v-flex class="text-xs-center caption">No results found</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      active: []
    }
  },
  computed: {
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
    }
  },
  mounted() {
    const scrollTop = this.scrollTop
    // open-all を待つために $nextTick でなく setTimeout を使用する
    setTimeout(() => {
      this.$refs.treeview.scrollTop = scrollTop
    }, 0)
  },
  methods: {
    onScroll(e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    ...mapMutations('local/search/', ['setScrollTop']),
    ...mapActions('local/search/', ['viewResult'])
  }
}
</script>

<style scoped lang="scss">
.search-result-treeview {
  .dummy-icon {
    width: 24px;
  }
}
</style>
