<template>
<section class="content">
  {{server}}
  <div class="row center-block">
    <div :class="{ 'has-error': errors.has('host') }">
      <label v-show="errors.has('host')" class="control-label" ><i :class="{'fa fa-fw fa-times-circle-o': errors.has('host')  }"></i>  {{errors.has('host') ? 'Input with error' : '' }}</label>
      <input name="host" v-model="server.host" v-validate="'required'" class="form-control" type="text" placeholder="Host">
      <span v-show="errors.has('host')" class="help-block">{{ errors.first('host') }}</span>
    </div>
    <div class="form-group">
      <h4>Port</h4>
      <div :class="{ 'has-error': errors.has('port') }">
        <label v-show="errors.has('port')" class="control-label" ><i :class="{'fa fa-fw fa-times-circle-o': errors.has('port')  }"></i>  {{errors.has('port') ? 'Input with error' : '' }}</label>
        <input name="port" v-model="server.port" v-validate="'required'" class="form-control" type="text" placeholder="port">
        <span v-show="errors.has('port')" class="help-block">{{ errors.first('port') }}</span>
      </div>
    </div>
    <div class="form-group">
      <h4>Destination</h4>
      <div :class="{ 'has-error': errors.has('destination') }">
        <label v-show="errors.has('destination')" class="control-label" ><i :class="{'fa fa-fw fa-times-circle-o': errors.has('destination')  }"></i>  {{errors.has('destination') ? 'Input with error' : '' }}</label>
        <input name="destination" v-model="server.destination" v-validate="'required'" class="form-control" type="text" placeholder="Destination">
        <span v-show="errors.has('destination')" class="help-block">{{ errors.first('destination') }}</span>
      </div>
    </div>

    <GenericItem v-for="(generic, index) in this.server.arrayGenericServer"
      :generic="generic"
      :key= "generic"
      v-on:removeGeneric="removeGeneric(index)" >
    </GenericItem>

        <button @click="addGeneric">Add generic item</button>

      <LocationTag v-for="(location, index) in this.server.arrayLocations"
        :location="location"
        :key= "location"
        v-on:removeLocation="removeLocation(index)"
         >
      </LocationTag>
      <button @click="addLocation">AddLocation</button>
      <button @click="onValidate">teste</button>
  </div>

</section>
</template>

<script>
import GenericItem from './GenericItem'
import LocationTag from './LocationTag'
import { EventBus } from '../../main.js'
import { find, propEq } from 'ramda'

export default {
  props: {
    server: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

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
  methods: {
    onValidate: function () {
      this.$validator.validateAll().then(() => {
        console.log('ServerTag Validated')
      }).catch(() => {
        console.log('error ServerTag')
        EventBus.$emit('errors-changed', this.errors.errors)
      })
    },
    addGeneric: function () {
      this.server.arrayGenericServer.push({nameProp: '', valueProp: ''})
    },
    removeGeneric (index) {
      this.server.arrayGenericServer.splice(index, 1)
    },
    addLocation: function () {
      this.server.arrayLocations.push({ path: '', arrayUpstreams: [], arrayGeneric: [] })
    },
    removeLocation (index) {
      this.server.arrayLocations.splice(index, 1)
    }
  },
  components: {
    GenericItem: GenericItem,
    LocationTag: LocationTag
  }
}
</script>

<style>

</style>
