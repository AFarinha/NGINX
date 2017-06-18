<template>
<section class="content">




  <div class="box box-solid box-success">
    <div class="box-header">
      <h3 class="box-title">Location </h3>
      <div class="box-tools pull-right">
        <button class="btn btn-success btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
        <button class="btn btn-success btn-sm" data-widget="remove" @click="removeLocation" ><i class="fa fa-times"></i></button>
      </div>
    </div>
    <div class="box-body">
      <div class="content">
        <div class="row">
          <div class="form-group col-md-4">
            <h5><b> Path </b></h5>
            <div :class="{ 'has-error': errors.has('path') }">
              <input name="path" v-model="location.path" v-validate="'required'" class="form-control" type="text" placeholder="Path">
              <span v-show="errors.has('path')" class="help-block">{{ errors.first('path') }}</span>
            </div>
          </div>
          <div class="form-group col-md-4">
            <h5><b> Proxy Pass </b></h5>
            <div :class="{ 'has-error': errors.has('proxyPass') }">
              <input name="proxyPass" v-model="location.proxyPass" v-validate="'required'" class="form-control" type="text" placeholder="Proxy Pass">
              <span v-show="errors.has('proxyPass')" class="help-block">{{ errors.first('proxyPass') }}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <!-- Begin Upstreams -->
          <div class="box box-solid box-success">
            <div class="box-header">
              <h3 class="box-title">Location - Upstream</h3>
              <div class="box-tools pull-right">
                <button class="btn btn-success btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
                <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
              </div>
            </div>
            <div class="box-body">
              <UpstreamItem v-for="(upstream, index) in this.location.arrayUpstreams" :upstream="upstream" :key="upstream" v-on:removeUpstream="removeUpstream(index)">
              </UpstreamItem>
              <button @click="addUpstream">Add Upstream item</button>
            </div>
          </div>
          <!-- End Upstreams -->

          <!-- Begin Cache -->
          <div class="box box-solid box-success">
            <div class="box-header">
              <h3 class="box-title">Location - Cache</h3>
              <div class="box-tools pull-right">
                <button class="btn btn-success btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
                <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
              </div>
            </div>
            <div class="box-body">

              <label for="nameProp"> Tempo para cache</label>
              <input name="valueProp" v-model="location.cache" v-validate="'required'" class="form-control" type="text">

              <input type="checkbox" v-model="location.cacheServer"> Cache Server<br>

              <input type="checkbox" v-model="location.cacheClient"> Cache Browser<br>

            </div>
          </div>
            <!-- End Cache -->

          <!-- Begin LocationsGeneric -->
          <div class="box box-solid box-success">
            <div class="box-header">
              <h3 class="box-title">Location - Generic Items</h3>
              <div class="box-tools pull-right">
                <button class="btn btn-success btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
                <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
              </div>
            </div>
            <div class="box-body">
              <GenericItem v-for="(generic, index) in this.location.arrayGeneric" :generic="generic" :key="generic" v-on:removeGeneric="removeGeneric(index)">
              </GenericItem>
              <button @click="addGeneric">Add generic item</button>
            </div>
          </div>
            <!-- End LocationsGeneric -->
        </div>
      </div>
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
      this.location.arrayGeneric.push({
        nameProp: '',
        valueProp: ''
      })
    },
    removeGeneric (index) {
      this.location.arrayGeneric.splice(index, 1)
    },
    addUpstream: function () {
      this.location.arrayUpstreams.push({
        name: '',
        ip: '',
        weight: ''
      })
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
