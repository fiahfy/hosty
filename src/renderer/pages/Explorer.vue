<template>
  <div class="explorer">
    <div class="group">
      <group-menu-bar />
      <div class="container">
        <div
          v-if="groupMessage"
          class="message"
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
          v-if="hostMessage"
          class="message"
        >
          {{ hostMessage }}
        </div>
        <host-list />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      selectedGroup: 'explorer/group/selectedGroup',
      groups: 'explorer/group/groups',
      hosts: 'explorer/host/hosts'
    })
  },
  watch: {
    selectedGroup () {
      this.updateTitle()
    }
  },
  mounted () {
    this.updateTitle()
  },
  methods: {
    updateTitle () {
      let title = 'Explorer'
      if (this.selectedGroup) {
        title = this.selectedGroup.name || '(No name)'
      }
      this.changeTitle({ title })
    },
    ...mapActions({
      changeTitle: 'changeTitle'
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
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
