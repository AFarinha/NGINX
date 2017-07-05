<template>
<section class="content">
  <div class="row center-block">
    <div class="form-group">
      <h4>Host</h4>
      <div :class="{ 'has-error': errors.has('host') }">
        <label v-show="errors.has('host')" class="control-label" ><i :class="{'fa fa-fw fa-times-circle-o': errors.has('host')  }"></i>  {{errors.has('host') ? 'Input with error' : '' }}</label>
        <input name="host" v-model="host" v-validate="'required'" class="form-control" type="text" placeholder="Host">
        <span v-show="errors.has('host')" class="help-block">{{ errors.first('host') }}</span>
      </div>
    </div>
    <div class="form-group">
      <h4>Port</h4>
      <div :class="{ 'has-error': errors.has('port') }">
        <label v-show="errors.has('port')" class="control-label" ><i :class="{'fa fa-fw fa-times-circle-o': errors.has('port')  }"></i>  {{errors.has('port') ? 'Input with error' : '' }}</label>
        <input name="port" v-model="port" v-validate="'required'" class="form-control" type="text" placeholder="port">
        <span v-show="errors.has('port')" class="help-block">{{ errors.first('port') }}</span>
      </div>
    </div>
    <div class="form-group">
      <h4>Destination</h4>
      <div :class="{ 'has-error': errors.has('destination') }">
        <label v-show="errors.has('destination')" class="control-label" ><i :class="{'fa fa-fw fa-times-circle-o': errors.has('destination')  }"></i>  {{errors.has('destination') ? 'Input with error' : '' }}</label>
        <input name="destination" v-model="destination" v-validate="'required'" class="form-control" type="text" placeholder="Destination">
        <span v-show="errors.has('destination')" class="help-block">{{ errors.first('destination') }}</span>
      </div>
    </div>
    <div class="form-group">
      <h4>Extensions</h4>
      <div :class="{ 'has-error': errors.has('extensions') }">
        <label v-show="errors.has('extensions')" class="control-label" ><i :class="{'fa fa-fw fa-times-circle-o': errors.has('extensions')  }"></i>  {{errors.has('extensions') ? 'Input with error' : '' }}</label>
        <input name="extensions" v-model="extensions" v-validate="'required'" class="form-control" type="text" placeholder="Extensions">
        <span v-show="errors.has('extensions')" class="help-block">{{ errors.first('extensions') }}</span>
      </div>
    </div>
    <div class="checkbox">
      <label>
            <input type="checkbox" v-model="cache" id="cache"> Static assets cache
          </label>
    </div>
    <button v-on:click="validateBeforeSubmit" id="createHost" type="button" class="btn btn-info">Create Host</button>
    <button @:click="postTestNginx" id="testNginx" type="button" class="btn btn-info">Test NginX</button>
    <button @:click="postReloadNginx" id="reloadNginx" type="button" class="btn btn-info">Reload NginX</button>
  </div>

</section>
</template>

<script>
import axios from 'axios'


export default {
  name: 'Vhost',
  data () {
    return {
      host: '',
      port: '',
      destination: '',
      extensions: '',
      data: '',
      cache: '',
      email: '',
      name: ''
    }
  },
  methods: {
    validateBeforeSubmit: function () {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.postCreateHost()
      }
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
  }
}
</script>

<style>

</style>
