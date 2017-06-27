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
          <button v-on:click="postTestNginx" id="testNginx" type="button" class="btn btn-info">Test NginX</button>
          <button v-on:click="postReloadNginx" id="reloadNginx" type="button" class="btn btn-info">Reload NginX</button>
        </div>
      </div>
    </div>

    <div v-if="responseError" class="alert alert-danger alert-dismissable">
       <i class="fa fa-ban"></i>
       <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
       <b>Alert! </b>{{this.responseError}}
    </div>

    <div v-if="responseSuccess" class="alert alert-success alert-dismissable">
      <i class="fa fa-check"></i>
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
      <b>Alert! </b> {{this.responseSuccess}}
    </div>

  <!--   -->

</section>
</template>

<script>
import axios from 'axios'
import { EventBus } from '../../main.js'
import ServerTag from './ServerTag'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate, {
  errorBagName: 'vErrors'
})

export default {

  name: 'Vhost',
  data () {
    return {
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
        if (!this.vErrors.has(error.field)) {
          self.vErrors.add(error.field, error.msg)
        }
      })
      if (oldErrors) {
        oldErrors.forEach(error => {
          self.vErrors.remove(error.field)
        })
      }
    })
  },
  methods: {
    validateBeforeSubmit: function () {
      EventBus.$emit('validate')
      setTimeout(() => {
        if (!this.vErrors.any()) {
          this.postCreateHost()
          console.log('Post To Server')
        }
      }, 200)
    },
    postCreateHost: function () {
      var app = this
      axios.post('/api/host', app.server)
        .then(function (response) {
          if (response.data.status === 'failed') {
            console.log(response.data)
            app.responseError = response.data
            app.responseSuccess = false
          } else {
            app.server.id = response.data.message.id.toString()
            app.responseSuccess = response.data
            app.responseError = false
          }
        })
        .catch(error => {
          console.log('error')
          app.responseSuccess = false
          app.responseError = error.response
        })
    },
    postTestNginx: function () {
      var app = this
      axios.post('/api/nginx/test', app.server)
        .then(function (response) {
          app.responseSuccess = response.data.stderr
        })
        .catch(error => {
          app.responseError = error.response.statusText + ' : ' + error.response.data
        })
    },
    postReloadNginx: function () {
      var app = this
      axios.post('/api/nginx/reload', app.server)
        .then(function (response) {
          console.log(response)
          app.responseSuccess = response.data.status + ' : ' + response.data.stderr
        })
        .catch(error => {
          console.log(error)
          app.responseError = error.response.statusText + ' : ' + error.response.data
        })
    }
  },
  components: {
    ServerTag: ServerTag
  },
  created: function () {
    var app = this
    if (app.$route.params.id !== undefined) {
      axios.get('/api/getVHost/' + app.$route.params.id)
        .then(function (response) {
          console.log(response.data)
          app.server = JSON.parse(response.data.message.config)
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

}
</script>

<style>

</style>
