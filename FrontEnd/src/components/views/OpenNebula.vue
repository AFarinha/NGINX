<template>
  <section class="content">
    <div class="row center-block">
      <div class="box box-solid box-primary">
        <div class="box-header">
            <h3 class="box-title"><b> Create VM</b></h3>
            <div class="box-tools pull-right">
                <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
              <!--  <button class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i></button> -->
            </div>
        </div>
        <div class="box-body">
          <div class="form-group col-md-6">
            <h5><b> Host </b></h5>
            <div :class="{ 'has-error': vErrors.has('vmame') }" >
              <input name="vmame" v-model="vm.vmName" v-validate="'required'" class="form-control" type="text" placeholder="vmame" >
              <span v-show="vErrors.has('vmame')" class="help-block">{{ vErrors.first('vmame') }}</span>
            </div>
          </div>
          <div class="form-group col-md-6">
            <h5><b>Port </b></h5>
            <div :class="{ 'has-error': vErrors.has('vmssh') }">
              <input name="vmssh" v-model="vm.sshKey" class="form-control" type="text" placeholder="vmssh" >
              <span v-show="vErrors.has('vmssh')" class="help-block">{{ vErrors.first('vmssh') }}</span>
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
        vmName: 'Name',
        isCollector: true,
        ipStation: '192.168.1.200:8080'
      },
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
  }
}
</script>

<style>
/* Using the bootstrap style, but overriding the font to not draw in
   the Glyphicons Halflings font as an additional requirement for sorting icons.

   An alternative to the solution active below is to use the jquery style
   which uses images, but the color on the images does not match adminlte.

@import url('/static/js/plugins/datatables/jquery.dataTables.min.css');
*/

@import url('/static/js/plugins/datatables/dataTables.bootstrap.css');

table.dataTable thead .sorting:after,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc:after {
  font-family: 'FontAwesome';
}

table.dataTable thead .sorting:after {
  content: "\f0dc";
}

table.dataTable thead .sorting_asc:after {
  content: "\f0dd";
}

table.dataTable thead .sorting_desc:after {
  content: "\f0de";
}
</style>
