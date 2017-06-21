<template>
<section class="content">
    {{server}}
  <div class="box box-primary">
      <div class="box-header">
          <h3 class="box-title">Server</h3>
      </div>
    <ServerTag v-bind:server="server" ></ServerTag>

    <button v-on:click="validateBeforeSubmit" id="createHost" type="button" class="btn btn-info">Create Host</button>
    <button @:click="postTestNginx" id="testNginx" type="button" class="btn btn-info">Test NginX</button>
    <button @:click="postReloadNginx" id="reloadNginx" type="button" class="btn btn-info">Reload NginX</button>
  </div>
</section>
</template>

<script>
import axios from 'axios'
import ServerTag from './ServerTag'

import { EventBus } from '../../main.js'

export default {

  name: 'Vhost',
  data () {
    return {
      // server: {
      //  'host': 'fgd', 'port': 'fg', 'destination': 'fgh', 'arrayGenericServer': [ { 'nameProp': 'dfghdfghdfgh', 'valueProp': 'dfghdfghdfgh' } ], 'arrayLocations': []
      // }
      server: {
        host: '',
        port: '',
        arrayGenericServer: [],
        arrayLocations: []
      }
    }
  },
  mounted: function () {
    var self = this
    // Emit that validation is required on the bus
    self.$on('veeValidate', () => {
      EventBus.$emit('validate')
    })
    // Listen on the bus for changers to the child components error bag and merge in/remove errors
    EventBus.$on('errors-changed', (newErrors, oldErrors) => {
      newErrors.forEach(error => {
        if (!this.errors.has(error.field)) {
          self.errors.add(error.field, error.msg)
        }
      })
      if (oldErrors) {
        oldErrors.forEach(error => {
          self.errors.remove(error.field)
        })
      }
    })
  },
  methods: {
    validateBeforeSubmit: function () {
      EventBus.$emit('validate')
      setTimeout(() => {
        if (!this.errors.any()) {
          this.postCreateHost()
          console.log('Post To Server')
        }
      }, 200)
    },
    postCreateHost: function () {
      var app = this
      app.server
      axios.post('/api/host', app.server)
      axios.post('/api/host', {
        'host': '',
        'port': '',
        'destination': '',
        'cache': '',
        'extensions': ''
      })
        .then(function (response) {
          console.log('response')
          console.log(response)
        })
        .catch(error => {
          console.log('error')
          console.log(error.response.data)
        })
    },
    Save: function () {
      var app = this
      axios.post('/api/host', app.server)
      axios.post('/api/host', {
        'instance': '1',
        'name': app.server.host,
        'port': app.server.port,
        'config': app.server
      })
        .then(function (response) {
          console.log('response')
          console.log(response)
        })
        .catch(error => {
          console.log('error')
          console.log(error.response.data)
        })
    },
    postTestNginx: function () {

    },
    postReloadNginx: function () {

    }
  },
  components: {
    ServerTag: ServerTag
  }
}
</script>

<style>

</style>
