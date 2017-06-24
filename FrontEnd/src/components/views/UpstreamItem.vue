<template>

  <div class="row center-block" style="margin-top: 0.5em">
      <div class="col-xs-6">
        <div :class="{ 'has-error': errors.has('name') }">
          <input name="name" v-model="upstream.name" v-validate="'required'" placeholder="Host"  class="form-control" type="text">
          <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
        </div>
      </div>
      <div class="col-xs-4">
        <div :class="{ 'has-error': errors.has('weight') }">
          <input name="weight" v-model="upstream.weight" v-validate="'required|numeric'" placeholder="Weight"  class="form-control" type="text">
          <span v-show="errors.has('weight')" class="help-block">{{ errors.first('weight') }}</span>
        </div>
      </div>
      <div class="col-xs-2">
          <button @click="remove" type="button" class="btn btn-danger fa fa-times"></button>
      </div>
  </div>

</template>

<script>
import { EventBus } from '../../main.js'
import { find, propEq } from 'ramda'

export default {
  props: {
    upstream: {
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
        console.log('Upstream Validated')
      }).catch(() => {
        console.log('error Upstream')
        EventBus.$emit('errors-changed', this.errors.errors)
      })
    },
    remove: function () {
      this.$emit('removeUpstream')
    }
  }
}
</script>

<style>

</style>
