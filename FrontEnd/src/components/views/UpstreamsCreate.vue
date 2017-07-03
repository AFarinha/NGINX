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
          <input name="proxyPass" v-model="upstream.upstreamName" class="form-control" type="text" placeholder="Upstream name">

          <UpstreamItem v-for="(upstream, index) in this.upstream.arrayUpstreamItems" :upstream="upstream" :key="upstream" v-on:removeUpstream="removeUpstream(index)">
          </UpstreamItem> 

          </br>
           <button @click="addUpstream" type="button" class="btn btn-success">Add Upstream item</button>
           <button @click="postSaveUpstream" type="button" class="btn btn-success">Save Upstream</button>
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
// import { EventBus } from '../../main.js'

export default {
  data () {
    return {
      upstream: {
        id: '',
        upstreamName: '',
        arrayUpstreamItems: []
      },
      responseSuccess: false,
      responseError: false
    }
  },
  methods: {
    addUpstream: function () {
      this.upstream.arrayUpstreamItems.push({
        type: '',
        subType: '',
        config: ''
      })
    },
    postSaveUpstream: function () {
      var app = this
      axios.post('/api/insertUpstream', app.upstream)
        .then(function (response) {
          if (response.data.status === 'failed') {
            console.log(response.data)
            app.responseError = response.data
            app.responseSuccess = false
          } else {
            app.upstream.id = response.data.message.id.toString()
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
    removeUpstream (index) {
      this.upstream.arrayUpstremItems.splice(index, 1)
    }
  },
  components: {
    UpstreamItem: UpstreamItem
  }
}
</script>

<style>

</style>
