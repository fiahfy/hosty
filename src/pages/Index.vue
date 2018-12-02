<template>
  <v-container class="index" fill-height fluid pa-0>
    <v-layout row>
      <v-flex xs4>
        <v-layout row fill-height>
          <v-layout column fill-height>
            <v-toolbar flat dense>
              <v-subheader class="pl-0">{{ headline }}</v-subheader>
            </v-toolbar>
            <router-view />
          </v-layout>
          <v-divider vertical />
        </v-layout>
      </v-flex>
      <v-flex xs8>
        <v-layout v-if="selectedGroupId" column fill-height>
          <host-toolbar />
          <host-card />
          <v-container fluid pa-0 overflow-hidden>
            <host-table class="fill-height" />
          </v-container>
        </v-layout>
        <v-layout v-else fill-height align-center justify-center>
          <v-flex>
            <div class="text-xs-center">
              <v-icon size="128" color="grey lighten-2">edit</v-icon>
              <p class="subheading">Edit group</p>
              <p class="caption">
                Select a group you want to edit on the side menu.
              </p>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import HostCard from '~/components/HostCard'
import HostTable from '~/components/HostTable'
import HostToolbar from '~/components/HostToolbar'

export default {
  components: {
    HostCard,
    HostTable,
    HostToolbar
  },
  computed: {
    headline() {
      return this.$route.name.toUpperCase()
    },
    ...mapState('local', ['selectedGroupId'])
  }
}
</script>
