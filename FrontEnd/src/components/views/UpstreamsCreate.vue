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

          <UpstreamItem v-for="(upstream, index) in this.upstream.arrayUpstremItems" :upstream="upstream" :key="upstream" v-on:removeUpstream="removeUpstream(index)">
          </UpstreamItem> 

          </br>
           <button @click="addUpstream" type="button" class="btn btn-success">Add Upstream item</button>
        </div>
      </div>
    </div>
  </section>    
</template>

<script>
// Imports
import UpstreamItem from './UpstreamItem'
// import { EventBus } from '../../main.js'

export default {
  data () {
    return {
      upstream: {
        upstreamName: '',
        arrayUpstremItems: []
      }
    }
  },
  methods: {
    addUpstream: function () {
      this.upstream.arrayUpstremItems.push({
        name: '',
        weight: ''
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
