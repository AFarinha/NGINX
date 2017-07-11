<template>
		<div>
	    <div class="box box-solid box-primary">
	      <div class="box-header">
	          <h3 class="box-title"><b> Create - Upstreams </b></h3>
	          <div class="box-tools pull-right">
	              <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
	          </div>
	      </div>
	      <div class="box-body">
					<button v-on:click="clearUpstream" type="button" class="btn btn-info">Clear</button>
					<br />
	      	<Upstream :readOnly="false" v-bind:upstream="upstream"></Upstream>
				</br>
				<button @click="addUpstream" type="button" class="btn btn-success">Add Upstream item</button>
				 </br></br>
					<div :class="{ 'box box-solid box-primary': !responseErrorCreate && !responseSuccesscreate,'box box-solid box-danger': responseErrorCreate && !responseSuccesscreate,'box box-solid box-success': !responseErrorCreate && responseSuccesscreate,  }">
			      <div class="box-header">
			        <h3 class="box-title">Submition</h3>
			        <div class="box-tools pull-right">
								<button v-on:click="validateBeforeSubmit" type="button" class="btn btn-info">Save Upstream</button>
								<button v-on:click="postTestNginx" id="testNginx" type="button" class="btn btn-info">Test NginX</button>
								<button v-on:click="postReloadNginx" id="reloadNginx" type="button" class="btn btn-info">Reload NginX</button>
			        </div>
			      </div>
			    </div>

					<div v-if="responseErrorCreate" class="alert alert-danger alert-dismissable">
						 <i class="fa fa-ban"></i>
						 <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
						 <b>Alert! </b>{{this.responseErrorCreate}}
					</div>
					<div v-if="responseSuccesscreate" class="alert alert-success alert-dismissable">
						<i class="fa fa-check"></i>
						<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
						<b>Alert! </b> {{this.responseSuccesscreate}}
					</div>
	      </div>
	    </div>
		</div>
</template>

<script>
import axios from 'axios'
import Upstream from './Upstream'
import { EventBus } from '../../main.js'

import 'element-ui/lib/theme-default/index.css'

export default {
  props: {
    upstreamProp: {
      type: Object
    }
  },
  data () {
    return {
      upstream: {
        id: '',
        upstreamName: '',
        instance: 'localhost', // '192.168.1.201:8090',
        arrayUpstreamItems: []
      },
      responseSuccesscreate: false,
      responseErrorCreate: false
    }
  },
  watch: {
    upstreamProp: function (value) {
      var self = this
      self.upstream = self.upstreamProp
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
          this.postSaveUpstream()
          console.log('Post To Server')
        }
      }, 200)
    },
    clearUpstream: function () {
      var self = this
      self.upstream = {
        id: '',
        upstreamName: '',
        instance: '',
        arrayUpstreamItems: []
      }
    },
    addUpstream: function () {
      var self = this
      var lastItem = self.upstream.arrayUpstreamItems[self.upstream.arrayUpstreamItems.length - 1]
      if (lastItem === undefined || (lastItem.type !== '' && lastItem.subType !== '')) {
        self.upstream.arrayUpstreamItems.push({
          type: '',
          subType: '',
          config: ''
        })
        self.responseErrorCreate = false
      } else {
        self.responseSuccesscreate = false
        self.responseErrorCreate = 'As configurações do último item encontram-se vazias'
      }
    },
    postSaveUpstream: function () {
      var self = this
      axios.post('/api/newUpstream', self.upstream)
        .then(function (response) {
          if (response.data.status === 'failed') {
            console.log(response.data)
            self.responseErrorCreate = response.data
            self.responseSuccesscreate = false
          } else {
            self.upstream.id = response.data.message.id.toString()
            self.responseSuccesscreate = response.data
            self.responseErrorCreate = false
            // emits event to parent to reload
            EventBus.$emit('addedUpstream', self.upstream)
          }
        })
        .catch(error => {
          console.log('error')
          console.log(error)
          self.responseSuccesscreate = false
          self.responseErrorCreate = error.response
        })
    },
    postTestNginx: function () {
      var self = this
      axios.post('/api/nginx/test', self.server)
        .then(function (response) {
          self.responseSuccesscreate = response.data.stderr
        })
        .catch(error => {
          self.responseErrorCreate = error.response.statusText + ' : ' + error.response.data
        })
    },
    postReloadNginx: function () {
      var self = this
      axios.post('/api/nginx/reload', self.server)
        .then(function (response) {
          console.log(response)
          self.responseSuccesscreate = response.data.status + ' : ' + response.data.stderr
        })
        .catch(error => {
          console.log(error)
          self.responseErrorCreate = error.response.statusText + ' : ' + error.response.data
        })
    }
  },
  components: {
    Upstream: Upstream
  }
}
</script>

<style>

</style>
