<template>
  <div class="explorer">
    <div class="group">
      <group-menu-bar />
      <group-list />
    </div>
    <divider orientation="vertical" />
    <div class="host">
      <host-menu-bar />
      <host-list />
    </div>
  </div>
</template>

<script>
import Divider from '../components/Divider'
import GroupList from '../components/GroupList'
import GroupMenuBar from '../components/GroupMenuBar'
import HostList from '../components/HostList'
import HostMenuBar from '../components/HostMenuBar'

export default {
  components: {
    Divider,
    GroupList,
    GroupMenuBar,
    HostList,
    HostMenuBar
  }
}
</script>

<style scoped lang="scss">
.explorer {
  display: flex;
  height: 100%;
  .group {
    display: flex;
    flex-direction: column;
    width: 256px;
    .group-list {
      flex: 1;
    }
  }
  .host {
    display: flex;
    flex: 1;
    flex-direction: column;
    .host-list {
      flex: 1;
    }
  }
}
</style>
