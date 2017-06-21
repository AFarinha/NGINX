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
          <div class="form-group col-md-2">
            <input type="radio" id="one" value="1" name="loc" v-model="selected">
            <label for="one">Generic</label>
            <br>
            <input type="radio" id="two" value="2" name="loc" v-model="selected">
            <label for="two">File Types</label>
            <br>
        </div>
          <!-- INICIO LOCATION PATH -->
          <div class="form-group col-md-10" v-if="selected == '1' " >
            <div :class="{ 'has-error': errors.has('path') }">
              <div class="input-group">
                <div class="input-group-addon">
                  Path Generic
                </div>
                <input name="path" v-model="location.path" v-validate="'required'" class="form-control input-sm" type="text" placeholder="Path">
              </div>
              <span v-show="errors.has('path')" class="help-block">{{ errors.first('path') }}</span>
            </div>
          </div>
          <div class="form-group col-md-10" v-if="selected == '2' " >
            <div :class="{ 'has-error': errors.has('path') }">
                <div class="input-group input-group-lg">
                  <div class="input-group-btn">
                      <button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown">Action <span class="fa fa-caret-down"></span></button>
                      <ul class="dropdown-menu">
                          <li><a href="#">Action</a></li>
                          <li><a href="#">Another action</a></li>
                          <li><a href="#">Something else here</a></li>
                          <li class="divider"></li>
                          <li><a href="#">Separated link</a></li>
                      </ul>
                  </div><!-- /btn-group -->
                  <input name="path" v-model="location.path" v-validate="'required'" class="form-control input-sm" type="text" placeholder="Path">
                </div><!-- /input-group -->
              <span v-show="errors.has('path')" class="help-block">{{ errors.first('path') }}</span>
            </div>
          </div>
        </div>
        <!-- FIM LOCATION PATH -->
        <div class="row">
          <div class="box box-solid box-success">
            <div class="box-header">
              <h3 class="box-title">Location - Proxy Pass</h3>
              <div class="box-tools pull-right">
                <button class="btn btn-success btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
                <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
              </div>
            </div>
            <div class="box-body">
              <div class="form-group col-md-4">
                <h5><b> Proxy Pass </b></h5>
                <div :class="{ 'has-error': errors.has('proxyPass') }">
                  <input name="proxyPass" v-model="location.proxyPass" v-validate="'required'" class="form-control" type="text" placeholder="Proxy Pass">
                  <span v-show="errors.has('proxyPass')" class="help-block">{{ errors.first('proxyPass') }}</span>
                </div>
              </div>
            </div>
          </div>
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

                <!--
                expires @15h30m;

ddl com isto
ms: milliseconds
s: seconds
m: minutes
h: hours
d: days
w: weeks
M: months (30 days)
y: years (365 days)

expires 4d
expires(label) 4(input ou slider) h(ddl)
-->
                <button class="btn btn-success btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
                <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
              </div>
            </div>
            <div class="box-body">

              <label for="nameProp"> Tempo para cache</label>


              <input type="checkbox" v-model="location.cacheServer"> Cache Server<br>

              <input type="checkbox" v-model="location.cacheClient"> Cache Browser<br>

              <h4>Tempo para cache</h4>
              <div class="input-group input-group-lg">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown">Tempo Cache <span class="fa fa-caret-down"></span></button>
                    <ul class="dropdown-menu">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li class="divider"></li>
                        <li><a href="#">Separated link</a></li>
                    </ul>
                </div><!-- /btn-group -->
                <input name="valueProp" v-model="location.cache" v-validate="'required'" class="form-control" type="text">
              </div><!-- /input-group -->
            
  <!--            <select v-model="row.code">
                  <option v-for="item in itemdata"  :value="item"> {{ item.code }} </option>
              </select>
            -->
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
      selected: ''
    }
  },
  watch: {
    selected: function (newRole) {
      this.selected = newRole
    }
  },
  methods: {
    changeValue: function (newValue) {
      this.selectedValue = newValue
    },
    addGeneric: function () {
      this.location.arrayGeneric.push({
        nameProp: '',
        valueProp: '',
        picked: true
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
