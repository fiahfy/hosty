<template>
  <v-container
    id="scroll-target"
    ref="treeview"
    class="finder-treeview scroll-y pa-0"
    fluid
  >
    <v-layout v-if="filteredItems.length">
      <v-treeview
        v-scroll:#scroll-target="onScroll"
        item-children="hosts"
        item-text="text"
        open-all
        open-on-click
        :items="filteredItems"
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
      <v-flex class="text-xs-center caption">No results</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('local/finder', ['selectedItemId', 'scrollTop']),
    ...mapGetters('local/finder', ['filteredItems', 'selectedItemIndex'])
  },
  mounted() {
    this.loadItems()
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
    ...mapMutations('local/finder/', ['setScrollTop']),
    ...mapActions('local/finder/', ['loadItems'])
  }
}
</script>

<style scoped lang="scss">
.finder-treeview {
  .dummy-icon {
    width: 24px;
  }
}
</style>
