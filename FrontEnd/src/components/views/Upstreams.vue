<template>
	<section class="content">
		<div>
			<div class="box box-solid box-primary">
		      <div class="box-header">
		          <h3 class="box-title"><b> List - Upstreams </b></h3>
		          <div class="box-tools pull-right">
		              <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
		          </div>
		      </div>
		      <div class="box-body">
		      <!--
		        <UpstreamsList>
		        </UpstreamsList>
		       -->
		       <data-tables
			      :data='this.upstreamList'
			      :row-action-def='rowActionsDef'
      			   action-col-label='Actions'
			      :has-action-col='true'>
			      <el-table-column prop='id' label="id" sortable="custom"></el-table-column>
			      <el-table-column prop='name' label="Name" sortable="custom"></el-table-column>
			      <el-table-column prop='instance' label="Instance" sortable="custom"></el-table-column>
			    </data-tables>
			    <!-- <el-table-column prop='config' label="Config" sortable="custom"></el-table-column> -->

			    <div v-if="responseError" class="alert alert-danger alert-dismissable">
			       <i class="fa fa-ban"></i>
			       <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
			       <b>Alert! </b>{{this.responseError}}
			    </div>
		      </div>
		    </div>

		    <div class="box box-solid box-primary">
		      <div class="box-header">
		          <h3 class="box-title"><b> Create - Upstreams </b></h3>
		          <div class="box-tools pull-right">
		              <button class="btn btn-default btn-sm" data-widget="collapse"><i class="fa fa-minus"></i></button>
		          </div>
		      </div>
		      <div class="box-body">
		      	<UpstreamsCreate v-bind:upstream="upstream">
			    </UpstreamsCreate>
		      </div>
		    </div>

		</div>
	</section>
</template>


<script>
// Imports
// import { EventBus } from '../../main.js'
import UpstreamsCreate from './UpstreamsCreate'
// import UpstreamsList from './UpstreamsList'
import axios from 'axios'
import 'element-ui/lib/theme-default/index.css'

export default {
  props: {
  },
  data () {
    return {
      upstream: {
        id: '',
        upstreamName: '',
        arrayUpstreamItems: []
      },
      upstreamList: [{ id: '', upstreamName: '', arrayUpstreamItems: [] }],
      responseSuccess: false,
      responseError: false,
      rowActionsDef: this.getRowActionsDef()
    }
  },
  created: function () {
    var self = this
    axios.get('/api/getAllUpstreams/')
      .then(function (response) {
        // console.log(response.data.message)
        self.upstreamList = response.data.message
      })
      .catch(error => {
        console.log(error)
        self.responseError = error.response.statusText + ' : ' + error.response.data
      })
  },
  methods: {
    getRowActionsDef () {
      let self = this
      return [{
        type: 'primary',
        handler (row) {
          // self.$message('Edit clicked')
          for (var i = self.upstreamList.length - 1; i >= 0; i--) {
            if (self.upstreamList[i].id === row.id) {
              self.upstream = JSON.parse(self.upstreamList[i].config)
            }
          }
        },
        name: 'Edit'
      }, {
        type: 'primary',
        handler (row) {
          console.log('Delete in row clicked', row, self.upstream)
          // self.$message('Delete in row clicked')
          axios.delete('/api/deleteUpstream/' + row.id + '/' + row.name)
          .then(function (response) {
            if (response.data.status === 'failed') {
              self.responseSuccess = false
              self.responseError = response.data
            } else {
              console.log('Resposta ok')
              axios.get('/api/getAllUpstreams/')
                .then(function (response) {
                  self.upstreamList = response.data.message
                })
                .catch(error => {
                  self.responseSuccess = false
                  self.responseError = error.response
                })
            }
          })
          .catch(error => {
            self.responseSuccess = false
            self.responseError = error.response
          })
        },
        name: 'Delete'
      }]
    }
  },
  components: {
    UpstreamsCreate: UpstreamsCreate
  }
}
</script>

<style>
</style>
