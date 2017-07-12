<template>
  <div class="row center-block" style="margin-top: 0.5em">
      <div class="col-xs-3">
        <div :class="{ 'has-error': vErrors.has('type') }">
          <basic-select :options="directives"
                v-model="upstream.type"
                name="type"
                :selected-option="itemDirective"
                placeholder="Propertie"
                @select="onSelectDirective">
              </basic-select>
        </div>
      </div>
      <div class="col-xs-4">
        <div :class="{ 'has-error': vErrors.has('subType') }">
          <input :disabled="readOnly" name="subType" v-model="upstream.subType" v-validate="'required'" v-bind:placeholder="this.info.syntax"  class="form-control" type="text">
          <span v-show="vErrors.has('subType')" class="help-block">{{ vErrors.first('subType') }}</span>
        </div>
      </div>
      <div class="col-xs-3">
        <div :class="{ 'has-error': vErrors.has('config') }">
          <input :disabled="readOnly" name="config" v-model="upstream.config" placeholder="[parameter|optional]"  class="form-control" type="text">
          <span v-show="vErrors.has('config')" class="help-block">{{ vErrors.first('config') }}</span>
        </div>
      </div>
      <div class="col-xs-1" v-if="!readOnly">
          <button @click="remove" type="button" class="btn btn-danger fa fa-times"></button>
      </div>
      <div class="col-xs-1">
          <a v-bind:href="info.link" v-if="upstream.type" target="_blank">
            <i class="fa fa-info" style="font-size:24px;margin-top: 0.1em;"></i>
          </a>
      </div>
       
  </div>
  
</template>

<script>
import { EventBus } from '../../main.js'
import { find, propEq } from 'ramda'
import { BasicSelect } from 'vue-search-select'
import axios from 'axios'

export default {
  props: {
    upstream: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    },
    contextType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      directives: [],
      itemDirective: {
        value: '',
        text: ''
      },
      info: {context: '', default: '', syntax: '', link: ''}
    }
  },
  created () {
    var self = this
    // ir buscar as diretivas
    axios.get('/api/getDirectivesFilter/' + self.contextType)
      .then(function (response) {
        console.log('/api/getDirectivesFilter/')
        self.directives = JSON.parse(JSON.stringify(response.data.message))
        // console.log(self.directives)
      })
      .catch(error => {
        console.log(error)
      })
      // Bind da itemDirective
    this.itemDirective.value = self.upstream.type
    this.itemDirective.text = self.upstream.type
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
        console.log('UpstreamItem Validated')
      }).catch(() => {
        console.log('error UpstreamItem')
        EventBus.$emit('errors-changed', this.vErrors.errors)
      })
    },
    remove: function () {
      this.$emit('removeUpstream')
    },
    onSelectDirective (item) {
      var self = this
      self.itemDirective = item
      this.upstream.type = item.text
      for (var i = self.directives.length - 1; i >= 0; i--) {
        if (self.directives[i].text === item.text) {
          self.info.context = self.directives[i].context
          self.info.syntax = self.directives[i].syntax
          self.info.default = 'Default: ' + self.directives[i]._default
          self.info.link = 'https://' + self.directives[i].link
        }
      }
    },
    resetDiretive () {
      var self = this
      self.itemDirective = {}
    },
    selectOptionDiretive () {
      // select option from parent component
      var self = this
      self.itemDirective = this.directives[0]
    }
  },
  components: {
    BasicSelect
  }
}
</script>

<style>

</style>
