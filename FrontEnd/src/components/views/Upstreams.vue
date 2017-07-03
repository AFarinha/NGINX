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

		        <UpstreamsList>
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
		      	<UpstreamsCreate>
			    </UpstreamsCreate>
			    </br>

		      </div>
		    </div>

		</div>
	</section>
</template>


<script>
// Imports
// import { EventBus } from '../../main.js'
import UpstreamsCreate from './UpstreamsCreate'
import UpstreamsList from './UpstreamsList'

export default {
  props: {
  },
  data () {
    return {
    }
  },
  components: {
    UpstreamsCreate: UpstreamsCreate,
    UpstreamsList: UpstreamsList
  }
}
</script>

<style>
</style>

