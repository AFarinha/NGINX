<template>
  <div class="row">
    <div class="col-md-6">

    </div>
    <div class="col-md-6">

      <div class="row" style="margin-top: 0.5em">
          <div class="col-xs-5">
            <div :class="{ 'has-error': errors.has('nameProp') }">
              <input name="nameProp" v-model="generic.nameProp" v-validate="'required'" placeholder="Name Propertie"  class="form-control" type="text">
              <span v-show="errors.has('nameProp')" class="help-block">{{ errors.first('nameProp') }}</span>
            </div>
          </div>
          <div class="col-xs-5">
            <div :class="{ 'has-error': errors.has('valueProp') }">
              <input name="valueProp" v-model="generic.valueProp" v-validate="'required'" placeholder="Value Propertie"  class="form-control" type="text">
              <span v-show="errors.has('valueProp')" class="help-block">{{ errors.first('valueProp') }}</span>
            </div>
          </div>
          <div class="col-xs-2">
              <button @click="remove" type="button" class="btn btn-danger fa fa-times" ></button>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
import { EventBus } from '../../main.js'
import { find, propEq } from 'ramda'

export default {
  props: {
    generic: {
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
        console.log('GenericItem Validated')
      }).catch(() => {
        console.log('error GenericItem')
        EventBus.$emit('errors-changed', this.errors.errors)
      })
    },
    remove: function () {
      this.$emit('removeGeneric')
    }
  }
}
</script>

<style>

</style>
