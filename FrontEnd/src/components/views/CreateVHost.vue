<template>
<section class="content">


    <ServerTag v-bind:server="server" ></ServerTag>

    <button v-on:click="validateBeforeSubmit" id="createHost" type="button" class="btn btn-info">Create Host</button>
    <button v-on:click="validateBeforeSubmit1" id="createHost" type="button" class="btn btn-info">Create Host1</button>
    <button @:click="postTestNginx" id="testNginx" type="button" class="btn btn-info">Test NginX</button>
    <button @:click="postReloadNginx" id="reloadNginx" type="button" class="btn btn-info">Reload NginX</button>

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
        destination: '',
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
      var self = this
      self.$validator.validateAll().then(() => {
        console.log('submit')
      }).catch(() => {
        console.log('errorSubmit')
        EventBus.$emit('errors-changed', self.errors.errors)
      })
    },
    validateBeforeSubmit1: function () {
      EventBus.$emit('validate')
      setTimeout(() => {
        if (!this.errors.any()) {
          this.postCreateHost()
          console.log('ola111')
        }
      }, 200)
    },
    postCreateHost: function () {
      var app = this

      axios.post('/api/host', {
        'host': app.host,
        'port': app.port,
        'destination': app.destination,
        'cache': app.cache,
        'extensions': app.extensions
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
