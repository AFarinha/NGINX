<template>
  <section class="content">
    <div class="row center-block">
      {{this.vmDetails}}
      <div class="box box-solid box-primary">
        <div class="box-header">
            <h3 class="box-title"><b> VM - {{this.vmDetails.name}} </b></h3>
            <div class="box-tools pull-right">
              <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
            </div>
        </div>
        <div class="box-body">
          <div class="row center-block">

            <div class="form-group col-md-6">
              <h5><b> User  </b></h5>
                <input name="vmame" v-model="vmDetails.user" class="form-control" type="text" placeholder="vmame" >
              </div>

            <div class="form-group col-md-6">
              <h5><b> state  </b></h5>
                <input name="vmame" v-model="vmDetails.state" class="form-control" type="text" placeholder="vmame" >
              </div>

            <div class="form-group col-md-6">
              <h5><b> deplyId  </b></h5>
                <input name="vmame" v-model="vmDetails.deplyId" class="form-control" type="text" placeholder="vmame" >
              </div>

            <div class="form-group col-md-6">
              <h5><b> realTime_CPU  </b></h5>
                <input name="vmame" v-model="vmDetails.realTime_CPU" class="form-control" type="text" placeholder="vmame" >
              </div>

            <div class="form-group col-md-6">
              <h5><b> realTime_MEMORY  </b></h5>
                <input name="vmame" v-model="vmDetails.realTime_MEMORY" class="form-control" type="text" placeholder="vmame" >
              </div>

            <div class="form-group col-md-6">
              <h5><b> realTime_STATE  </b></h5>
                <input name="vmame" v-model="vmDetails.realTime_STATE" class="form-control" type="text" placeholder="vmame" >
              </div>
              <div class="form-group col-md-6">
                <h5><b> templateId  </b></h5>
                  <input name="vmame" v-model="vmDetails.templateId" class="form-control" type="text" placeholder="vmame" >
                </div>
          </div>
          </div>
        </div>
      </div>

          <button v-on:click="deleteVM" type="button" class="btn btn-info">Delete</button>
          <button v-on:click="rebootVM" type="button" class="btn btn-info">Reboot</button>
          <button v-on:click="resumeVM" type="button" class="btn btn-info">Resume</button>
          <button v-on:click="poweroffVM" type="button" class="btn btn-info">PowerOff</button>

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

export default {
  props: {
    vmDetails: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      responseError: false,
      responseSuccess: false
    }
  },
  methods: {
    rebootVM: function () {
      var self = this
      axios.get('/api/opennebula/rebootVM/')
        .then(function (response) {
          self.responseSuccess = response.data
        })
        .catch(error => {
          self.responseError = error.response
        })
    },
    resumeVM: function () {
      var self = this
      axios.get('/api/opennebula/resumeVM/')
        .then(function (response) {
          self.responseSuccess = response.data
        })
        .catch(error => {
          self.responseError = error.response
        })
    },
    poweroffVM: function () {
      var self = this
      axios.get('/api/opennebula/poweroffVM/')
        .then(function (response) {
          self.responseSuccess = response.data
        })
        .catch(error => {
          self.responseError = error.response
        })
    },
    deleteVM: function () {
      var self = this
      axios.get('/api/opennebula/deleteVM/')
        .then(function (response) {
          if (response.data.status === 'ok') {
            // Mandar evento para o pai
            self.responseSuccess = response.data
          } else {
            self.responseError = response.data
          }
        })
        .catch(error => {
          self.responseError = error.response
        })
    }
  }
}
</script>

<style>

</style>
