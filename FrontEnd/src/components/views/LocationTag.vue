<template>
<section class="">
  <div class="box box-solid box-primary " style="background:transparent !important">
    <div class="box-header">
      <h3 class="box-title"><b> Location </b></h3>
      <div class="box-tools pull-right">
        <button class="btn btn-danger btn-sm" data-widget="remove" @click="removeLocation" ><i class="fa fa-times"></i></button>
	      <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
      </div>
    </div>
    <div class="box-body">
      <div class="content">
        <div class="row">
          <div class="col-md-6">
            <div class="box box-solid box-default">
              <div class="box-header">
                <h3 class="box-title">Regex Path </h3>
                <div class="box-tools pull-right">
                  <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
                  <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
                </div>
              </div>
              <div class="box-body">
                <div class="row">
                  <div class="form-group col-md-6">
	                  <input type="radio" id="one" value="1" name="loc" v-model="selected">
          					<label for="one">Generic</label>
          					<br>
        				  </div>

        					<div class="form-group col-md-6">
          					<input type="radio" id="two" value="2" name="loc" v-model="selected">
          					<label for="two">File Types</label>
          					<br>
        					</div>
      				  </div>
	             <div class="row">
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
                  <multiselect
                    v-model="location.pathFileType"
                    :options="options"
                    :multiple="true"
                    :taggable="true"
                    @tag="addTag"
                    tag-placeholder="Add this as new tag"
                    >
                  </multiselect>
                  <span v-show="errors.has('path')" class="help-block">{{ errors.first('path') }}</span>
                </div>
              </div>
              <!-- FIM LOCATION PATH -->
                </div>
              </div>
            </div>
		       </div>
           <!-- Begin Proxy Pass -->
          <div class="col-md-6">
            <div class="box box-solid box-default">
              <div class="box-header">
                <h3 class="box-title">Proxy Pass</h3>
                <div class="box-tools pull-right">
                  <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
                  <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
                </div>
              </div>
              <div class="box-body">
                  <input type="checkbox" v-model="location.IsProxyPass"> <b> Proxy Pass </b>
                  <br />
                  <div :class="{ 'has-error': errors.has('proxyPass') }">
                    <input name="proxyPass" v-model="location.proxyPass" v-validate="`${(location.IsProxyPass || location.arrayUpstreams.length != 0) ? 'required' : ''}`" class="form-control" type="text" placeholder="Proxy Pass">
                    <span v-show="errors.has('proxyPass')" class="help-block">{{ errors.first('proxyPass') }}</span>
                  </div>
              </div>
            </div>
          </div>
          <!-- End Proxy Pass -->
        </div>
        <div class="row">
          <!-- Begin Upstreams -->
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
                <UpstreamItem v-for="(upstream, index) in this.location.arrayUpstreams" :upstream="upstream" :key="upstream" v-on:removeUpstream="removeUpstream(index)">
                </UpstreamItem>
                </br>
                <button @click="addUpstream" type="button" class="btn btn-success">Add Upstream item</button>
              </div>
            </div>
          </div>
          <!-- End Upstreams -->

          <!-- Begin Cache -->
          <div class="col-md-6">
            <div class="box box-solid box-default">
              <div class="box-header">
                <h3 class="box-title">Location - Cache</h3>
                <div class="box-tools pull-right">
                  <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
                </div>
              </div>
              <div class="box-body">
                <div class="row">
                  <div class="col-md-6">
                    <input type="checkbox" v-model="this.location.cacheServer" @change="changeCacheServer"> <b>Cache Server</b>
                  </div>
                <div class="col-md-6">
                  <input type="checkbox" v-model="this.location.cacheClient"  @change="showHideTime" > <b>Cache Browser</b>
                </div>
              </div>
              <div class="row center-block" style="margin-top: 0.5em" v-show="this.location.cacheClient" >
                <h5>Time Client Cache</h5>
                  <div class="col-xs-6">
                    <div :class="{ 'has-error': errors.has('ClientCache') }" >
                      <input name="ClientCache" v-model="location.cacheClientTimeNumber" v-validate="`${location.cacheClient  ? 'required|numeric' : ''}`" class="form-control" type="text" placeholder="Time to Cache">
                      <span v-show="errors.has('ClientCache')" class="help-block">{{ errors.first('ClientCache') }}</span>
                    </div>
                  </div>
                  <div class="col-xs-6">
                    <select v-model="location.cacheClientTimeUnit" class="form-control">
                      <option v-for="timeUnit in ddlTimeUnit"  :value="timeUnit"> {{ timeUnit.description }} </option>
                  </select>
                  </div>
              </div>
            </div>
          </div>
        </div>
          <!-- End Cache -->
        </div>
        <div class="row">
          <!-- Begin LocationsGeneric -->
		  <div class="col-md-12">
			  <div class="box box-solid box-default">
				<div class="box-header">
				  <h3 class="box-title">Location - Generic Items</h3>
				  <div class="box-tools pull-right">
					<button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
					<!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
				  </div>
				</div>
				<div class="box-body">
				  <GenericItem v-for="(generic, index) in this.location.arrayGeneric" :generic="generic" :key="generic" v-on:removeGeneric="removeGeneric(index)">
				  </GenericItem>
				  <button @click="addGeneric" type="button" class="btn btn-success">Add Generic Item</button>
				</div>
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
import Multiselect from 'vue-multiselect'
import { EventBus } from '../../main.js'
import { find, propEq } from 'ramda'
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
      selected: '1',
      selectedCacheClient: true,
      ddlTimeUnit: [
        {code: 'ms', description: 'milliseconds'},
        {code: 's', description: 'seconds'},
        {code: 'm', description: 'minutes'},
        {code: 'h', description: 'hours'},
        {code: 'd', description: 'days'},
        {code: 'w', description: 'weeks'}
      ],
      options: ['list', 'of', 'options']
    }
  },
  mounted: function () {
    // Listen on the bus for the parent component running validation
    EventBus.$on('validate', this.onValidate)
    // Watch for the changes to the childs error bag and pass back to the parent
    this.$watch(() => this.errors.errors, (newValue, oldValue) => {
      const newErrors = newValue.filter(error =>
        find(propEq('field', error.field))(oldValue) === undefined
      )
      const oldErrors = oldValue.filter(error =>
        find(propEq('field', error.field))(newValue) === undefined
      )
      EventBus.$emit('errors-changed', newErrors, oldErrors)
    })
  },
  watch: {
    selected: function (newRole) {
      this.selected = newRole
      this.location.pathGeneric = newRole === '1'
    }
  },
  methods: {
    onValidate: function () {
      this.$validator.validateAll().then(() => {
        console.log('Location Validated')
      }).catch(() => {
        console.log('error Location')
        EventBus.$emit('errors-changed', this.errors.errors)
      })
    },
    addTag (newTag) {
      this.location.pathFileType.push(newTag)
      this.options.push(newTag)
    },
    showHideTime: function () {
      this.location.cacheClient = !this.location.cacheClient
    },
    changeCacheServer: function () {
      this.location.cacheServer = !this.location.cacheServer
    },
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
    UpstreamItem: UpstreamItem,
    Multiselect: Multiselect
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
