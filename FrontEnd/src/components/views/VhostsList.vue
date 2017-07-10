<template>
  <section class="content">

    <data-tables
      :data='this.server'
	    :row-action-def='rowActionsDef'
      action-col-label='Actions'>
      <el-table-column prop='id' label="id" sortable="custom"></el-table-column>
      <el-table-column prop='status' label="Status" sortable="custom"></el-table-column>
      <el-table-column prop='name' label="Host Name"  sortable="custom"></el-table-column>
      <el-table-column prop='port' label="Port" sortable="custom"></el-table-column>
      <el-table-column prop='instance' label="Instance" sortable="custom"></el-table-column>
    </data-tables>

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
      responseError: false,
      responseSuccess: false,
      rowActionsDef: this.getRowActionsDef()
    }
  },
  methods: {
    /* rowClick (row) {
      this.$router.push(
        {
          path: 'VHost/' + row.id
        }
      )
    }, */
    getRowActionsDef () {
      let app = this
      return [{
        type: 'danger',
        handler (row) {
          axios.delete('/api/deleteVHost2/' + row.id + '/' + row.name + '/' + row.port + '/' + row.instance)
          .then(function (response) {
            if (response.data.status === 'failed') {
              app.responseError = response.data
              app.responseSuccess = false
            } else {
              app.responseSuccess = response.data
              app.responseError = false
              app.server.forEach((svr, i) => {
                if (svr.id === row.id) {
                  app.server.splice(i, 1)
                }
              })
            }
          })
          .catch(error => {
            console.log('error')
            app.responseSuccess = false
            app.responseError = error.response.statusText + ' : ' + error.response.data
          })
        },
        name: 'Delete'
      }, {
        type: 'primary',
        handler (row) {
          var root = app.$root
          var router = root.$router
          router.push(
            {
              path: 'VHost/' + row.id
            }
          )
          // window.location.href = 'VHost/' + row.id
        },
        name: 'Edit'
      }]
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
