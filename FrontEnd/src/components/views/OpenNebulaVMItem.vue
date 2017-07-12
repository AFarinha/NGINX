<template>
  <div>
    <div class="form-group col-md-3">
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">VM - {{this.vmDetails.name}}</h3> <span :class="{ 'badge bg-green': vmDetails.state == 'ACTIVE', 'badge bg-red': vmDetails.state != 'ACTIVE',  }"> {{vmDetails.state}}</span>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
          <div class="row center-block">
            <strong><i class="fa fa-book margin-r-5"></i> IP</strong>

            <p class="text-muted">
              {{this.vmDetails.IP}}
            </p>
            <hr>
            <strong><i class="fa fa-map-marker margin-r-5"></i> Metrics</strong>
              <br />
              <br />
            <div>
              <span class="label label-info">CPU:</span><span> {{'  ' + vmDetails.realTime_CPU}}</span>
              <br />
              <span class="label label-info">Memory:</span><span>{{'   ' +vmDetails.realTime_MEMORY}}</span>
            </div>
            <hr>
            <strong><i class="fa fa-pencil margin-r-5"></i> Template</strong>
            <p>{{vmDetails.templateName}}</p>
            <hr>
            <strong><i class="fa fa-pencil margin-r-5"></i> Actions</strong>
            <br />
            <button v-on:click="resumeVM" type="button" class="btn btn-info"><i class="fa fa-play"></i></button>
            <button v-on:click="rebootVM" type="button" class="btn btn-info"><i class="fa fa-repeat"></i></button>
            <button v-on:click="poweroffVM" type="button" class="btn btn-info"><i class="fa fa-power-off"></i></button>
            <button v-on:click="deleteVM" type="button" class="btn btn-info"><i class="fa fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
    }
  },
  methods: {
    rebootVM: function () {
      var self = this
      axios.get('/api/opennebula/rebootVM/' + self.vmDetails.id)
        .then(function (response) {
          if (response.data.status === 'ok') {
            self.$emit('successMessage', response.data)
          } else {
            self.$emit('errorMessage', response.data)
          }
        })
        .catch(error => {
          self.$emit('errorMessage', error.data)
        })
    },
    resumeVM: function () {
      var self = this
      axios.get('/api/opennebula/resumeVM/' + self.vmDetails.id)
        .then(function (response) {
          if (response.data.status === 'ok') {
            self.$emit('successMessage', response.data)
          } else {
            self.$emit('errorMessage', response.data)
          }
        })
        .catch(error => {
          self.$emit('errorMessage', error.data)
        })
    },
    poweroffVM: function () {
      var self = this
      axios.get('/api/opennebula/poweroffVM/' + self.vmDetails.id)
        .then(function (response) {
          if (response.data.status === 'ok') {
            this.$emit('successMessage', response.data)
          } else {
            this.$emit('errorMessage', response.data)
          }
        })
        .catch(error => {
          this.$emit('errorMessage', error.data)
        })
    },
    deleteVM: function () {
      var self = this
      axios.get('/api/opennebula/deleteVM/' + self.vmDetails.id)
        .then(function (response) {
          if (response.data.status === 'ok') {
            self.$emit('removeVMItem')
            self.$emit('successMessage', response.data)
          } else {
            self.$emit('errorMessage', response.data)
          }
        })
        .catch(error => {
          self.$emit('errorMessage', error.data)
        })
    }
  }
}
</script>

<style>

</style>
