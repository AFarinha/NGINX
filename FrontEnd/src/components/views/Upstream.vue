<template>
  <section class="">
    {{upstream}}
    <div :class="{ 'has-error': vErrors.has('proxyPass') }">
      <input :disabled="readOnly" name="proxyPass" v-validate="'required'" v-model="upstream.upstreamName" class="form-control" type="text" placeholder="Upstream name">
      <span v-show="vErrors.has('proxyPass')" class="help-block">{{ vErrors.first('proxyPass') }}</span>
    </div>
    <UpstreamItem :readOnly="readOnly" v-for="(upstream, index) in this.upstream.arrayUpstreamItems" :upstream="upstream" :key="upstream" v-on:removeUpstream="removeUpstream(index)">
    </UpstreamItem>

  </section>
</template>

<script>
import UpstreamItem from './UpstreamItem'
import { EventBus } from '../../main.js'
import { find, propEq } from 'ramda'

export default {
  props: {
    upstream: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      responseSuccess: false,
      responseError: false
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
        console.log('upstream Validated')
      }).catch(() => {
        console.log('error upstream')
        EventBus.$emit('errors-changed', this.vErrors.errors)
      })
    },
    removeUpstream (index) {
      var self = this
      if (index > 0) {
        self.upstream.arrayUpstreamItems.splice(index, 1)
      } else {
        self.responseSuccess = false
        self.responseError = 'É necessário existir pelo menos 1 item'
      }
    }
  },
  components: {
    UpstreamItem: UpstreamItem
  }
}
</script>

<style>

</style>
