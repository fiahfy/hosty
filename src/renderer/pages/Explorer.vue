<template>
  <div class="explorer">
    <div class="group">
      <group-menu-bar />
      <div class="container">
        <div
          class="message"
          v-if="groupMessage"
        >
          {{ groupMessage }}
        </div>
        <group-list />
      </div>
    </div>
    <divider orientation="vertical" />
    <div class="host">
      <host-menu-bar />
      <div class="container">
        <div
          class="message"
          v-if="hostMessage"
        >
          {{ hostMessage }}
        </div>
        <host-list />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
  },
  computed: {
    groupMessage () {
      return this.groups.length ? '' : 'No Groups'
    },
    hostMessage () {
      return this.hosts.length ? '' : 'No Hosts'
    },
    ...mapGetters({
      groups: 'explorer/group/groups',
      hosts: 'explorer/host/hosts'
    })
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
  }
  .host {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .container {
    flex: 1;
    overflow-y: auto;
    position: relative;
    .message {
      align-items: center;
      bottom: 0;
      color: var(--mdc-theme-text-secondary-on-background);
      display: flex;
      justify-content: center;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
