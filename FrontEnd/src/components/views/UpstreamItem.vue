<template>

    <div class="form-group">
        <input v-model="upstream.name"  class="form-control" type="text">
        <input v-model="upstream.ip" class="form-control" type="text">
        <input v-model="upstream.weight" class="form-control" type="text">removeUpstream

        <button @click="remove">Remove Upstream item</button>
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
