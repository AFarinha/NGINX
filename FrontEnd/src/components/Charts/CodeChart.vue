<template>
  <canvas id="Codechart" ></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  props: ['arrCodeChart', 'maxSize'],
  name: 'CodeChart',
  data () {
    return {
      CodeChart: ''
    }
  },
  watch: {
    arrCodeChart: function (value) {
      var self = this
      self.CodeChart.data.labels.shift()
      self.CodeChart.data.labels.push(value[0].y)
      for (var i = 0; i < value.length; i++) {
        self.CodeChart.data.datasets[i].data.shift()
        self.CodeChart.data.datasets[i].data.push(value[i].x)
      }
      self.CodeChart.update(0)
    }
  },
  mounted () {
    this.$nextTick(() => {
      var self = this
      var ctx = document.getElementById('Codechart').getContext('2d')
      var config = {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: '2xx',
            fill: false,
            borderColor: '#284184',
            pointBackgroundColor: '#284184',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: '3xx',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: [] // this.xx3
          }, {
            label: '4xx',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: [] // this.xx4
          }, {
            label: '5xx',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: [] // this.xx5
          }, {
            label: 'other',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
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
      self.CodeChart = new Chart(ctx, config)
      self.CodeChart.data.datasets.forEach((dataset) => {
        for (var i = 0; i < self.maxSize; i++) {
          dataset.data.push(0)
        }
      })
      for (var i = 0; i < self.maxSize; i++) {
        self.CodeChart.data.labels.push('')
      }
      self.CodeChart.update()
    })
  }
}
</script>

<style>

</style>
