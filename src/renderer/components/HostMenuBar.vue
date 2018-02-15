<template>
  <div class="host-menu-bar">
    <mdc-button
        title="Create host"
        @click="create"
      >
      <mdc-icon slot="icon" icon="add" />
    </mdc-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'

export default {
  components: {
    MdcButton,
    MdcIcon
  },
  methods: {
    ...mapActions({
      create: 'explorer/host/create'
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
