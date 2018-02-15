<template>
  <div class="group-menu-bar">
    <mdc-button
        title="Create group"
        @click="createGroup"
      >
      <mdc-icon slot="icon" icon="add" />
    </mdc-button>
    <mdc-button
        title="Delete group"
        @click="deleteGroup"
      >
      <mdc-icon slot="icon" icon="delete" />
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
      createGroup: 'explorer/group/create',
      deleteGroup: 'explorer/group/delete'
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
  }
}
</style>
