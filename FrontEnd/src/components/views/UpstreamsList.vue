<template>
	<section class="content">
		{{server}}

		<data-tables
	      :data='this.server'
	      :has-action-col='false'>
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
	  props: {
	    upstream: {
	      type: Object,
	      required: true
	    }
	  },data () {
	    return {
	      server: [],
	      responseError: false
	    }
	  },
	  methods: {
	  },
	  created: function () {
	    var app = this
	    axios.get('/api/getAllUpstreams/')
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