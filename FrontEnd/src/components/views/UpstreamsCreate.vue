<template>
  <section class="content">
    <div class="col-md-6">
      <div class="box box-solid box-default">
        <div class="box-header">
          <h3 class="box-title">Upstream</h3>
          <div class="box-tools pull-right">
            <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
            <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
          </div>
        </div>
        <div class="box-body">
          <UpstreamItem v-for="(upstream, index) in this.arrayUpstreams" :upstream="upstream" :key="upstream" v-on:removeUpstream="removeUpstream(index)">
          </UpstreamItem>
          </br>
          <button @click="addUpstream" type="button" class="btn btn-success">Add Upstream item</button>
        </div>
      </div>
    </div>
  </section>    
</template>

<script>
//Imports
import { EventBus } from '../../main.js'




export default {
  pname: 'Upstremas',
  data () {
    return arrayUpstreams[]
  },
  methods: {
    addUpstream: function () {
      this.arrayUpstreams = arrayUpstreams []
    }
  },
  created () {
    // para criar Streams por default
    var app = this
    console.log(app.server)
    app.addUpstream()
  }
}
</script>

<style>

</style>
