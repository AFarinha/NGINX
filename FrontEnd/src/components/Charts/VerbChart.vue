<template>
  <canvas id="verbChart" ></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  props: ['arrVerbChart', 'maxSize'],
  name: 'VerbChart',
  data () {
    return {
      VerbChart: ''
    }
  },
  watch: {
    arrVerbChart: function (value) {
      var self = this

      self.VerbChart.data.labels.shift()
      self.VerbChart.data.labels.push(value[0].y)
      for (var i = 0; i < value.length; i++) {
        self.VerbChart.data.datasets[i].data.shift()
        self.VerbChart.data.datasets[i].data.push(value[i].x)
      }
      self.VerbChart.update(0)
    }
  },
  mounted () {
    this.$nextTick(() => {
      var self = this
      var ctx = document.getElementById('verbChart').getContext('2d')
      var config = {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'GET',
            fill: false,
            borderColor: '#CDD452',
            pointBackgroundColor: '#CDD452',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'POST',
            borderColor: '#FEE169',
            pointBackgroundColor: '#FEE169',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: [] // this.xx3
          }, {
            label: 'OPTIONS',
            borderColor: '#F9722E',
            pointBackgroundColor: '#F9722E',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: [] // this.xx4
          }, {
            label: 'DELETE',
            borderColor: '#C9313D',
            pointBackgroundColor: '#C9313D',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: [] // this.xx5
          }, {
            label: 'other',
            borderColor: '#68776C',
            pointBackgroundColor: '#68776C',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: [] // this.other
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: !this.isMobile,
          legend: {
            position: 'bottom',
            display: true
          },
          tooltips: {
            mode: 'label',
            xPadding: 10,
            yPadding: 10,
            bodySpacing: 10
          }
        }
      }
      self.VerbChart = new Chart(ctx, config)
      self.VerbChart.data.datasets.forEach((dataset) => {
        for (var i = 0; i < self.maxSize; i++) {
          dataset.data.push(0)
        }
      })
      for (var i = 0; i < self.maxSize; i++) {
        self.VerbChart.data.labels.push('')
      }
      self.VerbChart.update()
    })
  }
}
</script>

<style>

</style>
