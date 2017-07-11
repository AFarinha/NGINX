<template>
  <div class="row">
    <div class="col-md-6">

    </div>
    <div class="col-md-6">

      <div class="row" style="margin-top: 0.5em">
          <div class="col-xs-5">
            <div :class="{ 'has-error': vErrors.has('nameProp') }">
              <basic-select :options="directives"
                v-model="generic.nameProp"
                name="nameProp"
                :selected-option="itemDirective"
                placeholder="Propertie"
                @select="onSelectDirective">
              </basic-select>
              <span v-show="vErrors.has('nameProp')" class="help-block">{{ vErrors.first('nameProp') }}</span>
            </div>
          </div>
          <div class="col-xs-5">
            <div :class="{ 'has-error': vErrors.has('valueProp') }">
              <input name="valueProp" v-model="generic.valueProp" v-validate="'required'" placeholder="Value Propertie"  class="form-control" type="text">
              <span v-show="vErrors.has('valueProp')" class="help-block">{{ vErrors.first('valueProp') }}</span>
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
import { BasicSelect } from 'vue-search-select'
import axios from 'axios'

export default {
  props: {
    generic: {
      type: Object,
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
      }
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
    this.itemDirective.value = self.generic.nameProp
    this.itemDirective.text = self.generic.nameProp
  },
  methods: {
    onValidate: function () {
      this.$validator.validateAll().then(() => {
        console.log('GenericItem Validated')
      }).catch(() => {
        console.log('error GenericItem')
        EventBus.$emit('errors-changed', this.vErrors.errors)
      })
    },
    remove: function () {
      this.$emit('removeGeneric')
    },
    onSelectDirective (item) {
      this.itemDirective = item
      this.generic.nameProp = item.text
    },
    resetDiretive () {
      this.itemDirective = {}
    },
    selectOptionDiretive () {
      // select option from parent component
      this.itemDirective = this.directives[0]
    }
  },
  components: {
    BasicSelect
  }
}
</script>

<style>

</style>
