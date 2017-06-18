<template>
<section class="content">
  <div class="container">
    <h2>Location</h2>
    <div class="panel panel-default">
      <div class="panel-heading">Panel Heading</div>
      <div class="panel-body">Panel Content</div>
        <input v-model="location.path"  class="form-control" type="text">
        <input v-model="location.proxyPass" class="form-control" type="text">
        <button @click="removeLocation">Remove Location</button>

        <input type="checkbox" v-model="location.cacheServer" > Cache Server<br>
        definir parametros

        <input type="checkbox" v-model="location.cacheClient" > Cache Browser<br>
        definir parametros

        //lista de upstreams
        <GenericItem v-for="(generic, index) in this.location.arrayGeneric"
          :generic="generic"
          :key= "generic"
          v-on:removeGeneric="removeGeneric(index)">
        </GenericItem>
        <button @click="addGeneric">Add generic item</button>

        <UpstreamItem v-for="(upstream, index) in this.location.arrayUpstreams"
          :upstream="upstream"
          :key= "upstream"
          v-on:removeUpstream="removeUpstream(index)">
        </UpstreamItem>

        <button @click="addUpstream">Add Upstream item</button>
    </div>
  </div>



</section>
</template>

<script>
import GenericItem from './GenericItem'
import UpstreamItem from './UpstreamItem'

export default {
  props: {
    location: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {
    addGeneric: function () {
      this.location.arrayGeneric.push({nameProp: '', valueProp: ''})
    },
    removeGeneric (index) {
      this.location.arrayGeneric.splice(index, 1)
    },
    addUpstream: function () {
      this.location.arrayUpstreams.push({name: '', ip: '', weight: ''})
    },
    removeUpstream (index) {
      this.location.arrayUpstreams.splice(index, 1)
    },
    removeLocation: function () {
      // Event to parent
      this.$emit('removeLocation')
    }
  },
  components: {
    GenericItem: GenericItem,
    UpstreamItem: UpstreamItem
  }
}
</script>

<style>

</style>
