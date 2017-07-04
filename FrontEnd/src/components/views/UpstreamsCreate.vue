<template>
  <section class="content">
    <div class="col-md-12">
      <div class="box box-solid box-default">
        <div class="box-header">
          <h3 class="box-title">Upstream</h3>
          <div class="box-tools pull-right">
            <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
            <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
          </div>
        </div>
        <div class="box-body">
        {{upstream}}
          <div :class="{ 'has-error': vErrors.has('proxyPass') }">
            <input name="proxyPass" v-validate="'required'" v-model="upstream.upstreamName" class="form-control" type="text" placeholder="Upstream name">
            <span v-show="vErrors.has('proxyPass')" class="help-block">{{ vErrors.first('proxyPass') }}</span>
          </div>
          <UpstreamItem v-for="(upstream, index) in this.upstream.arrayUpstreamItems" :upstream="upstream" :key="upstream" v-on:removeUpstream="removeUpstream(index)">
          </UpstreamItem> 

          </br>
           <button @click="addUpstream" type="button" class="btn btn-success">Add Upstream item</button>
           <button v-on:click="validateBeforeSubmit" type="button" class="btn btn-success">Save Upstream</button>
           <button v-on:click="postTestNginx" id="testNginx" type="button" class="btn btn-success">Test NginX</button>
           <button v-on:click="postReloadNginx" id="reloadNginx" type="button" class="btn btn-success">Reload NginX</button>
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
      </div>
    </div>
  </section>    
</template>

<script>
// Imports
import UpstreamItem from './UpstreamItem'
import axios from 'axios'
import { EventBus } from '../../main.js'

export default {
  props: {
    upstream: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      responseSuccess: false,
      responseError: false
    }
  },
  methods: {
    validateBeforeSubmit: function () {
      var self = this
      EventBus.$emit('validate')
      setTimeout(() => {
        if (!self.vErrors.any()) {
          self.postSaveUpstream()
          console.log('Post To Server')
        }
      }, 200)
    },
    addUpstream: function () {
      var self = this
      var lastItem = self.upstream.arrayUpstreamItems[self.upstream.arrayUpstreamItems.length - 1]
      if (lastItem === undefined || (lastItem.type !== '' && lastItem.subType !== '' && lastItem.config !== '')) {
        self.upstream.arrayUpstreamItems.push({
          type: '',
          subType: '',
          config: ''
        })
        self.responseError = false
      } else {
        self.responseSuccess = false
        self.responseError = 'As configurações do último item encontram-se vazias'
      }
    },
    postSaveUpstream: function () {
      var self = this
      axios.post('/api/insertUpstream', self.upstream)
        .then(function (response) {
          if (response.data.status === 'failed') {
            console.log(response.data)
            self.responseError = response.data
            self.responseSuccess = false
          } else {
            self.upstream.id = response.data.message.id.toString()
            self.responseSuccess = response.data
            self.responseError = false
          }
        })
        .catch(error => {
          console.log('error')
          console.log(error)
          self.responseSuccess = false
          self.responseError = error.response
        })
    },
    removeUpstream (index) {
      var self = this
      if (index > 0) {
        self.upstream.arrayUpstreamItems.splice(index, 1)
      } else {
        self.responseSuccess = false
        self.responseError = 'É necessário existir pelo menos 1 item'
      }
    },
    postTestNginx: function () {
      var self = this
      axios.post('/api/nginx/test', self.server)
        .then(function (response) {
          self.responseSuccess = response.data.stderr
        })
        .catch(error => {
          self.responseError = error.response.statusText + ' : ' + error.response.data
        })
    },
    postReloadNginx: function () {
      var self = this
      axios.post('/api/nginx/reload', self.server)
        .then(function (response) {
          console.log(response)
          self.responseSuccess = response.data.status + ' : ' + response.data.stderr
        })
        .catch(error => {
          console.log(error)
          self.responseError = error.response.statusText + ' : ' + error.response.data
        })
    }
  },
  components: {
    UpstreamItem: UpstreamItem
  }
}
</script>

<style>

</style>
