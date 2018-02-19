<template>
  <div class="host-menu-bar">
    <mdc-button
      title="Create host"
      :disabled="!canCreate"
      @click="createHost"
    >
      <mdc-icon
        slot="icon"
        icon="add"
      />
    </mdc-button>
    <mdc-button
      title="Delete host"
      :disabled="!canDelete"
      @click="deleteHost"
    >
      <mdc-icon
        slot="icon"
        icon="remove"
      />
    </mdc-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'

export default {
  components: {
    MdcButton,
    MdcIcon
  },
  computed: {
    ...mapGetters({
      canCreate: 'explorer/host/canCreate',
      canDelete: 'explorer/host/canDelete'
    })
  },
  methods: {
    ...mapActions({
      createHost: 'explorer/host/create',
      deleteHost: 'explorer/host/delete'
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
  }
}
</style>
