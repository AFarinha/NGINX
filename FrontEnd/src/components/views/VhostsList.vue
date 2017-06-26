<template>
  <section class="content">


    <data-tables
      :data='this.server'
      :has-action-col='false'
      @row-click='rowClick'>
      <el-table-column prop='id' label="id" sortable="custom"></el-table-column>
      <el-table-column prop='status' label="Status" sortable="custom"></el-table-column>
      <el-table-column prop='name' label="Host Name"  sortable="custom"></el-table-column>
      <el-table-column prop='port' label="Port" sortable="custom"></el-table-column>
      <el-table-column prop='instance' label="Instance" sortable="custom"></el-table-column>
    </data-tables>

<!--
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
-->
    <div v-if="responseError" class="alert alert-danger alert-dismissable">
       <i class="fa fa-ban"></i>
       <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
       <b>Alert! </b>{{this.responseError}}
    </div>

  </section>
</template>

<script>
import axios from 'axios'

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import DataTables from 'vue-data-tables'

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

Vue.use(ElementUI)
Vue.use(DataTables)

export default {
  data () {
    return {
      server: [],
      responseError: false
    }
  },
  methods: {
    rowClick (row) {
      this.$router.push(
        {
          path: 'VHost/' + row.id
        }
      )
    }
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
        app.responseError = error.response.statusText + ' : ' + error.response.data
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
