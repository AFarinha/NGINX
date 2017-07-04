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
        arrayUpstreamItems: [{type: '', subType: '', config: ''}]
      },
      upstreamList: [{id: '', name: '', instance: '', config: ''}],
      responseSuccess: false,
      responseError: false,
      rowActionsDef:
      [{
        type: 'primary',
        handler (row) {
          //var self = this
          console.log(row)
          console.log('Edit in row clicked', row)
        },
        name: 'Edit'
      }, {
        type: 'primary',
        handler (row) {
          console.log('Remove in row clicked', row)
        },
        name: 'Remove'
      }]
    }
  },
  created: function () {
    var self = this
    axios.get('/api/getAllUpstreams/')
      .then(function (response) {
        console.log(response.data)
        self.upstreamList = response.data.message
        console.log(response)
      })
      .catch(error => {
        console.log(error)
        self.responseError = error.response.statusText + ' : ' + error.response.data
      })
  },
  components: {
    UpstreamsCreate: UpstreamsCreate
  }
}
</script>

<style>
</style>

