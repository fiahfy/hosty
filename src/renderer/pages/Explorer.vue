<template>
  <div class="explorer">
    <div>
      <group-menu-bar />
      <divider />
      <group-list />
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import Divider from '../components/Divider'
import GroupList from '../components/GroupList'
import GroupMenuBar from '../components/GroupMenuBar'

export default {
  components: {
    Divider,
    GroupList,
    GroupMenuBar
  }
}
</script>

<style scoped lang="scss">
.explorer {
  display: flex;
  height: 100%;
  &>div {
    display: flex;
    flex-direction: column;
    .group-list {
      flex: 1;
    }
  }
}
</style>
