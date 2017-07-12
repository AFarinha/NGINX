<template>
  <section class="content">
    <div class="form-group col-md-3">
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">VM - {{this.vmDetails.name}}</h3>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
          <div class="form-group">
            <span :class="{ 'badge bg-green': vmDetails.state == 'ACTIVE', 'badge bg-red': vmDetails.state != 'ACTIVE',  }"> {{vmDetails.state}}</span>
          </div>

          <strong><i class="fa fa-book margin-r-5"></i> User</strong>

          <p class="text-muted">
            {{this.vmDetails.user}}
          </p>

          <hr>

          <strong><i class="fa fa-map-marker margin-r-5"></i> Metrics</strong>

          <p class="text-muted">Malibu, California</p>

          <hr>

          <strong><i class="fa fa-pencil margin-r-5"></i> Skills</strong>

          <p>
            <span class="label label-danger">UI Design</span>
            <span class="label label-success">Coding</span>
            </p>
            <p>
            <span class="label label-info">Javascript</span>
            <span class="label label-warning">PHP</span>
            <span class="label label-primary">Node.js</span>
          </p>

          <hr>

          <strong><i class="fa fa-file-text-o margin-r-5"></i> Notes</strong>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam fermentum enim neque.</p>
        </div>
        <!-- /.box-body -->
      </div>
    </div>



    <div class="form-group col-md-3">
      {{this.vmDetails}}
      <div class="box box-primary">
        <div class="box-header">
            <h3 class="box-title"><b> VM - {{this.vmDetails.name}} </b></h3>
            <div class="box-tools pull-right">
              <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
            </div>
        </div>
        <div class="box-body">
          <div class="row center-block">

            <div class="form-group">
              <span :class="{ 'badge bg-green': vmDetails.state == 'ACTIVE', 'badge bg-red': vmDetails.state != 'ACTIVE',  }"> {{vmDetails.state}}</span>
            </div>


            <div class="form-group col-md-6">
              <h5><b> User  </b></h5>
                <input name="vmame" v-model="vmDetails.user" class="form-control" type="text" placeholder="vmame" >
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
