<template>
  <div class="group-menu-bar">
    <mdc-button
      :title="'New Group'|accelerator('CmdOrCtrl+N')"
      :disabled="!canCreate"
      @click="createGroup"
    >
      <mdc-icon
        slot="icon"
        icon="add"
      />
    </mdc-button>
    <mdc-button
      :title="'Delete'|accelerator('CmdOrCtrl+Backspace')"
      :disabled="!canDelete"
      @click="deleteGroup"
    >
      <mdc-icon
        slot="icon"
        icon="remove"
      />
    </mdc-button>
    <mdc-button
      :class="classes"
      title="Filter"
      @click="toggleFilterGroup"
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
      filtered: state => state.explorer.group.filtered
    }),
    ...mapGetters({
      canCreate: 'explorer/group/canCreate',
      canDelete: 'explorer/group/canDelete'
    })
  },
  methods: {
    ...mapActions({
      createGroup: 'explorer/group/create',
      deleteGroup: 'explorer/group/delete',
      toggleFilterGroup: 'explorer/group/toggleFilter'
    })
  }
}
</script>

<style scoped lang="scss">
.group-menu-bar {
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
