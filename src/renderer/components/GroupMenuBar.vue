<template>
  <div class="group-menu-bar">
    <mdc-button
        title="Create group"
        @click="createGroup"
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
      createGroup: 'explorer/createGroup'
    })
  }
}
</script>

<style scoped lang="scss">
.group-menu-bar {
  display: flex;
  height: 40px;
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
