<template>
  <canvas id="TimesChart" ></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  props: ['arrTimesChart', 'maxSize'],
  name: 'TimesChart',
  data () {
    return {
      TimesChart: ''
    }
  },
  watch: {
    arrTimesChart: function (value) {
      var self = this

      self.TimesChart.data.labels.shift()
      self.TimesChart.data.labels.push(value[0].y)
      for (var i = 0; i < value.length; i++) {
        self.TimesChart.data.datasets[i].data.shift()
        self.TimesChart.data.datasets[i].data.push(value[i].x)
      }
      self.TimesChart.update(0)
    }
  },
  mounted () {
    this.$nextTick(() => {
      var self = this
      var ctx = document.getElementById('TimesChart').getContext('2d')
      var config = {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Total',
            fill: false,
            borderColor: '#CDD452',
            pointBackgroundColor: '#CDD452',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Upstream',
            borderColor: '#F9722E',
            pointBackgroundColor: '#F9722E',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: [] // this.xx3
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
      self.TimesChart = new Chart(ctx, config)
      self.TimesChart.data.datasets.forEach((dataset) => {
        for (var i = 0; i < self.maxSize; i++) {
          dataset.data.push(0)
        }
      })
      for (var i = 0; i < self.maxSize; i++) {
        self.TimesChart.data.labels.push('')
      }
      self.TimesChart.update()
    })
  }
}
</script>

<style>

</style>
