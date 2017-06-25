<template>
  <section class="content">

    <div class="row center-block">

      <div class="form-group col-md-4" v-for="(item, index) in this.server">
        <router-link :to="`/VHost/${item.id}`" >
          <div class="box box-solid box-primary">
            <div class="box-header">
                <h3 class="box-title"><b>{{item.name}}</b></h3>
            </div>
            <div class="box-body">
                <div class="form-group col-md-6">
                  <h5><b>Status </b></h5>
                  <input name="port" value="Active" class="form-control" type="text" placeholder="Status">
                </div>
                <div class="form-group col-md-6">
                  <h5><b>Port </b></h5>
                  <input name="port" v-model="item.port" class="form-control" type="text" placeholder="Port">
                </div>
                <div class="form-group col-md-6">
                  <h5><b>Instance </b></h5>
                  <input name="port" v-model="item.instance" class="form-control" type="text" placeholder="instance">
                </div>
              </div>
            </div>
          </router-link>
        </div>

      </div>
    </div>





    <div class="row center-block">
      <h2>Data tables</h2>
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Data Table With Full Features</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body">
            <div class="dataTables_wrapper form-inline dt-bootstrap" id="listVhosts_wrapper">
              <div class="row">
                <div class="col-sm-6">
                  <div id="listVhosts_length" class="dataTables_length">

                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 table-responsive">
                  <table aria-describedby="listVhosts_info" role="grid" id="listVhosts" class="table table-bordered table-striped dataTable">
                    <thead>
                      <tr role="row">
                        <th aria-label="HostName: activate to sort column ascending" aria-sort="ascending" style="width: 182px;" colspan="1" rowspan="1" aria-controls="listVhosts" tabindex="0" class="sorting">HostName</th>
                        <th aria-label="Port: activate to sort column ascending" style="width: 182px;" colspan="1" rowspan="1" aria-controls="listVhosts" tabindex="0" class="sorting">Port</th>
                        <th aria-label="Instance: activate to sort column ascending" style="width: 207px;" colspan="1" rowspan="1" aria-controls="listVhosts" tabindex="0" class="sorting">Instance</th>
                        <th aria-label="Status: activate to sort column descending"  style="width: 167px;" colspan="1" rowspan="1" aria-controls="listVhosts" tabindex="0" class="sorting_asc">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                     <tr  class="even" role="row" v-for="(item, index) in this.server">
                       <td class="sorting_1" >{{item.name}}</td>
                       <td>{{item.port}}</td>
                       <td>{{item.instance}}</td>
                       <td>Active</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="1" rowspan="1">Hosname</th>
                        <th colspan="1" rowspan="1">Port</th>
                        <th colspan="1" rowspan="1">instance</th>
                        <th colspan="1" rowspan="1">Satus</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
// Require needed datatables modules
import 'datatables.net'
import 'datatables.net-bs'

export default {
  data () {
    return {
      server: {
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      $('#listVhosts').DataTable()
    })
  },
  created: function () {
    var app = this
    axios.get('/api/getAllVHosts/')
      .then(function (response) {
        console.log(response.data)
        app.server = response.data.message
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
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
