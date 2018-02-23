<template>
  <div class="host-menu-bar">
    <mdc-button
      title="Create"
      :disabled="!canCreate"
      @click="createHost"
    >
      <mdc-icon
        slot="icon"
        icon="add"
      />
    </mdc-button>
    <mdc-button
      :title="'Delete'|accelerator('Delete')"
      :disabled="!canDelete"
      @click="deleteHost"
    >
      <mdc-icon
        slot="icon"
        icon="remove"
      />
    </mdc-button>
    <mdc-button
      title="Filter"
      :class="classes"
      @click="toggleFilterHost"
    >
      <mdc-icon
        slot="icon"
        icon="filter_list"
      />
    </mdc-button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'

export default {
  components: {
    MdcButton,
    MdcIcon
  },
  computed: {
    classes () {
      return {
        inactive: !this.filtered
      }
    },
    ...mapState({
      filtered: state => state.explorer.host.filtered
    }),
    ...mapGetters({
      canCreate: 'explorer/host/canCreate',
      canDelete: 'explorer/host/canDelete'
    })
  },
  methods: {
    ...mapActions({
      createHost: 'explorer/host/create',
      deleteHost: 'explorer/host/delete',
      toggleFilterHost: 'explorer/host/toggleFilter'
    })
  }
}
</script>

<style scoped lang="scss">
.host-menu-bar {
  display: flex;
  height: 40px;
  justify-content: flex-end;
  user-select: none;
  &>* {
    margin: 2px;
  }
  .mdc-button {
    min-width: 36px;
    padding: 0;
    .mdc-icon {
      font-size: 24px;
      height: auto;
      margin: 0;
      padding: 0;
      width: auto;
    }
    &.inactive .mdc-icon {
      color: var(--mdc-theme-text-icon-on-background);
    }
  }
}
</style>
