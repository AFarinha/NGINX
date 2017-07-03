<template>
  <canvas id="BandwidthChart" ></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  props: ['arrBandwidthChart', 'maxSize'],
  name: 'BandwidthChart',
  data () {
    return {
      BandwidthChart: ''
    }
  },
  watch: {
    arrBandwidthChart: function (value) {
      var self = this

      self.BandwidthChart.data.labels.shift()
      self.BandwidthChart.data.labels.push(value[0].y)
      for (var i = 0; i < value.length; i++) {
        self.BandwidthChart.data.datasets[i].data.shift()
        self.BandwidthChart.data.datasets[i].data.push(value[i].x)
      }
      self.BandwidthChart.update(0)
    }
  },
  mounted () {
    this.$nextTick(() => {
      var self = this
      var ctx = document.getElementById('BandwidthChart').getContext('2d')
      var config = {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'MB',
            fill: false,
            borderColor: '#284184',
            pointBackgroundColor: '#284184',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
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
      self.BandwidthChart = new Chart(ctx, config)
      self.BandwidthChart.data.datasets.forEach((dataset) => {
        for (var i = 0; i < self.maxSize; i++) {
          dataset.data.push(0)
        }
      })
      for (var i = 0; i < self.maxSize; i++) {
        self.BandwidthChart.data.labels.push('')
      }
      self.BandwidthChart.update()
    })
  }
}
</script>

<style>

</style>
