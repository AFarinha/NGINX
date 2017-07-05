<template>

  <div class="row center-block" style="margin-top: 0.5em">
      <div class="col-xs-3">
        <div :class="{ 'has-error': vErrors.has('type') }">
          <input name="type" v-model="upstream.type" v-validate="'required'" placeholder="server"  class="form-control" type="text">
          <span v-show="vErrors.has('type')" class="help-block">{{ vErrors.first('type') }}</span>
        </div>
      </div>
      <div class="col-xs-4">
        <div :class="{ 'has-error': vErrors.has('subType') }">
          <input name="subType" v-model="upstream.subType" v-validate="'required'" placeholder="HostName"  class="form-control" type="text">
          <span v-show="vErrors.has('subType')" class="help-block">{{ vErrors.first('subType') }}</span>
        </div>
      </div>
      <div class="col-xs-4">
        <div :class="{ 'has-error': vErrors.has('config') }">
          <input name="config" v-model="upstream.config" placeholder="weight=1|optional"  class="form-control" type="text">
          <span v-show="vErrors.has('config')" class="help-block">{{ vErrors.first('config') }}</span>
        </div>
      </div>
      <div class="col-xs-1">
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
    this.$watch(() => this.vErrors.errors, (newValue, oldValue) => {
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
        EventBus.$emit('errors-changed', this.vErrors.errors)
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
