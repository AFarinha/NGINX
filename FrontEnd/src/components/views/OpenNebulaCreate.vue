<template>
  <section class="content">
    <div class="row center-block">
      {{this.vm}}
      <div class="box box-solid box-primary">
        <div class="box-header">
            <h3 class="box-title"><b> Create VM </b></h3>
            <div class="box-tools pull-right">
              <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
            </div>
        </div>
        <div class="box-body">
          <div class="row center-block">
            <div class="form-group col-md-6">
              <h5><b> Host </b></h5>
              <div :class="{ 'has-error': vErrors.has('vmame') }" >
                <input name="vmame" v-model="vm.vmName" v-validate="'required'" class="form-control" type="text" placeholder="vmame" >
                <span v-show="vErrors.has('vmame')" class="help-block">{{ vErrors.first('vmame') }}</span>
              </div>
            </div>
            <div class="form-group col-md-6">
              <h5><b>HostName </b></h5>
              <div :class="{ 'has-error': vErrors.has('hostname') }">
                <input name="hostname" v-model="vm.hostname" class="form-control" type="text" placeholder="hostname" >
                <span v-show="vErrors.has('vmssh')" class="help-block">{{ vErrors.first('hostname') }}</span>
              </div>
            </div>
          </div>
          <div class="row center-block">
            <div class="form-group col-md-6">
              <h5><b>Template </b></h5>
                <select v-model="vm.templateId" class="form-control" >
                  <option v-for="option in this.templateList" v-bind:value="option.id">
                    <div class="row center-block">
                      {{ option.name }}
                    </div>
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group col-md-6">
            </div>
          </div>
          <div class="row center-block">
            <div class="form-group col-md-12">
              <h5><b>SSH </b></h5>
              <div :class="{ 'has-error': vErrors.has('vmssh') }">
                <textarea  name="vmssh" v-model="vm.sshKey" class="form-control" rows="3" type="text" placeholder="vmssh" ></textarea>
                <span v-show="vErrors.has('vmssh')" class="help-block">{{ vErrors.first('vmssh') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="box box-solid box-primary">
      <div class="box-header">
          <h3 class="box-title"><b> Config VM </b></h3>
          <div class="box-tools pull-right">
          </div>
      </div>
      <div class="box-body">
    <div class="row">
      <div class="form-group col-md-6">
        <input type="radio" id="dashboard" value="false" name="prox" v-model="vm.isCollector">
        <label for="one">Dashboard</label>
        <br>
      </div>

      <div class="form-group col-md-6">
        <input type="radio" id="collector" value="true" name="prox" v-model="vm.isCollector">
        <label for="two">Collector</label>
        <br>
      </div>
    </div>

   <div class="row">
    <div class="form-group col-md-6" v-if="this.vm.isCollector == 'false'" >
      <label for="two">A Virtual Machine will be deployed configured with a new Dashboard</label>
    </div>
    <div class="form-group col-md-6" v-if="this.vm.isCollector == 'true'" >
      <div class="form-group col-md-12">
        <h5><b>IP </b></h5>
        <div :class="{ 'has-error': vErrors.has('ipStation') }">
          <input name="ipStation" v-model="vm.ipStation" class="form-control" type="text" placeholder="ipStation" >
          <span v-show="vErrors.has('ipStation')" class="help-block">{{ vErrors.first('ipStation') }}</span>
        </div>
      </div>
    </div>
   </div>
   </div>
   </div>


          <button v-on:click="CreateVM" type="button" class="btn btn-info">Create Vm</button>

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
  data () {
    return {
      vm: {
        sshKey: '',
        vmName: 'collector1',
        isCollector: 'true',
        ipStation: 'http://192.168.1.200:8080',
        hostname: 'collector1',
        templateId: '8'
      },
      templateList: [],
      responseSuccess: false,
      responseError: false
    }
  },
  methods: {
    CreateVM: function () {
      var self = this
      axios.post('/api/opennebula/createVM', self.vm)
        .then(function (response) {
          self.responseSuccess = response.data
        })
        .catch(error => {
          self.responseError = error.response
        })
    }
  },
  created () {
    var self = this
    axios.get('/api/opennebula/listTemplates')
      .then(function (response) {
        if (response.data.status === 'ok') {
          console.log(response.data.message)
          self.templateList = response.data.message
          // self.responseSuccess = response.data
        } else {
          self.responseError = response.data.message
        }
      })
      .catch(error => {
        self.responseError = error.response
      })
  }
}
</script>

<style>

</style>
