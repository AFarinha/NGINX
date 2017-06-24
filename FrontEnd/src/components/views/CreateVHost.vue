<template>
<section class="content">
    {{server}}


      <!--   <div class="box-body"> -->
    <ServerTag v-bind:server="server" ></ServerTag>

    <hr />
    <div :class="{ 'box box-solid box-primary': !responseError && !responseSuccess,'box box-solid box-danger': responseError && !responseSuccess,'box box-solid box-success': !responseError && responseSuccess,  }">
      <div class="box-header">
        <h3 class="box-title">Submition</h3>
        <div class="box-tools pull-right">
          <button v-on:click="validateBeforeSubmit" id="createHost" type="button" class="btn btn-info">Create Host</button>
          <button @:click="postTestNginx" id="testNginx" type="button" class="btn btn-info">Test NginX</button>
          <button @:click="postReloadNginx" id="reloadNginx" type="button" class="btn btn-info">Reload NginX</button>
        </div>
      </div>
    </div>

    <div v-if="responseError" class="alert alert-danger alert-dismissable">
       <i class="fa fa-ban"></i>
       <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
       <b>Alert! </b>{{this.responseError.data}}
    </div>

    <div v-if="responseSuccess" class="alert alert-success alert-dismissable">
      <i class="fa fa-check"></i>
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
      <b>Alert! </b> {{this.responseSuccess.data}}
    </div>

  <!--   -->

</section>
</template>

<script>
import axios from 'axios'
import { EventBus } from '../../main.js'
import ServerTag from './ServerTag'

export default {

  name: 'Vhost',
  data () {
    return {
      // server: {
      //  'host': 'fgd', 'port': 'fg', 'destination': 'fgh', 'arrayGenericServer': [ { 'nameProp': 'dfghdfghdfgh', 'valueProp': 'dfghdfghdfgh' } ], 'arrayLocations': []
      // }
      server: {
        id: '',
        host: '',
        port: '',
        arrayGenericServer: [],
        arrayLocations: []
      },
      responseSuccess: false,
      responseError: false
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
        .then(function (response) {
          console.log('response')
          console.log(response.data.message.id)
          app.server.id = response.data.message.id.toString()
          app.responseSuccess = response
        })
        .catch(error => {
          console.log('error')
          this.responseError = error.response
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
