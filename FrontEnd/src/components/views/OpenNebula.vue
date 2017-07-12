<template>
  <section class="content">
    <div class="row center-block">
      <OpenNebulaVMItem
        v-for="(vmDetail, index) in this.VMList"
        :vmDetails="vmDetail"
        :key="vmDetail"
        v-on:removeVMItem="removeVMItem(index)"
        v-on:errorMessage="errorMessage"
        v-on:successMessage="successMessage">
      </OpenNebulaVMItem>
  </div>

    <div v-if="responseError" class="alert alert-danger alert-dismissable">
       <i class="fa fa-ban"></i>
       <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
       <b>Alert! </b>{{this.responseError}}
    </div>

    <div v-if="responseSuccess" class="alert alert-success alert-dismissable">
      <i class="fa fa-check"></i>
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
      <b>Alert! </b> {{this.responseSuccess}}
    </div>

  </section>
</template>

<script>
import axios from 'axios'
import OpenNebulaVMItem from './OpenNebulaVMItem'

export default {
  data () {
    return {
      VMList: [{
        id: '',
        name: '',
        user: '',
        state: '',
        deplyId: '',
        realTime_CPU: '',
        realTime_MEMORY: '',
        realTime_STATE: '',
        templateId: ''
      }],
      responseSuccess: false,
      responseError: false
    }
  },
  methods: {
    removeVMItem: function (index) {
      console.log('passou')
      this.VMList.splice(index, 1)
    },
    errorMessage: function (msgError) {
      var self = this
      self.responseSuccess = false
      self.responseError = msgError
    },
    successMessage: function (msgSuccess) {
      var self = this
      self.responseError = false
      self.responseSuccess = msgSuccess
    }
  },
  created () {
    var self = this
    axios.get('/api/opennebula/listVMs')
      .then(function (response) {
        if (response.data.status === 'ok') {
          console.log(response.data.message)
          self.VMList = response.data.message
          // self.responseSuccess = response.data
        } else {
          self.responseError = response.data.message
        }
      })
      .catch(error => {
        self.responseError = error.response
      })
  },
  components: {
    OpenNebulaVMItem: OpenNebulaVMItem
  }
}
</script>

<style>

</style>
