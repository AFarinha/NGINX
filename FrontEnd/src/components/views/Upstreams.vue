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
		      	<label>Content List</label>

		        <UpstreamsList v-for="(upstream, index) in this.arrayUpstreams"
		            :upstream="upstream"
		            :key= "upstream"
		        </UpstreamsList>

		        </br>

		        <label>Content List Fim</label>

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
		      	<UpstreamItem v-for="(upstream, index) in this.arrayUpstreams" :upstream="upstream" :key="upstream" v-on:removeUpstream="removeUpstream(index)">
			      </UpstreamItem>
			      </br>
		      <button @click="addUpstream" type="button" class="btn btn-success">Add Upstream item</button>

		      </div>
		    </div>

		</div>
	</section>
</template>


<script>
// Imports
// import { EventBus } from '../../main.js'

export default {
  props: {
  },
  data () {
    return {
    }
  },
  created () {
    // para criar Streams por default
    var app = this
    console.log(app)
    // this.arrayUpstreams = arrayUpstreams []
  }
}
</script>

<style>

</style>
