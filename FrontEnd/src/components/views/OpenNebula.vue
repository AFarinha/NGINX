<template>
  <section class="content">

    <OpenNebulaVMItem v-for="(vmDetail, index) in this.VMList" :vmDetails="vmDetail" :key="vmDetail" v-on:removeVMItem="removeVMItem(index)">
    </OpenNebulaVMItem>

  </section>
</template>

<script>
import axios from 'axios'
import OpenNebulaVMItem from './OpenNebulaVMItem'

export default {
  data () {
    return {
      VMList: [{
        id: '',
        name: '',
        user: '',
        state: '',
        deplyId: '',
        realTime_CPU: '',
        realTime_MEMORY: '',
        realTime_STATE: '',
        templateId: ''
      }],
      responseSuccess: false,
      responseError: false
    }
  },
  methods: {
    removeVMItem (index) {
      this.VMList.splice(index, 1)
    }
  },
  created () {
    var self = this
    axios.get('/api/opennebula/listVMs')
      .then(function (response) {
        if (response.data.status === 'ok') {
          console.log(response.data.message)
          self.VMList = response.data.message
          // self.responseSuccess = response.data
        } else {
          self.responseError = response.data.message
        }
      })
      .catch(error => {
        self.responseError = error.response
      })
  },
  components: {
    OpenNebulaVMItem: OpenNebulaVMItem
  }
}
</script>

<style>

</style>
