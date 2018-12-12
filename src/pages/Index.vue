<template>
  <v-container class="index" fill-height fluid pa-0>
    <v-layout row>
      <v-flex v-if="hasSidebar" xs12 sm4>
        <v-layout row fill-height>
          <v-layout column fill-height>
            <v-toolbar flat dense>
              <v-subheader class="pl-0">{{ headline }}</v-subheader>
            </v-toolbar>
            <nuxt-child />
            <v-divider class="hidden-sm-and-up" />
          </v-layout>
          <v-divider vertical class="hidden-xs-only" />
        </v-layout>
      </v-flex>
      <v-flex xs12 sm8>
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
                Select a group you want to edit on the sidebar.
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
    hasSidebar() {
      return this.$route.name !== '/'
    },
    headline() {
      return this.$route.name.toUpperCase()
    },
    ...mapState('local', ['selectedGroupId'])
  }
}
</script>

<style scoped lang="scss">
.index > .layout > div:first-child:last-child {
  flex-basis: 100%;
  max-width: 100%;
}
@media only screen and (max-width: 599px) {
  .index > .layout {
    flex-direction: column;
    > div {
      flex: none;
      &:first-child {
        height: 50%;
      }
      &:last-child {
        height: 50%;
      }
      &:first-child:last-child {
        height: 100%;
      }
    }
  }
}
</style>
